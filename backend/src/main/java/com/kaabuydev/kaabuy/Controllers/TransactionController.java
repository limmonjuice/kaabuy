package com.kaabuydev.kaabuy.Controllers;

import com.kaabuydev.kaabuy.DTO.Transaction.TransactionRequest;
import com.kaabuydev.kaabuy.DTO.Transaction.TransactionResponse;
import com.kaabuydev.kaabuy.Exceptions.ResourceNotFoundException;
import com.kaabuydev.kaabuy.Services.TransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Create a new transaction
    @PostMapping
    public ResponseEntity<?> createTransaction(@Valid @RequestBody TransactionRequest request) {
        try {
            TransactionResponse response = transactionService.createTransaction(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all transactions (sales records)
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        List<TransactionResponse> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    // Get transaction by ID
    @GetMapping("/{transactionId}")
    public ResponseEntity<?> getTransactionById(@PathVariable Integer transactionId) {
        try {
            TransactionResponse response = transactionService.getTransactionById(transactionId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Search transactions by customer name
    @GetMapping("/search")
    public ResponseEntity<List<TransactionResponse>> searchByCustomerName(@RequestParam String keyword) {
        List<TransactionResponse> transactions = transactionService.searchByCustomerName(keyword);
        return ResponseEntity.ok(transactions);
    }

    // Filter by date range
    @GetMapping("/filter/date")
    public ResponseEntity<List<TransactionResponse>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<TransactionResponse> transactions = transactionService.getByDateRange(startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

    // Filter by payment method
    @GetMapping("/filter/payment-method")
    public ResponseEntity<List<TransactionResponse>> getByPaymentMethod(@RequestParam String method) {
        List<TransactionResponse> transactions = transactionService.getByPaymentMethod(method);
        return ResponseEntity.ok(transactions);
    }

    // Get transactions by customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByCustomer(@PathVariable Integer customerId) {
        List<TransactionResponse> transactions = transactionService.getByCustomerId(customerId);
        return ResponseEntity.ok(transactions);
    }

    // Filter by customer ID
    @GetMapping("/filter/customer/{customerId}")
    public ResponseEntity<List<TransactionResponse>> getByCustomerId(@PathVariable Integer customerId) {
        List<TransactionResponse> transactions = transactionService.getByCustomerId(customerId);
        return ResponseEntity.ok(transactions);
    }

    // Filter by order ID
    @GetMapping("/filter/order/{orderId}")
    public ResponseEntity<List<TransactionResponse>> getByOrderId(@PathVariable Integer orderId) {
        List<TransactionResponse> transactions = transactionService.getByOrderId(orderId);
        return ResponseEntity.ok(transactions);
    }

    // Get today's transactions
    @GetMapping("/today")
    public ResponseEntity<List<TransactionResponse>> getTodayTransactions() {
        List<TransactionResponse> transactions = transactionService.getTodayTransactions();
        return ResponseEntity.ok(transactions);
    }

    // Get all payment methods
    @GetMapping("/payment-methods")
    public ResponseEntity<List<String>> getPaymentMethods() {
        List<String> methods = transactionService.getPaymentMethods();
        return ResponseEntity.ok(methods);
    }

    // Get transaction summary
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getTransactionSummary() {
        Map<String, Object> summary = transactionService.getTransactionSummary();
        return ResponseEntity.ok(summary);
    }

    // Helper method to build error response
    private ResponseEntity<Map<String, String>> buildErrorResponse(String message, HttpStatus status) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.status(status).body(error);
    }
}
