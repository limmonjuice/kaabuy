package com.kaabuydev.kaabuy.DTO.Dashboard;

import java.math.BigDecimal;
import java.util.List;

public class DashboardStats {

    // Sales Summary
    private BigDecimal todaySales;
    private BigDecimal weekSales;
    private BigDecimal monthSales;
    private BigDecimal totalSales;

    // Order Counts
    private Long todayOrders;
    private Long totalOrders;
    private Long completedOrders;
    private Long cancelledOrders;

    // Inventory Summary
    private Long totalProducts;
    private Long lowStockProducts;
    private Long outOfStockProducts;
    private Long totalSuppliers;

    // Customer Summary
    private Long totalCustomers;
    private Long registeredCustomers;
    private Long walkInCustomers;
    private Long customersWithUtang;
    private BigDecimal totalUtang;

    // Top Selling Products
    private List<TopProduct> topProducts;

    // Recent Transactions
    private List<RecentTransaction> recentTransactions;

    public DashboardStats() {
    }

    // Inner class for top products
    public static class TopProduct {
        private Integer productId;
        private String productName;
        private Long quantitySold;
        private BigDecimal totalRevenue;

        public TopProduct() {
        }

        public TopProduct(Integer productId, String productName, Long quantitySold, BigDecimal totalRevenue) {
            this.productId = productId;
            this.productName = productName;
            this.quantitySold = quantitySold;
            this.totalRevenue = totalRevenue;
        }

        public Integer getProductId() {
            return productId;
        }

        public void setProductId(Integer productId) {
            this.productId = productId;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public Long getQuantitySold() {
            return quantitySold;
        }

        public void setQuantitySold(Long quantitySold) {
            this.quantitySold = quantitySold;
        }

        public BigDecimal getTotalRevenue() {
            return totalRevenue;
        }

        public void setTotalRevenue(BigDecimal totalRevenue) {
            this.totalRevenue = totalRevenue;
        }
    }

    // Inner class for recent transactions
    public static class RecentTransaction {
        private Integer transactionId;
        private BigDecimal amount;
        private String paymentMethod;
        private String customerName;
        private String transactionDate;

        public RecentTransaction() {
        }

        public RecentTransaction(Integer transactionId, BigDecimal amount, String paymentMethod,
                String customerName, String transactionDate) {
            this.transactionId = transactionId;
            this.amount = amount;
            this.paymentMethod = paymentMethod;
            this.customerName = customerName;
            this.transactionDate = transactionDate;
        }

        public Integer getTransactionId() {
            return transactionId;
        }

        public void setTransactionId(Integer transactionId) {
            this.transactionId = transactionId;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }

        public String getCustomerName() {
            return customerName;
        }

        public void setCustomerName(String customerName) {
            this.customerName = customerName;
        }

        public String getTransactionDate() {
            return transactionDate;
        }

        public void setTransactionDate(String transactionDate) {
            this.transactionDate = transactionDate;
        }
    }

    // Getters and Setters
    public BigDecimal getTodaySales() {
        return todaySales;
    }

    public void setTodaySales(BigDecimal todaySales) {
        this.todaySales = todaySales;
    }

    public BigDecimal getWeekSales() {
        return weekSales;
    }

    public void setWeekSales(BigDecimal weekSales) {
        this.weekSales = weekSales;
    }

    public BigDecimal getMonthSales() {
        return monthSales;
    }

    public void setMonthSales(BigDecimal monthSales) {
        this.monthSales = monthSales;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }

    public Long getTodayOrders() {
        return todayOrders;
    }

    public void setTodayOrders(Long todayOrders) {
        this.todayOrders = todayOrders;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(Long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public Long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(Long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Long getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(Long lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public Long getOutOfStockProducts() {
        return outOfStockProducts;
    }

    public void setOutOfStockProducts(Long outOfStockProducts) {
        this.outOfStockProducts = outOfStockProducts;
    }

    public Long getTotalSuppliers() {
        return totalSuppliers;
    }

    public void setTotalSuppliers(Long totalSuppliers) {
        this.totalSuppliers = totalSuppliers;
    }

    public Long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(Long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public Long getRegisteredCustomers() {
        return registeredCustomers;
    }

    public void setRegisteredCustomers(Long registeredCustomers) {
        this.registeredCustomers = registeredCustomers;
    }

    public Long getWalkInCustomers() {
        return walkInCustomers;
    }

    public void setWalkInCustomers(Long walkInCustomers) {
        this.walkInCustomers = walkInCustomers;
    }

    public Long getCustomersWithUtang() {
        return customersWithUtang;
    }

    public void setCustomersWithUtang(Long customersWithUtang) {
        this.customersWithUtang = customersWithUtang;
    }

    public BigDecimal getTotalUtang() {
        return totalUtang;
    }

    public void setTotalUtang(BigDecimal totalUtang) {
        this.totalUtang = totalUtang;
    }

    public List<TopProduct> getTopProducts() {
        return topProducts;
    }

    public void setTopProducts(List<TopProduct> topProducts) {
        this.topProducts = topProducts;
    }

    public List<RecentTransaction> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<RecentTransaction> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }
}
