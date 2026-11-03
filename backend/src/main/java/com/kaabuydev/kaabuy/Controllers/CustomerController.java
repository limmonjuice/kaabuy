package com.kaabuydev.kaabuy.Controllers;

import com.kaabuydev.kaabuy.DTO.Customer.CustomerRequest;
import com.kaabuydev.kaabuy.DTO.Customer.CustomerResponse;
import com.kaabuydev.kaabuy.Exceptions.ResourceNotFoundException;
import com.kaabuydev.kaabuy.Services.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // Create a new customer (for utang purposes)
    @PostMapping
    public ResponseEntity<?> createCustomer(@Valid @RequestBody CustomerRequest request) {
        try {
            CustomerResponse response = customerService.createCustomer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all customers
    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        List<CustomerResponse> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    // Get customer by ID
    @GetMapping("/{customerId}")
    public ResponseEntity<?> getCustomerById(@PathVariable Integer customerId) {
        try {
            CustomerResponse response = customerService.getCustomerById(customerId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Update customer (owner only)
    @PutMapping("/{customerId}")
    @PreAuthorize("hasRole('owner')")
    public ResponseEntity<?> updateCustomer(@PathVariable Integer customerId,
            @Valid @RequestBody CustomerRequest request) {
        try {
            CustomerResponse response = customerService.updateCustomer(customerId, request);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete customer (owner only)
    @DeleteMapping("/{customerId}")
    @PreAuthorize("hasRole('owner')")
    public ResponseEntity<?> deleteCustomer(@PathVariable Integer customerId) {
        try {
            customerService.deleteCustomer(customerId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Customer deleted successfully");
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Search customers by name
    @GetMapping("/search")
    public ResponseEntity<List<CustomerResponse>> searchCustomers(@RequestParam String keyword) {
        List<CustomerResponse> customers = customerService.searchByName(keyword);
        return ResponseEntity.ok(customers);
    }

    // Get customers with utang (credit)
    @GetMapping("/with-utang")
    public ResponseEntity<List<CustomerResponse>> getCustomersWithUtang() {
        List<CustomerResponse> customers = customerService.getCustomersWithUtang();
        return ResponseEntity.ok(customers);
    }

    // Get total utang for a specific customer
    @GetMapping("/{customerId}/utang")
    public ResponseEntity<?> getCustomerUtang(@PathVariable Integer customerId) {
        try {
            BigDecimal totalUtang = customerService.getCustomerTotalUtang(customerId);
            Map<String, Object> response = new HashMap<>();
            response.put("customerId", customerId);
            response.put("totalUtang", totalUtang);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Record a payment (bayad) for customer's utang
    @PostMapping("/{customerId}/pay")
    public ResponseEntity<?> recordPayment(@PathVariable Integer customerId,
            @RequestBody Map<String, Object> request) {
        try {
            BigDecimal amount = null;
            if (request.get("amount") instanceof Double) {
                amount = BigDecimal.valueOf((Double) request.get("amount"));
            } else if (request.get("amount") instanceof Integer) {
                amount = BigDecimal.valueOf((Integer) request.get("amount"));
            } else if (request.get("amount") instanceof String) {
                amount = new BigDecimal((String) request.get("amount"));
            }

            Integer orderId = null;
            if (request.containsKey("orderId") && request.get("orderId") != null) {
                if (request.get("orderId") instanceof Integer) {
                    orderId = (Integer) request.get("orderId");
                } else if (request.get("orderId") instanceof String) {
                    orderId = Integer.parseInt((String) request.get("orderId"));
                }
            }

            if (amount == null) {
                // Fallback for direct BigDecimal if mapper handles it, though Map<String,
                // Object> usually gives Double/Integer
                // Let's try to be safe. If we assumed object, Jackson maps numbers to
                // Integer/Double.
                // If the user sends { "amount": 100 }, it's Integer. { "amount": 100.50 } is
                // Double.
                // Safest to convert string if possible or handle number types.
                return buildErrorResponse("Amount is required and must be a number", HttpStatus.BAD_REQUEST);
            }

            Map<String, Object> response = customerService.recordPayment(customerId, amount, orderId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get customer summary
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getCustomerSummary() {
        Map<String, Object> summary = customerService.getCustomerSummary();
        return ResponseEntity.ok(summary);
    }

    // Helper method to build error response
    private ResponseEntity<Map<String, String>> buildErrorResponse(String message, HttpStatus status) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.status(status).body(error);
    }
}
