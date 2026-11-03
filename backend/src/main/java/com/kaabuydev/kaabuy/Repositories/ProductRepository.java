package com.kaabuydev.kaabuy.Repositories;

import com.kaabuydev.kaabuy.Models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // Search by product name (case-insensitive)
    List<Product> findByProductNameContainingIgnoreCase(String productName);

    // Filter by category
    List<Product> findByCategory(String category);

    // Filter by category (case-insensitive)
    List<Product> findByCategoryIgnoreCase(String category);

    // Find products with low stock
    List<Product> findByIsLowStockTrue();

    // Find products that are out of stock
    List<Product> findByCurrentStock(Integer currentStock);

    // Find out of stock products (currentStock = 0)
    @Query("SELECT p FROM Product p WHERE p.currentStock = 0")
    List<Product> findOutOfStockProducts();

    // Find products below reorder level
    @Query("SELECT p FROM Product p WHERE p.currentStock <= p.reorderLevel")
    List<Product> findProductsBelowReorderLevel();

    // Find products in stock (currentStock > reorderLevel)
    @Query("SELECT p FROM Product p WHERE p.currentStock > p.reorderLevel")
    List<Product> findInStockProducts();

    // Search products by name or category
    @Query("SELECT p FROM Product p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchProducts(@Param("keyword") String keyword);

    // Get all unique categories
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL ORDER BY p.category")
    List<String> findAllCategories();

    // Find by category and stock status
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.currentStock <= p.reorderLevel")
    List<Product> findLowStockByCategory(@Param("category") String category);

    // Check if product name exists (for duplicate validation)
    Boolean existsByProductNameIgnoreCase(String productName);

    // Check if product name exists excluding a specific product (for update validation)
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Product p " +
           "WHERE LOWER(p.productName) = LOWER(:productName) AND p.productId != :productId")
    Boolean existsByProductNameIgnoreCaseAndProductIdNot(@Param("productName") String productName,
                                                          @Param("productId") Integer productId);

    // Count products by stock status
    @Query("SELECT COUNT(p) FROM Product p WHERE p.currentStock = 0")
    Long countOutOfStock();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.currentStock > 0 AND p.currentStock <= p.reorderLevel")
    Long countLowStock();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.currentStock > p.reorderLevel")
    Long countInStock();
}
