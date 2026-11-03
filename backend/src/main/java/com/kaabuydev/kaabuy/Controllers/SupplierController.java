package com.kaabuydev.kaabuy.Controllers;

import com.kaabuydev.kaabuy.DTO.Supplier.SupplierRequest;
import com.kaabuydev.kaabuy.DTO.Supplier.SupplierResponse;
import com.kaabuydev.kaabuy.Exceptions.ResourceNotFoundException;
import com.kaabuydev.kaabuy.Services.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAuthority('ROLE_owner')")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    // Create a new supplier
    @PostMapping
    public ResponseEntity<?> createSupplier(@Valid @RequestBody SupplierRequest request) {
        try {
            SupplierResponse response = supplierService.createSupplier(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all suppliers
    @GetMapping
    public ResponseEntity<List<SupplierResponse>> getAllSuppliers() {
        List<SupplierResponse> suppliers = supplierService.getAllSuppliers();
        return ResponseEntity.ok(suppliers);
    }

    // Get supplier by ID
    @GetMapping("/{supplierId}")
    public ResponseEntity<?> getSupplierById(@PathVariable Integer supplierId) {
        try {
            SupplierResponse response = supplierService.getSupplierById(supplierId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Update supplier
    @PutMapping("/{supplierId}")
    public ResponseEntity<?> updateSupplier(@PathVariable Integer supplierId,
                                            @Valid @RequestBody SupplierRequest request) {
        try {
            SupplierResponse response = supplierService.updateSupplier(supplierId, request);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete supplier
    @DeleteMapping("/{supplierId}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Integer supplierId) {
        try {
            supplierService.deleteSupplier(supplierId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Supplier deleted successfully");
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Search suppliers
    @GetMapping("/search")
    public ResponseEntity<List<SupplierResponse>> searchSuppliers(@RequestParam String keyword) {
        List<SupplierResponse> suppliers = supplierService.searchSuppliers(keyword);
        return ResponseEntity.ok(suppliers);
    }

    // Get preferred suppliers
    @GetMapping("/preferred")
    public ResponseEntity<List<SupplierResponse>> getPreferredSuppliers() {
        List<SupplierResponse> suppliers = supplierService.getPreferredSuppliers();
        return ResponseEntity.ok(suppliers);
    }

    // Toggle preferred status
    @PatchMapping("/{supplierId}/preferred")
    public ResponseEntity<?> togglePreferred(@PathVariable Integer supplierId) {
        try {
            SupplierResponse response = supplierService.togglePreferred(supplierId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Record an order from supplier (for restocking)
    @PostMapping("/{supplierId}/order")
    public ResponseEntity<?> recordOrder(@PathVariable Integer supplierId) {
        try {
            SupplierResponse response = supplierService.recordOrder(supplierId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Get supplier summary
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSupplierSummary() {
        Map<String, Object> summary = supplierService.getSupplierSummary();
        return ResponseEntity.ok(summary);
    }

    // Get suppliers ordered by total orders
    @GetMapping("/by-orders")
    public ResponseEntity<List<SupplierResponse>> getSuppliersByTotalOrders() {
        List<SupplierResponse> suppliers = supplierService.getSuppliersByTotalOrders();
        return ResponseEntity.ok(suppliers);
    }

    // Get suppliers ordered by recent orders
    @GetMapping("/recent")
    public ResponseEntity<List<SupplierResponse>> getSuppliersByRecentOrders() {
        List<SupplierResponse> suppliers = supplierService.getSuppliersByRecentOrders();
        return ResponseEntity.ok(suppliers);
    }

    // Helper method to build error response
    private ResponseEntity<Map<String, String>> buildErrorResponse(String message, HttpStatus status) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.status(status).body(error);
    }
}
