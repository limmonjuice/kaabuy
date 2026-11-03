package com.kaabuydev.kaabuy.Services;

import com.kaabuydev.kaabuy.DTO.Product.ProductRequest;
import com.kaabuydev.kaabuy.DTO.Product.ProductResponse;
import com.kaabuydev.kaabuy.Exceptions.ResourceNotFoundException;
import com.kaabuydev.kaabuy.Models.Product;
import com.kaabuydev.kaabuy.Repositories.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Create a new product
    public ProductResponse createProduct(ProductRequest request) {
        // Check if product name already exists
        if (productRepository.existsByProductNameIgnoreCase(request.getProductName())) {
            throw new RuntimeException("Product with name '" + request.getProductName() + "' already exists");
        }

        Product product = new Product();
        mapRequestToProduct(request, product);

        // Set low stock flag based on current stock and reorder level
        updateLowStockFlag(product);

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    // Get all products
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get product by ID
    public ProductResponse getProductById(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        return mapToResponse(product);
    }

    // Update product
    public ProductResponse updateProduct(Integer productId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        // Check if product name already exists for another product
        if (productRepository.existsByProductNameIgnoreCaseAndProductIdNot(request.getProductName(), productId)) {
            throw new RuntimeException("Product with name '" + request.getProductName() + "' already exists");
        }

        mapRequestToProduct(request, product);
        updateLowStockFlag(product);

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    // Delete product
    public void deleteProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        productRepository.delete(product);
    }

    // Update stock for a product
    public ProductResponse updateStock(Integer productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        product.setCurrentStock(quantity);
        updateLowStockFlag(product);

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    // Adjust stock (add or subtract)
    public ProductResponse adjustStock(Integer productId, Integer adjustment) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        Integer newStock = product.getCurrentStock() + adjustment;
        if (newStock < 0) {
            throw new RuntimeException("Insufficient stock. Current stock: " + product.getCurrentStock() +
                    ", Requested adjustment: " + adjustment);
        }

        product.setCurrentStock(newStock);
        updateLowStockFlag(product);

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    // Update reorder level
    public ProductResponse updateReorderLevel(Integer productId, Integer reorderLevel) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        product.setReorderLevel(reorderLevel);
        updateLowStockFlag(product);

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    // Search products by keyword (name or category)
    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository.searchProducts(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Filter by category
    public List<ProductResponse> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get products by stock status
    public List<ProductResponse> getProductsByStockStatus(String status) {
        List<Product> products;

        switch (status.toUpperCase()) {
            case "IN_STOCK":
                products = productRepository.findInStockProducts();
                break;
            case "LOW_STOCK":
                products = productRepository.findProductsBelowReorderLevel();
                break;
            case "OUT_OF_STOCK":
                products = productRepository.findOutOfStockProducts();
                break;
            default:
                throw new RuntimeException("Invalid stock status: " + status +
                        ". Valid values are: IN_STOCK, LOW_STOCK, OUT_OF_STOCK");
        }

        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get all categories
    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }

    // Get low stock products
    public List<ProductResponse> getLowStockProducts() {
        return productRepository.findProductsBelowReorderLevel()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get out of stock products
    public List<ProductResponse> getOutOfStockProducts() {
        return productRepository.findOutOfStockProducts()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get product stock summary
    public Map<String, Object> getStockSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalProducts", productRepository.count());
        summary.put("inStock", productRepository.countInStock());
        summary.put("lowStock", productRepository.countLowStock());
        summary.put("outOfStock", productRepository.countOutOfStock());
        return summary;
    }

    // Helper method to map request to product entity
    private void mapRequestToProduct(ProductRequest request, Product product) {
        product.setProductName(request.getProductName());
        product.setCategory(request.getCategory());
        product.setBasePrice(request.getBasePrice());
        product.setListPrice(request.getListPrice());
        product.setImageUrl(request.getImageUrl());
        product.setUnit(request.getUnit());

        // Only update stock values if provided in request (preserves existing values
        // during updates)
        if (request.getCurrentStock() != null) {
            product.setCurrentStock(request.getCurrentStock());
        } else if (product.getProductId() == null) {
            // New product - set default
            product.setCurrentStock(0);
        }

        if (request.getReorderLevel() != null) {
            product.setReorderLevel(request.getReorderLevel());
        } else if (product.getProductId() == null) {
            // New product - set default
            product.setReorderLevel(10);
        }
    }

    // Helper method to update low stock flag
    private void updateLowStockFlag(Product product) {
        boolean isLowStock = product.getCurrentStock() <= product.getReorderLevel();
        product.setIsLowStock(isLowStock);
    }

    // Helper method to map product entity to response
    private ProductResponse mapToResponse(Product product) {
        return new ProductResponse(
                product.getProductId(),
                product.getProductName(),
                product.getCategory(),
                product.getBasePrice(),
                product.getListPrice(),
                product.getCurrentStock(),
                product.getReorderLevel(),
                product.getIsLowStock(),
                product.getUnit(),
                product.getImageUrl());
    }
}
