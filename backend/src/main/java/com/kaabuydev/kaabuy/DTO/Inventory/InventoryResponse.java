package com.kaabuydev.kaabuy.DTO.Inventory;

public class InventoryResponse {

    private Integer productId;
    private String productName;
    private Integer currentStock;
    private Integer reorderLevel;
    private String stockStatus;

    public InventoryResponse() {}

    public InventoryResponse(Integer productId, String productName, Integer currentStock,
                            Integer reorderLevel, String stockStatus) {
        this.productId = productId;
        this.productName = productName;
        this.currentStock = currentStock;
        this.reorderLevel = reorderLevel;
        this.stockStatus = stockStatus;
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

    public String getStockStatus() {
        return stockStatus;
    }

    public void setStockStatus(String stockStatus) {
        this.stockStatus = stockStatus;
    }
}
