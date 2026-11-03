package com.kaabuydev.kaabuy.Models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    @Column(nullable = false, length = 200)
    private String productName;

    @Column(length = 100)
    private String category;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal basePrice;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal listPrice;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer currentStock = 0;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 10")
    private Integer reorderLevel = 10;

    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isLowStock = false;

    @Column(length = 50)
    private String unit;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    // Product (1) - has - StockRecord (many)
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<StockRecord> stockRecords;

    // Product (many) - contains - Order (many) through OrderItem
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;

    public Product() {
    }

    public Product(Integer productId, String productName, String category,
            BigDecimal basePrice, BigDecimal listPrice, Integer currentStock,
            Integer reorderLevel, Boolean isLowStock, String unit) {
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.basePrice = basePrice;
        this.listPrice = listPrice;
        this.currentStock = currentStock;
        this.reorderLevel = reorderLevel;
        this.isLowStock = isLowStock;
        this.unit = unit;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public BigDecimal getListPrice() {
        return listPrice;
    }

    public void setListPrice(BigDecimal listPrice) {
        this.listPrice = listPrice;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public Boolean getIsLowStock() {
        return isLowStock;
    }

    public void setIsLowStock(Boolean lowStock) {
        isLowStock = lowStock;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    // URL for the product image (Trigger Rebuild)
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<StockRecord> getStockRecords() {
        return stockRecords;
    }

    public void setStockRecords(List<StockRecord> stockRecords) {
        this.stockRecords = stockRecords;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
}
