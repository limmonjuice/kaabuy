package com.kaabuydev.kaabuy.DTO.StockRecord;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class StockRecordRequest {

    private Integer stockQuantity;
    private String recordType;
    private LocalDateTime deliveryDate;
    private BigDecimal priceSupplier;
    private Integer supplierId;
    private Integer productId;

    public StockRecordRequest() {}

    public StockRecordRequest(Integer stockQuantity, String recordType, LocalDateTime deliveryDate,
                              BigDecimal priceSupplier, Integer supplierId, Integer productId) {
        this.stockQuantity = stockQuantity;
        this.recordType = recordType;
        this.deliveryDate = deliveryDate;
        this.priceSupplier = priceSupplier;
        this.supplierId = supplierId;
        this.productId = productId;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getRecordType() {
        return recordType;
    }

    public void setRecordType(String recordType) {
        this.recordType = recordType;
    }

    public LocalDateTime getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(LocalDateTime deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public BigDecimal getPriceSupplier() {
        return priceSupplier;
    }

    public void setPriceSupplier(BigDecimal priceSupplier) {
        this.priceSupplier = priceSupplier;
    }

    public Integer getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Integer supplierId) {
        this.supplierId = supplierId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }
}
