package com.kaabuydev.kaabuy.DTO.Product;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 200, message = "Product name must not exceed 200 characters")
    private String productName;

    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.00", message = "Base price must be zero or positive")
    @Digits(integer = 10, fraction = 2, message = "Base price must have at most 10 integer digits and 2 decimal places")
    private BigDecimal basePrice;

    @NotNull(message = "List price is required")
    @DecimalMin(value = "0.00", message = "List price must be zero or positive")
    @Digits(integer = 10, fraction = 2, message = "List price must have at most 10 integer digits and 2 decimal places")
    private BigDecimal listPrice;

    @Min(value = 0, message = "Current stock cannot be negative")
    private Integer currentStock;

    @Min(value = 0, message = "Reorder level cannot be negative")
    private Integer reorderLevel;

    @Size(max = 50, message = "Unit must not exceed 50 characters")
    private String unit;

    private String imageUrl;

    // No-args constructor
    public ProductRequest() {
    }

    // All-args constructor
    public ProductRequest(String productName, String category, BigDecimal basePrice,
            BigDecimal listPrice, Integer currentStock, Integer reorderLevel, String unit) {
        this.productName = productName;
        this.category = category;
        this.basePrice = basePrice;
        this.listPrice = listPrice;
        this.currentStock = currentStock;
        this.reorderLevel = reorderLevel;
        this.unit = unit;
    }

    // Getters and Setters
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
}
