package com.kaabuydev.kaabuy.Repositories;

import com.kaabuydev.kaabuy.Models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

        // Get all transactions ordered by date descending
        List<Transaction> findAllByOrderByTransactionDateDesc();

        // Search transactions by customer name
        @Query("SELECT t FROM Transaction t WHERE LOWER(t.customer.customerName) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY t.transactionDate DESC")
        List<Transaction> searchByCustomerName(@Param("keyword") String keyword);

        // Filter by date range
        @Query("SELECT t FROM Transaction t WHERE t.transactionDate BETWEEN :startDate AND :endDate ORDER BY t.transactionDate DESC")
        List<Transaction> findByDateRange(@Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        // Filter by payment method
        List<Transaction> findByPaymentMethodIgnoreCaseOrderByTransactionDateDesc(String paymentMethod);

        // Filter by customer ID
        List<Transaction> findByCustomer_CustomerIdOrderByTransactionDateDesc(Integer customerId);

        // Filter by order ID
        List<Transaction> findByOrder_OrderIdOrderByTransactionDateDesc(Integer orderId);

        // Get today's transactions
        @Query("SELECT t FROM Transaction t WHERE DATE(t.transactionDate) = CURRENT_DATE ORDER BY t.transactionDate DESC")
        List<Transaction> findTodayTransactions();

        // Get distinct payment methods
        @Query("SELECT DISTINCT t.paymentMethod FROM Transaction t")
        List<String> findDistinctPaymentMethods();

        // Count transactions by customer
        long countByCustomer_CustomerId(Integer customerId);

        // Sum amount by customer and payment method (FIXED - using UPPER instead of
        // LOWER)
        @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.customer.customerId = :customerId AND t.customer IS NOT NULL AND UPPER(t.paymentMethod) IN :paymentMethods")
        BigDecimal sumAmountByCustomerAndPaymentMethods(@Param("customerId") Integer customerId,
                        @Param("paymentMethods") List<String> paymentMethods);

        // Sum DEBT INCURRED by customer and payment method
        // Logic: If linked to Order, use Order Total. If not (legacy/manual), use
        // Transaction Amount.
        @Query("SELECT COALESCE(SUM(CASE WHEN t.order IS NOT NULL THEN t.order.totalAmount ELSE t.amount END), 0) FROM Transaction t WHERE t.customer.customerId = :customerId AND t.customer IS NOT NULL AND UPPER(t.paymentMethod) IN :paymentMethods")
        BigDecimal sumOrderTotalByCustomerAndPaymentMethods(@Param("customerId") Integer customerId,
                        @Param("paymentMethods") List<String> paymentMethods);

        // --- GLOBAL SUMS FOR DASHBOARD ---

        // Global Sum of Payments
        @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.customer IS NOT NULL AND UPPER(t.paymentMethod) IN :paymentMethods")
        BigDecimal sumGlobalAmountByPaymentMethods(@Param("paymentMethods") List<String> paymentMethods);

        // Global Sum of Debt Incurred
        @Query("SELECT COALESCE(SUM(CASE WHEN t.order IS NOT NULL THEN t.order.totalAmount ELSE t.amount END), 0) FROM Transaction t WHERE t.customer IS NOT NULL AND UPPER(t.paymentMethod) IN :paymentMethods")
        BigDecimal sumGlobalOrderTotalByPaymentMethods(@Param("paymentMethods") List<String> paymentMethods);

        // Sum amount by order ID and payment method (for calculating paid amount of
        // specific order)
        @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.order.orderId = :orderId AND UPPER(t.paymentMethod) IN :paymentMethods")
        BigDecimal sumAmountByOrderAndPaymentMethods(@Param("orderId") Integer orderId,
                        @Param("paymentMethods") List<String> paymentMethods);
}