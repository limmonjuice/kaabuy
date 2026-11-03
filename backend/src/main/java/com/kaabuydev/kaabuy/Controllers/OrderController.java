package com.kaabuydev.kaabuy.Controllers;

import com.kaabuydev.kaabuy.DTO.Order.OrderRequest;
import com.kaabuydev.kaabuy.DTO.Order.OrderResponse;
import com.kaabuydev.kaabuy.Exceptions.ResourceNotFoundException;
import com.kaabuydev.kaabuy.Services.OrderService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyAuthority('ROLE_owner', 'ROLE_staff')")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ==================== POS CHECKOUT ====================

    // Main POS checkout endpoint
    // Main POS checkout endpoint
    @PostMapping("/checkout")
    @PreAuthorize("hasAnyAuthority('ROLE_owner', 'ROLE_staff')")
    public ResponseEntity<?> checkout(@Valid @RequestBody OrderRequest request) {
        try {
            OrderResponse response = orderService.checkout(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // ==================== ORDER RETRIEVAL ====================

    // Get all orders
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_owner')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // Get order by ID
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer orderId) {
        try {
            OrderResponse response = orderService.getOrderById(orderId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Get today's orders
    @GetMapping("/today")
    public ResponseEntity<List<OrderResponse>> getTodayOrders() {
        List<OrderResponse> orders = orderService.getTodayOrders();
        return ResponseEntity.ok(orders);
    }

    // Get orders by customer
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByCustomer(@PathVariable Integer customerId) {
        List<OrderResponse> orders = orderService.getOrdersByCustomer(customerId);
        return ResponseEntity.ok(orders);
    }

    // Get orders by staff
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByStaff(@PathVariable Integer staffId) {
        List<OrderResponse> orders = orderService.getOrdersByStaff(staffId);
        return ResponseEntity.ok(orders);
    }

    // Get orders by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(@PathVariable String status) {
        List<OrderResponse> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    // Get orders by date range
    @GetMapping("/filter/date")
    public ResponseEntity<List<OrderResponse>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<OrderResponse> orders = orderService.getOrdersByDateRange(startDate, endDate);
        return ResponseEntity.ok(orders);
    }

    // ==================== ORDER MANAGEMENT ====================

    // Cancel order
    @PostMapping("/{orderId}/cancel")
    @PreAuthorize("hasAuthority('ROLE_owner')")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer orderId) {
        try {
            OrderResponse response = orderService.cancelOrder(orderId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // ==================== ORDER SUMMARY ====================

    // Get order summary/statistics
    @GetMapping("/summary")
    @PreAuthorize("hasAuthority('ROLE_owner')")
    public ResponseEntity<Map<String, Object>> getOrderSummary() {
        Map<String, Object> summary = orderService.getOrderSummary();
        return ResponseEntity.ok(summary);
    }

    // ==================== HELPER ====================

    private ResponseEntity<Map<String, String>> buildErrorResponse(String message, HttpStatus status) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.status(status).body(error);
    }
}
