package com.kaabuydev.kaabuy.Services;

import com.kaabuydev.kaabuy.DTO.Order.OrderItemRequest;
import com.kaabuydev.kaabuy.DTO.Order.OrderItemResponse;
import com.kaabuydev.kaabuy.DTO.Order.OrderRequest;
import com.kaabuydev.kaabuy.DTO.Order.OrderResponse;
import com.kaabuydev.kaabuy.Exceptions.ResourceNotFoundException;
import com.kaabuydev.kaabuy.Models.*;
import com.kaabuydev.kaabuy.Repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final StaffRepository staffRepository;
    private final TransactionRepository transactionRepository;
    private final ProductService productService;

    public OrderService(OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            CustomerRepository customerRepository,
            StaffRepository staffRepository,
            TransactionRepository transactionRepository,
            ProductService productService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.staffRepository = staffRepository;
        this.transactionRepository = transactionRepository;
        this.productService = productService;
    }

    // ==================== POS CHECKOUT ====================

    // Main checkout method - creates order, deducts stock, creates transaction
    public OrderResponse checkout(OrderRequest request) {
        // Validate staff
        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff", "staffId", request.getStaffId()));

        // Validate customer if provided (for UTANG)
        Customer customer = null;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Customer", "customerId", request.getCustomerId()));
        }

        // For UTANG payment, customer is required
        if ("UTANG".equalsIgnoreCase(request.getPaymentMethod()) && customer == null) {
            throw new RuntimeException("Customer is required for UTANG payment");
        }

        // Create order
        Order order = new Order();
        order.setStaff(staff);
        order.setCustomer(customer);
        order.setStatus("COMPLETED");
        order.setTotalAmount(BigDecimal.ZERO);

        // Save order first to get ID
        order = orderRepository.save(order);

        // Process order items
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Product", "productId", itemRequest.getProductId()));

            int displayStock = product.getCurrentStock() != null ? product.getCurrentStock() : 0;
            int requestedQty = itemRequest.getQuantity();

            // Check display stock availability
            if (displayStock < requestedQty) {
                throw new RuntimeException("Insufficient display stock for product: " + product.getProductName() +
                        ". Available on display: " + displayStock + ", Requested: " + requestedQty);
            }

            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(requestedQty);
            orderItem.setUnitPrice(product.getListPrice());
            BigDecimal subtotal = product.getListPrice().multiply(BigDecimal.valueOf(requestedQty));
            orderItem.setSubtotal(subtotal);

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(subtotal);

            // Deduct from display stock
            product.setCurrentStock(displayStock - requestedQty);
            productRepository.save(product);

        }

        // Save order items
        orderItemRepository.saveAll(orderItems);

        // Update order total
        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);
        order = orderRepository.save(order);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setOrder(order);

        // FIX: If payment method is UTANG or CREDIT, amount paid is 0
        if ("UTANG".equalsIgnoreCase(request.getPaymentMethod()) ||
                "CREDIT".equalsIgnoreCase(request.getPaymentMethod())) {
            transaction.setAmount(BigDecimal.ZERO);
        } else {
            transaction.setAmount(totalAmount);
        }

        transaction.setPaymentMethod(request.getPaymentMethod());
        if (customer != null) {
            transaction.setCustomer(customer);
        }
        transactionRepository.saveAndFlush(transaction);

        // Calculate change (for cash payments)
        BigDecimal amountPaid = request.getAmountPaid() != null ? request.getAmountPaid() : totalAmount;
        BigDecimal change = amountPaid.subtract(totalAmount);

        return mapToResponse(order, request.getPaymentMethod(), amountPaid, change);
    }

    // ==================== ORDER CRUD ====================

    // Get all orders
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc()
                .stream()
                .map(order -> mapToResponse(order, null, null, null))
                .collect(Collectors.toList());
    }

    // Get order by ID
    public OrderResponse getOrderById(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));
        return mapToResponse(order, null, null, null);
    }

    // Get orders by customer
    public List<OrderResponse> getOrdersByCustomer(Integer customerId) {
        return orderRepository.findByCustomerCustomerId(customerId)
                .stream()
                .map(order -> mapToResponse(order, null, null, null))
                .collect(Collectors.toList());
    }

    // Get orders by staff
    public List<OrderResponse> getOrdersByStaff(Integer staffId) {
        return orderRepository.findByStaff_StaffIdOrderByOrderDateDesc(staffId)
                .stream()
                .map(order -> mapToResponse(order, null, null, null))
                .collect(Collectors.toList());
    }

    // Get orders by status
    public List<OrderResponse> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status)
                .stream()
                .map(order -> mapToResponse(order, null, null, null))
                .collect(Collectors.toList());
    }

    // Get orders by date range
    public List<OrderResponse> getOrdersByDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        return orderRepository.findByDateRange(start, end)
                .stream()
                .map(order -> mapToResponse(order, null, null, null))
                .collect(Collectors.toList());
    }

    // Get today's orders
    public List<OrderResponse> getTodayOrders() {
        return orderRepository.findTodayOrders()
                .stream()
                .map(order -> mapToResponse(order, null, null, null))
                .collect(Collectors.toList());
    }

    // ==================== ORDER MANAGEMENT ====================

    // Cancel order (restore stock)
    public OrderResponse cancelOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));

        if ("CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Order is already cancelled");
        }

        // Restore stock for each item
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setCurrentStock(product.getCurrentStock() + item.getQuantity());
            product.setIsLowStock(product.getCurrentStock() <= product.getReorderLevel());
            productRepository.save(product);
        }

        order.setStatus("CANCELLED");
        order = orderRepository.save(order);

        return mapToResponse(order, null, null, null);
    }

    // ==================== ORDER SUMMARY ====================

    public Map<String, Object> getOrderSummary() {
        List<Order> allOrders = orderRepository.findAll();
        List<Order> todayOrders = orderRepository.findTodayOrders();

        BigDecimal totalSales = allOrders.stream()
                .filter(o -> "COMPLETED".equals(o.getStatus()))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal todaySales = todayOrders.stream()
                .filter(o -> "COMPLETED".equals(o.getStatus()))
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalOrders", allOrders.size());
        summary.put("todayOrders", todayOrders.size());
        summary.put("totalSales", totalSales);
        summary.put("todaySales", todaySales);
        summary.put("completedOrders", orderRepository.countByStatus("COMPLETED"));
        summary.put("cancelledOrders", orderRepository.countByStatus("CANCELLED"));

        return summary;
    }

    // ==================== HELPER METHODS ====================

    private OrderResponse mapToResponse(Order order, String paymentMethod, BigDecimal amountPaid, BigDecimal change) {
        List<OrderItemResponse> itemResponses = order.getOrderItems() != null
                ? order.getOrderItems().stream()
                        .map(this::mapItemToResponse)
                        .collect(Collectors.toList())
                : new ArrayList<>();

        // Get payment method from transaction if not provided
        if (paymentMethod == null && order.getTransactions() != null && !order.getTransactions().isEmpty()) {
            paymentMethod = order.getTransactions().get(0).getPaymentMethod();
        }

        return new OrderResponse(
                order.getOrderId(),
                order.getOrderDate(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getStaff() != null ? order.getStaff().getStaffId() : null,
                order.getStaff() != null ? order.getStaff().getFirstName() + " " + order.getStaff().getLastName()
                        : null,
                order.getCustomer() != null ? order.getCustomer().getCustomerId() : null,
                order.getCustomer() != null ? order.getCustomer().getCustomerName() : null,
                paymentMethod,
                amountPaid,
                change,
                itemResponses);
    }

    private OrderItemResponse mapItemToResponse(OrderItem item) {
        return new OrderItemResponse(
                item.getOrderItemId(),
                item.getProduct().getProductId(),
                item.getProduct().getProductName(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getSubtotal());
    }
}
