package com.kaabuydev.kaabuy.Services;

import com.kaabuydev.kaabuy.DTO.Customer.CustomerRequest;
import com.kaabuydev.kaabuy.DTO.Customer.CustomerResponse;
import com.kaabuydev.kaabuy.Exceptions.ResourceNotFoundException;
import com.kaabuydev.kaabuy.Models.Customer;
import com.kaabuydev.kaabuy.Models.Transaction;
import com.kaabuydev.kaabuy.Repositories.CustomerRepository;
import com.kaabuydev.kaabuy.Repositories.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;
    private final com.kaabuydev.kaabuy.Repositories.OrderRepository orderRepository;

    public CustomerService(CustomerRepository customerRepository,
            TransactionRepository transactionRepository,
            com.kaabuydev.kaabuy.Repositories.OrderRepository orderRepository) {
        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
        this.orderRepository = orderRepository;
    }

    // Create a new customer (only when they have utang)
    public CustomerResponse createCustomer(CustomerRequest request) {
        Customer customer = new Customer();
        mapRequestToCustomer(request, customer);

        Customer savedCustomer = customerRepository.save(customer);
        return mapToResponse(savedCustomer);
    }

    // Get all active customers sorted by newest first
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findByIsDeletedFalse()
                .stream()
                .sorted((c1, c2) -> c2.getCustomerId().compareTo(c1.getCustomerId())) // Sort by ID desc
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get customer by ID
    public CustomerResponse getCustomerById(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "customerId", customerId));
        return mapToResponse(customer);
    }

    // Update customer
    public CustomerResponse updateCustomer(Integer customerId, CustomerRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "customerId", customerId));

        mapRequestToCustomer(request, customer);

        Customer updatedCustomer = customerRepository.save(customer);
        return mapToResponse(updatedCustomer);
    }

    // Soft delete customer (only if no outstanding credit)
    public void deleteCustomer(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "customerId", customerId));

        // Check if customer has outstanding credit
        BigDecimal utang = calculateTotalUtang(customer);
        if (utang.compareTo(BigDecimal.ZERO) > 0) {
            throw new RuntimeException("Cannot delete customer with outstanding credit balance of ₱" + utang);
        }

        customer.setIsDeleted(true);
        customerRepository.save(customer);
    }

    // Search active customers by name
    public List<CustomerResponse> searchByName(String keyword) {
        return customerRepository.findByCustomerNameContainingIgnoreCaseAndIsDeletedFalse(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get customers with utang (credit)
    public List<CustomerResponse> getCustomersWithUtang() {
        return customerRepository.findCustomersWithUtang()
                .stream()
                .map(this::mapToResponse)
                .filter(c -> c.getTotalUtang().compareTo(BigDecimal.ZERO) > 0)
                .collect(Collectors.toList());
    }

    // Get total utang for a specific customer
    public BigDecimal getCustomerTotalUtang(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "customerId", customerId));
        return calculateTotalUtang(customer);
    }

    // Record a payment (bayad) for a customer's utang
    public Map<String, Object> recordPayment(Integer customerId, BigDecimal paymentAmount, Integer orderId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "customerId", customerId));

        // Get balance BEFORE this payment
        BigDecimal balanceBeforePayment = calculateTotalUtang(customer);

        if (paymentAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Payment amount must be greater than zero");
        }

        // Create a PAYMENT transaction (this will reduce the utang)
        Transaction paymentTransaction = new Transaction();
        paymentTransaction.setCustomer(customer);
        paymentTransaction.setAmount(paymentAmount);
        paymentTransaction.setPaymentMethod("PAYMENT");

        // Link to order if provided
        if (orderId != null) {
            com.kaabuydev.kaabuy.Models.Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));
            paymentTransaction.setOrder(order);
        }

        transactionRepository.save(paymentTransaction);

        // Calculate remaining balance AFTER this payment
        BigDecimal remainingBalance = balanceBeforePayment.subtract(paymentAmount);

        Map<String, Object> result = new HashMap<>();
        result.put("customerId", customerId);
        result.put("customerName", customer.getCustomerName());
        result.put("paymentAmount", paymentAmount);
        result.put("utangBeforePayment", balanceBeforePayment);
        result.put("remainingUtang", remainingBalance);
        result.put("message", remainingBalance.compareTo(BigDecimal.ZERO) <= 0 ? "Utang fully paid!"
                : "Payment recorded successfully");

        return result;
    }

    // Get customer summary
    public Map<String, Object> getCustomerSummary() {
        List<Customer> allCustomers = customerRepository.findAll();

        // Calculate utang for each customer and filter those with balance > 0
        int customersWithUtangCount = 0;
        BigDecimal totalUtang = BigDecimal.ZERO;
        long totalTransactions = 0;

        for (Customer customer : allCustomers) {
            BigDecimal customerUtang = calculateTotalUtang(customer);
            long txCount = transactionRepository.countByCustomer_CustomerId(customer.getCustomerId());

            totalTransactions += txCount;

            if (customerUtang.compareTo(BigDecimal.ZERO) > 0) {
                customersWithUtangCount++;
                totalUtang = totalUtang.add(customerUtang);
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalCustomers", allCustomers.size());
        summary.put("customersWithUtang", customersWithUtangCount);
        summary.put("totalUtang", totalUtang.doubleValue());
        summary.put("totalTransactions", totalTransactions);

        return summary;
    }

    // Helper method to calculate total utang for a customer
    // UTANG/CREDIT adds to balance (use Order Total), PAYMENT subtracts from
    // balance (use Amount Paid)
    private BigDecimal calculateTotalUtang(Customer customer) {
        BigDecimal totalUtang = transactionRepository.sumOrderTotalByCustomerAndPaymentMethods(
                customer.getCustomerId(), List.of("UTANG", "CREDIT"));

        BigDecimal totalPayments = transactionRepository.sumAmountByCustomerAndPaymentMethods(
                customer.getCustomerId(), List.of("PAYMENT"));

        // Ensure non-null values
        totalUtang = totalUtang != null ? totalUtang : BigDecimal.ZERO;
        totalPayments = totalPayments != null ? totalPayments : BigDecimal.ZERO;

        return totalUtang.subtract(totalPayments);
    }

    // Helper method to map request to customer entity
    private void mapRequestToCustomer(CustomerRequest request, Customer customer) {
        customer.setCustomerName(request.getCustomerName());
        customer.setContactNumber(request.getContactNumber());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());
    }

    // Helper method to map customer entity to response
    private CustomerResponse mapToResponse(Customer customer) {
        BigDecimal totalUtang = calculateTotalUtang(customer);
        long transactionCount = transactionRepository.countByCustomer_CustomerId(customer.getCustomerId());

        return new CustomerResponse(
                customer.getCustomerId(),
                customer.getCustomerName(),
                customer.getContactNumber(),
                customer.getEmail(),
                customer.getAddress(),
                customer.getCreatedAt(),
                totalUtang,
                (int) transactionCount);
    }
}
