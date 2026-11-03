package com.kaabuydev.kaabuy.Services;

import com.kaabuydev.kaabuy.DTO.Dashboard.DashboardStats;
import com.kaabuydev.kaabuy.Models.Customer;
import com.kaabuydev.kaabuy.Models.Order;
import com.kaabuydev.kaabuy.Models.OrderItem;
import com.kaabuydev.kaabuy.Models.Transaction;
import com.kaabuydev.kaabuy.Repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;
    private final SupplierRepository supplierRepository;

    public DashboardService(OrderRepository orderRepository,
            ProductRepository productRepository,
            CustomerRepository customerRepository,
            TransactionRepository transactionRepository,
            SupplierRepository supplierRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
        this.supplierRepository = supplierRepository;
    }

    // Get complete dashboard statistics for a specific date
    public DashboardStats getDashboardStats(LocalDate date) {
        DashboardStats stats = new DashboardStats();

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();

        // Sales Summary for the selected date
        stats.setTodaySales(calculateSalesBetween(startOfDay, endOfDay));
        stats.setWeekSales(calculateSalesSince(date.minusDays(6).atStartOfDay()));
        stats.setMonthSales(calculateSalesSince(date.minusDays(29).atStartOfDay()));
        stats.setTotalSales(calculateTotalSales());

        // Products Sold count for the selected date (sum of all item quantities)
        stats.setTodayOrders(countProductsSoldBetween(startOfDay, endOfDay));
        stats.setTotalOrders(orderRepository.count());
        stats.setCompletedOrders(orderRepository.countByStatus("COMPLETED"));
        stats.setCancelledOrders(orderRepository.countByStatus("CANCELLED"));

        // Inventory Summary (always current, not date-specific)
        stats.setTotalProducts(productRepository.count());
        stats.setLowStockProducts(productRepository.countLowStock());
        stats.setOutOfStockProducts(productRepository.countOutOfStock());
        stats.setTotalSuppliers(supplierRepository.count());

        // Customer Summary for the selected date
        // Daily customers = unique customers + walk-in orders on that date
        long dailyRegisteredCustomers = countRegisteredCustomerOrdersBetween(startOfDay, endOfDay);
        long dailyWalkInCustomers = countWalkInOrdersBetween(startOfDay, endOfDay);
        stats.setTotalCustomers(dailyRegisteredCustomers + dailyWalkInCustomers);
        stats.setRegisteredCustomers(dailyRegisteredCustomers);
        stats.setWalkInCustomers(dailyWalkInCustomers);

        // Utang summary (always current)
        List<Customer> customersWithUtang = customerRepository.findCustomersWithUtang();
        stats.setCustomersWithUtang((long) customersWithUtang.size());
        stats.setTotalUtang(calculateTotalUtang(customersWithUtang));

        // Top Selling Products (top 5, always all-time for now)
        stats.setTopProducts(getTopSellingProducts(5));

        // Recent Transactions (last 10)
        stats.setRecentTransactions(getRecentTransactions(10));

        return stats;
    }

    // Backward compatible: default to today
    public DashboardStats getDashboardStats() {
        return getDashboardStats(LocalDate.now());
    }

    // Get sales summary only
    public Map<String, Object> getSalesSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("todaySales", calculateSalesSince(LocalDateTime.now().toLocalDate().atStartOfDay()));
        summary.put("weekSales", calculateSalesSince(LocalDateTime.now().minusDays(7)));
        summary.put("monthSales", calculateSalesSince(LocalDateTime.now().minusDays(30)));
        summary.put("totalSales", calculateTotalSales());
        return summary;
    }

    // Get inventory alerts
    public Map<String, Object> getInventoryAlerts() {
        Map<String, Object> alerts = new HashMap<>();
        alerts.put("lowStockCount", productRepository.countLowStock());
        alerts.put("outOfStockCount", productRepository.countOutOfStock());
        alerts.put("lowStockProducts", productRepository.findByIsLowStockTrue());
        alerts.put("outOfStockProducts", productRepository.findOutOfStockProducts());
        return alerts;
    }

    // Get utang summary
    public Map<String, Object> getUtangSummary() {
        List<Customer> customersWithUtang = customerRepository.findCustomersWithUtang();
        BigDecimal totalUtang = calculateTotalUtang(customersWithUtang);

        Map<String, Object> summary = new HashMap<>();
        summary.put("customersWithUtang", customersWithUtang.size());
        summary.put("totalUtang", totalUtang);
        return summary;
    }

    // Get sales chart data for different periods
    public List<Map<String, Object>> getSalesChartData(String period) {
        List<Map<String, Object>> chartData = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        switch (period.toLowerCase()) {
            case "today":
                // Hourly data for today
                LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
                for (int hour = 0; hour < 24; hour++) {
                    LocalDateTime hourStart = startOfDay.plusHours(hour);
                    LocalDateTime hourEnd = hourStart.plusHours(1);
                    BigDecimal sales = calculateSalesBetween(hourStart, hourEnd);

                    Map<String, Object> dataPoint = new HashMap<>();
                    dataPoint.put("label", String.format("%02d:00", hour));
                    dataPoint.put("fullLabel", String.format("%02d:00 - %02d:00", hour, (hour + 1) % 24));
                    dataPoint.put("value", sales);
                    chartData.add(dataPoint);
                }
                break;

            case "week":
                // Daily data for the last 7 days
                for (int i = 6; i >= 0; i--) {
                    LocalDateTime dayStart = now.minusDays(i).toLocalDate().atStartOfDay();
                    LocalDateTime dayEnd = dayStart.plusDays(1);
                    BigDecimal sales = calculateSalesBetween(dayStart, dayEnd);

                    Map<String, Object> dataPoint = new HashMap<>();
                    dataPoint.put("label", dayStart.format(DateTimeFormatter.ofPattern("EEE")));
                    dataPoint.put("fullLabel", dayStart.format(DateTimeFormatter.ofPattern("EEEE, MMM dd")));
                    dataPoint.put("value", sales);
                    chartData.add(dataPoint);
                }
                break;

            case "month":
                // Weekly data for the last 4 weeks
                for (int i = 3; i >= 0; i--) {
                    LocalDateTime weekStart = now.minusWeeks(i).toLocalDate().atStartOfDay();
                    LocalDateTime weekEnd = weekStart.plusWeeks(1);
                    BigDecimal sales = calculateSalesBetween(weekStart, weekEnd);

                    Map<String, Object> dataPoint = new HashMap<>();
                    dataPoint.put("label", "Week " + (4 - i));
                    dataPoint.put("fullLabel", weekStart.format(DateTimeFormatter.ofPattern("MMM dd")) +
                            " - " + weekEnd.format(DateTimeFormatter.ofPattern("MMM dd")));
                    dataPoint.put("value", sales);
                    chartData.add(dataPoint);
                }
                break;

            case "year":
                // Monthly data for the last 12 months
                for (int i = 11; i >= 0; i--) {
                    LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1).toLocalDate().atStartOfDay();
                    LocalDateTime monthEnd = monthStart.plusMonths(1);
                    BigDecimal sales = calculateSalesBetween(monthStart, monthEnd);

                    Map<String, Object> dataPoint = new HashMap<>();
                    dataPoint.put("label", monthStart.format(DateTimeFormatter.ofPattern("MMM")));
                    dataPoint.put("fullLabel", monthStart.format(DateTimeFormatter.ofPattern("MMMM yyyy")));
                    dataPoint.put("value", sales);
                    chartData.add(dataPoint);
                }
                break;

            default:
                throw new IllegalArgumentException("Invalid period: " + period);
        }

        return chartData;
    }

    // ==================== HELPER METHODS ====================

    private BigDecimal calculateSalesSince(LocalDateTime since) {
        List<Order> orders = orderRepository.findCompletedOrdersSince(since);
        return orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateSalesBetween(LocalDateTime start, LocalDateTime end) {
        List<Order> orders = orderRepository.findCompletedOrdersSince(start);
        return orders.stream()
                .filter(order -> order.getOrderDate().isBefore(end))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private long countProductsSoldBetween(LocalDateTime start, LocalDateTime end) {
        List<Order> orders = orderRepository.findCompletedOrdersSince(start);
        return orders.stream()
                .filter(order -> order.getOrderDate().isBefore(end))
                .flatMap(order -> order.getOrderItems() != null ? order.getOrderItems().stream()
                        : java.util.stream.Stream.empty())
                .count();
    }

    private long countRegisteredCustomerOrdersBetween(LocalDateTime start, LocalDateTime end) {
        List<Order> orders = orderRepository.findCompletedOrdersSince(start);
        return orders.stream()
                .filter(order -> order.getOrderDate().isBefore(end))
                .filter(order -> order.getCustomer() != null)
                .map(order -> order.getCustomer().getCustomerId())
                .distinct()
                .count();
    }

    private long countWalkInOrdersBetween(LocalDateTime start, LocalDateTime end) {
        List<Order> orders = orderRepository.findCompletedOrdersSince(start);
        return orders.stream()
                .filter(order -> order.getOrderDate().isBefore(end))
                .filter(order -> order.getCustomer() == null)
                .count();
    }

    private BigDecimal calculateTotalSales() {
        List<Order> orders = orderRepository.findByStatus("COMPLETED");
        return orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateTotalUtang(List<Customer> customers) {
        // Calculate global debt incurred (Sum of Order Totals for UTANG/CREDIT + Legacy
        // Amounts)
        BigDecimal globalDebt = transactionRepository.sumGlobalOrderTotalByPaymentMethods(
                List.of("UTANG", "CREDIT"));

        // Calculate global payments made (Sum of Amounts for PAYMENT)
        BigDecimal globalPayments = transactionRepository.sumGlobalAmountByPaymentMethods(
                List.of("PAYMENT"));

        // Ensure non-null
        globalDebt = globalDebt != null ? globalDebt : BigDecimal.ZERO;
        globalPayments = globalPayments != null ? globalPayments : BigDecimal.ZERO;

        return globalDebt.subtract(globalPayments);
    }

    private List<DashboardStats.TopProduct> getTopSellingProducts(int limit) {
        // Get all completed orders with items
        List<Order> completedOrders = orderRepository.findByStatus("COMPLETED");

        // Aggregate sales by product
        Map<Integer, ProductSalesData> productSales = new HashMap<>();

        for (Order order : completedOrders) {
            if (order.getOrderItems() != null) {
                for (OrderItem item : order.getOrderItems()) {
                    Integer productId = item.getProduct().getProductId();
                    ProductSalesData data = productSales.getOrDefault(productId,
                            new ProductSalesData(productId, item.getProduct().getProductName()));
                    data.addSale(item.getQuantity(), item.getSubtotal());
                    productSales.put(productId, data);
                }
            }
        }

        // Sort by quantity sold and return top N
        return productSales.values().stream()
                .sorted((a, b) -> Long.compare(b.quantitySold, a.quantitySold))
                .limit(limit)
                .map(data -> new DashboardStats.TopProduct(
                        data.productId,
                        data.productName,
                        data.quantitySold,
                        data.totalRevenue))
                .collect(Collectors.toList());
    }

    private List<DashboardStats.RecentTransaction> getRecentTransactions(int limit) {
        List<Transaction> transactions = transactionRepository.findAllByOrderByTransactionDateDesc();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        return transactions.stream()
                .limit(limit)
                .map(t -> new DashboardStats.RecentTransaction(
                        t.getTransactionId(),
                        t.getAmount(),
                        t.getPaymentMethod(),
                        t.getCustomer() != null ? t.getCustomer().getCustomerName() : null,
                        t.getTransactionDate().format(formatter)))
                .collect(Collectors.toList());
    }

    // Helper class for aggregating product sales
    private static class ProductSalesData {
        Integer productId;
        String productName;
        long quantitySold = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;

        ProductSalesData(Integer productId, String productName) {
            this.productId = productId;
            this.productName = productName;
        }

        void addSale(int quantity, BigDecimal subtotal) {
            this.quantitySold += quantity;
            this.totalRevenue = this.totalRevenue.add(subtotal);
        }
    }
}
