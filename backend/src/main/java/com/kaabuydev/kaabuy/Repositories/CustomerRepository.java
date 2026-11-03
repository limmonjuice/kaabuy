package com.kaabuydev.kaabuy.Repositories;

import com.kaabuydev.kaabuy.Models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    // Search by customer name
    List<Customer> findByCustomerNameContainingIgnoreCase(String customerName);

    // Find active customers only
    List<Customer> findByIsDeletedFalse();

    // Search by name among active customers only
    List<Customer> findByCustomerNameContainingIgnoreCaseAndIsDeletedFalse(String customerName);

    // Find by email
    Customer findByEmail(String email);

    // Check if email exists
    Boolean existsByEmail(String email);

    // Find by contact number
    Customer findByContactNumber(String contactNumber);

    // Find customers with utang (those who have a positive balance) - only active
    // customers
    @Query("SELECT DISTINCT c FROM Customer c JOIN c.transactions t " +
            "WHERE UPPER(t.paymentMethod) IN ('UTANG', 'CREDIT') AND c.isDeleted = false")
    List<Customer> findCustomersWithUtang();
}