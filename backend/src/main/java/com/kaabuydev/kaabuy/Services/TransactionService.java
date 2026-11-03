package com.kaabuydev.kaabuy.Services;

import com.kaabuydev.kaabuy.DTO.Transaction.TransactionRequest;
import com.kaabuydev.kaabuy.DTO.Transaction.TransactionResponse;
import com.kaabuydev.kaabuy.Exceptions.ResourceNotFoundException;
import com.kaabuydev.kaabuy.Models.Customer;
import com.kaabuydev.kaabuy.Models.Order;
import com.kaabuydev.kaabuy.Models.Transaction;
import com.kaabuydev.kaabuy.Repositories.CustomerRepository;
import com.kaabuydev.kaabuy.Repositories.OrderRepository;
import com.kaabuydev.kaabuy.Repositories.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    public TransactionService(TransactionRepository transactionRepository,
            CustomerRepository customerRepository,
            OrderRepository orderRepository) {
        this.transactionRepository = transactionRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
    }

    // Create a new transaction
    public TransactionResponse createTransaction(TransactionRequest request) {
        Transaction transaction = new Transaction();

        // If payment method is UTANG or CREDIT, amount paid is 0
        // (Debt is calculated from Order Total)
        if ("UTANG".equalsIgnoreCase(request.getPaymentMethod()) ||
                "CREDIT".equalsIgnoreCase(request.getPaymentMethod())) {
            transaction.setAmount(BigDecimal.ZERO);
        } else {
            transaction.setAmount(request.getAmount());
        }

        transaction.setPaymentMethod(request.getPaymentMethod());

        if (request.getTransactionDate() != null) {
            transaction.setTransactionDate(request.getTransactionDate());
        }

        // Set customer if provided (for UTANG transactions)
        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Customer", "customerId", request.getCustomerId()));
            transaction.setCustomer(customer);
        }

        // Set order if provided
        if (request.getOrderId() != null) {
            Order order = orderRepository.findById(request.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", request.getOrderId()));
            transaction.setOrder(order);
        }

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToResponse(savedTransaction);
    }

    // Get all transactions (ordered by date descending)
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAllByOrderByTransactionDateDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get transaction by ID
    public TransactionResponse getTransactionById(Integer transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "transactionId", transactionId));
        return mapToResponse(transaction);
    }

    // Search transactions by customer name
    public List<TransactionResponse> searchByCustomerName(String keyword) {
        return transactionRepository.searchByCustomerName(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Filter by date range
    public List<TransactionResponse> getByDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        return transactionRepository.findByDateRange(start, end)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Filter by payment method
    public List<TransactionResponse> getByPaymentMethod(String paymentMethod) {
        return transactionRepository.findByPaymentMethodIgnoreCaseOrderByTransactionDateDesc(paymentMethod)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Filter by customer ID
    public List<TransactionResponse> getByCustomerId(Integer customerId) {
        return transactionRepository.findByCustomer_CustomerIdOrderByTransactionDateDesc(customerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Filter by order ID
    public List<TransactionResponse> getByOrderId(Integer orderId) {
        return transactionRepository.findByOrder_OrderIdOrderByTransactionDateDesc(orderId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get today's transactions
    public List<TransactionResponse> getTodayTransactions() {
        return transactionRepository.findTodayTransactions()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get all payment methods
    public List<String> getPaymentMethods() {
        return transactionRepository.findDistinctPaymentMethods();
    }

    // Get transaction summary
    public Map<String, Object> getTransactionSummary() {
        List<Transaction> allTransactions = transactionRepository.findAll();
        List<Transaction> todayTransactions = transactionRepository.findTodayTransactions();

        // Calculate Total Sales (everything except PAYMENT type which is debt
        // collection)
        BigDecimal totalRevenue = allTransactions.stream()
                .filter(t -> !"PAYMENT".equalsIgnoreCase(t.getPaymentMethod()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate Total Collections (PAYMENT type)
        BigDecimal totalPayments = allTransactions.stream()
                .filter(t -> "PAYMENT".equalsIgnoreCase(t.getPaymentMethod()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal todaySales = todayTransactions.stream()
                .filter(t -> !"PAYMENT".equalsIgnoreCase(t.getPaymentMethod()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate average transaction
        long transactionCount = allTransactions.stream()
                .filter(t -> !"PAYMENT".equalsIgnoreCase(t.getPaymentMethod()))
                .count();
        BigDecimal averageTransaction = transactionCount > 0
                ? totalRevenue.divide(BigDecimal.valueOf(transactionCount), 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalTransactions", allTransactions.size());
        summary.put("totalRevenue", totalRevenue); // Frontend expects "totalRevenue"
        summary.put("todaySales", todaySales); // Frontend expects "todaySales"
        summary.put("averageTransaction", averageTransaction); // Frontend expects "averageTransaction"
        summary.put("totalPayments", totalPayments);
        summary.put("todayTransactions", todayTransactions.size());
        summary.put("paymentMethods", transactionRepository.findDistinctPaymentMethods());

        return summary;
    }

    // Helper method to map entity to response
    private TransactionResponse mapToResponse(Transaction transaction) {
        Order order = transaction.getOrder();
        BigDecimal totalAmount = order != null ? order.getTotalAmount() : BigDecimal.ZERO;
        Integer itemCount = order != null && order.getOrderItems() != null ? order.getOrderItems().size() : 0;

        // Calculate Amount Paid
        BigDecimal amountPaid = transaction.getAmount();
        // If it's a debt record (Utang/Credit) linked to an order, calculate how much
        // has been paid
        if (order != null && ("UTANG".equalsIgnoreCase(transaction.getPaymentMethod()) ||
                "CREDIT".equalsIgnoreCase(transaction.getPaymentMethod()))) {
            BigDecimal paid = transactionRepository.sumAmountByOrderAndPaymentMethods(
                    order.getOrderId(), List.of("PAYMENT"));
            amountPaid = paid != null ? paid : BigDecimal.ZERO;
        }

        List<com.kaabuydev.kaabuy.DTO.Transaction.TransactionItemResponse> items = null;
        if (order != null && order.getOrderItems() != null) {
            items = order.getOrderItems().stream()
                    .map(item -> new com.kaabuydev.kaabuy.DTO.Transaction.TransactionItemResponse(
                            item.getProduct().getProductName(),
                            item.getQuantity(),
                            item.getUnitPrice(),
                            item.getSubtotal()))
                    .collect(Collectors.toList());
        }

        return new TransactionResponse(
                transaction.getTransactionId(),
                transaction.getTransactionDate(),
                transaction.getAmount(),
                amountPaid, // Pass the calculated amount paid
                totalAmount,
                itemCount,
                transaction.getPaymentMethod(),
                order != null ? order.getOrderId() : null,
                transaction.getCustomer() != null ? transaction.getCustomer().getCustomerId() : null,
                transaction.getCustomer() != null ? transaction.getCustomer().getCustomerName() : null,
                items);
    }
}
