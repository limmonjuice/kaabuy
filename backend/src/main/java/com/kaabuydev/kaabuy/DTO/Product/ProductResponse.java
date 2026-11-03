package com.kaabuydev.kaabuy.DTO.Product;

import java.math.BigDecimal;

public class ProductResponse {

    private Integer productId;
    private String productName;
    private String category;
    private BigDecimal basePrice;
    private BigDecimal listPrice;
    private Integer currentStock;
    private Integer reorderLevel;
    private Boolean isLowStock;
    private String unit;
    private String imageUrl;
    private String stockStatus;

    // No-args constructor
    public ProductResponse() {
    }

    // All-args constructor
    public ProductResponse(Integer productId, String productName, String category,
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
        this.stockStatus = calculateStockStatus(currentStock, reorderLevel);
    }

    // Additional constructor with imageUrl if needed, or update existing.
    // Ideally we update the constructor used by Service.
    public ProductResponse(Integer productId, String productName, String category,
            BigDecimal basePrice, BigDecimal listPrice, Integer currentStock,
            Integer reorderLevel, Boolean isLowStock, String unit, String imageUrl) {
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.basePrice = basePrice;
        this.listPrice = listPrice;
        this.currentStock = currentStock;
        this.reorderLevel = reorderLevel;
        this.isLowStock = isLowStock;
        this.unit = unit;
        this.imageUrl = imageUrl;
        this.stockStatus = calculateStockStatus(currentStock, reorderLevel);
    }

    // Calculate stock status based on current stock and reorder level
    private String calculateStockStatus(Integer currentStock, Integer reorderLevel) {
        if (currentStock == null || currentStock == 0) {
            return "OUT_OF_STOCK";
        } else if (currentStock <= reorderLevel) {
            return "LOW_STOCK";
        } else {
            return "IN_STOCK";
        }
    }

    // Getters and Setters
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
        this.stockStatus = calculateStockStatus(currentStock, this.reorderLevel);
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
        this.stockStatus = calculateStockStatus(this.currentStock, reorderLevel);
    }

    public Boolean getIsLowStock() {
        return isLowStock;
    }

    public void setIsLowStock(Boolean isLowStock) {
        this.isLowStock = isLowStock;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getStockStatus() {
        return stockStatus;
    }

    public void setStockStatus(String stockStatus) {
        this.stockStatus = stockStatus;
    }
}
