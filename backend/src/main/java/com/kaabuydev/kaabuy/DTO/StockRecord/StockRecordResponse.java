package com.kaabuydev.kaabuy.DTO.StockRecord;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class StockRecordResponse {

    private Integer recordId;
    private Integer stockQuantity;
    private String recordType;
    private LocalDateTime deliveryDate;
    private BigDecimal priceSupplier;
    private Integer supplierId;
    private String supplierName;
    private Integer productId;
    private String productName;

    public StockRecordResponse() {}

    public StockRecordResponse(Integer recordId, Integer stockQuantity, String recordType,
                               LocalDateTime deliveryDate, BigDecimal priceSupplier,
                               Integer supplierId, String supplierName,
                               Integer productId, String productName) {
        this.recordId = recordId;
        this.stockQuantity = stockQuantity;
        this.recordType = recordType;
        this.deliveryDate = deliveryDate;
        this.priceSupplier = priceSupplier;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.productId = productId;
        this.productName = productName;
    }

    public Integer getRecordId() {
        return recordId;
    }

    public void setRecordId(Integer recordId) {
        this.recordId = recordId;
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

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
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
}
