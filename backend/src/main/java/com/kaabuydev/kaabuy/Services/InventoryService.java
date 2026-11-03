package com.kaabuydev.kaabuy.Services;

import com.kaabuydev.kaabuy.DTO.Inventory.InventoryResponse;
import com.kaabuydev.kaabuy.Models.Product;
import com.kaabuydev.kaabuy.Repositories.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class InventoryService {

    private final ProductRepository productRepository;

    public InventoryService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Get all products with stock info
    public List<InventoryResponse> getAllInventory() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get low-stock products
    public List<InventoryResponse> getLowStockProducts() {
        return productRepository.findProductsBelowReorderLevel()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get out-of-stock products
    public List<InventoryResponse> getOutOfStockProducts() {
        return productRepository.findOutOfStockProducts()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get stock summary counts
    public Map<String, Object> getStockSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalProducts", productRepository.count());
        summary.put("inStock", productRepository.countInStock());
        summary.put("lowStock", productRepository.countLowStock());
        summary.put("outOfStock", productRepository.countOutOfStock());
        return summary;
    }

    // Helper method to map entity to response
    private InventoryResponse mapToResponse(Product product) {
        String stockStatus;
        if (product.getCurrentStock() == 0) {
            stockStatus = "OUT_OF_STOCK";
        } else if (product.getCurrentStock() <= product.getReorderLevel()) {
            stockStatus = "LOW_STOCK";
        } else {
            stockStatus = "IN_STOCK";
        }

        return new InventoryResponse(
                product.getProductId(),
                product.getProductName(),
                product.getCurrentStock(),
                product.getReorderLevel(),
                stockStatus
        );
    }
}
