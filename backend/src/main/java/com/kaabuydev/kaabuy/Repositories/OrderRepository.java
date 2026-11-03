package com.kaabuydev.kaabuy.Repositories;

import com.kaabuydev.kaabuy.Models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    // Find by customer
    List<Order> findByCustomerCustomerId(Integer customerId);

    // Find by status
    List<Order> findByStatus(String status);

    // Find by date range
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate ORDER BY o.orderDate DESC")
    List<Order> findByDateRange(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Get all orders ordered by date descending
    List<Order> findAllByOrderByOrderDateDesc();

    // Find by staff ID
    List<Order> findByStaff_StaffIdOrderByOrderDateDesc(Integer staffId);

    // Find today's orders
    @Query("SELECT o FROM Order o WHERE DATE(o.orderDate) = CURRENT_DATE ORDER BY o.orderDate DESC")
    List<Order> findTodayOrders();

    // Count today's orders
    @Query("SELECT COUNT(o) FROM Order o WHERE DATE(o.orderDate) = CURRENT_DATE")
    Long countTodayOrders();

    // Count orders by status
    Long countByStatus(String status);

    // Find orders within date range for sales calculation
    @Query("SELECT o FROM Order o WHERE o.orderDate >= :startDate AND o.status = 'COMPLETED'")
    List<Order> findCompletedOrdersSince(@Param("startDate") LocalDateTime startDate);

    // Count walk-in orders (no customer linked)
    Long countByCustomerIsNull();
}
