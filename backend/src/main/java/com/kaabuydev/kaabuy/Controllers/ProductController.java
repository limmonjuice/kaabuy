package com.kaabuydev.kaabuy.Controllers;

import com.kaabuydev.kaabuy.DTO.Product.ProductRequest;
import com.kaabuydev.kaabuy.DTO.Product.ProductResponse;
import com.kaabuydev.kaabuy.Exceptions.ResourceNotFoundException;
import com.kaabuydev.kaabuy.Services.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyAuthority('ROLE_owner', 'ROLE_staff')")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Create a new product
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_owner')")
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductRequest request) {
        try {
            ProductResponse response = productService.createProduct(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all products
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // Get product by ID
    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductById(@PathVariable Integer productId) {
        try {
            ProductResponse response = productService.getProductById(productId);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Update product
    @PutMapping("/{productId}")
    @PreAuthorize("hasAuthority('ROLE_owner')")
    public ResponseEntity<?> updateProduct(@PathVariable Integer productId,
            @Valid @RequestBody ProductRequest request) {
        try {
            ProductResponse response = productService.updateProduct(productId, request);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Delete product
    @DeleteMapping("/{productId}")
    @PreAuthorize("hasAuthority('ROLE_owner')")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer productId) {
        try {
            productService.deleteProduct(productId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Product deleted successfully");
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Update stock quantity
    @PatchMapping("/{productId}/stock")
    @PreAuthorize("hasAuthority('ROLE_owner')")
    public ResponseEntity<?> updateStock(@PathVariable Integer productId,
            @RequestParam Integer quantity) {
        try {
            ProductResponse response = productService.updateStock(productId, quantity);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Adjust stock (add or subtract)
    @PatchMapping("/{productId}/stock/adjust")
    @PreAuthorize("hasAuthority('ROLE_owner')")
    public ResponseEntity<?> adjustStock(@PathVariable Integer productId,
            @RequestParam Integer adjustment) {
        try {
            ProductResponse response = productService.adjustStock(productId, adjustment);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Update reorder level
    @PatchMapping("/{productId}/reorder-level")
    @PreAuthorize("hasAuthority('ROLE_owner')")
    public ResponseEntity<?> updateReorderLevel(@PathVariable Integer productId,
            @RequestParam Integer reorderLevel) {
        try {
            ProductResponse response = productService.updateReorderLevel(productId, reorderLevel);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Search products
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(@RequestParam String keyword) {
        List<ProductResponse> products = productService.searchProducts(keyword);
        return ResponseEntity.ok(products);
    }

    // Filter by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable String category) {
        List<ProductResponse> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    // Get products by stock status
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getProductsByStockStatus(@PathVariable String status) {
        try {
            List<ProductResponse> products = productService.getProductsByStockStatus(status);
            return ResponseEntity.ok(products);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get all categories
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = productService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // Get low stock products
    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductResponse>> getLowStockProducts() {
        List<ProductResponse> products = productService.getLowStockProducts();
        return ResponseEntity.ok(products);
    }

    // Get out of stock products
    @GetMapping("/out-of-stock")
    public ResponseEntity<List<ProductResponse>> getOutOfStockProducts() {
        List<ProductResponse> products = productService.getOutOfStockProducts();
        return ResponseEntity.ok(products);
    }

    // Get stock summary
    @GetMapping("/stock-summary")
    public ResponseEntity<Map<String, Object>> getStockSummary() {
        Map<String, Object> summary = productService.getStockSummary();
        return ResponseEntity.ok(summary);
    }

    // Helper method to build error response
    private ResponseEntity<Map<String, String>> buildErrorResponse(String message, HttpStatus status) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.status(status).body(error);
    }
}
