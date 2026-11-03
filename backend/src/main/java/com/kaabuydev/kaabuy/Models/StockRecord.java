package com.kaabuydev.kaabuy.Models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_records")
public class StockRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer recordId;

    @Column(nullable = false)
    private Integer stockQuantity;

    @Column(nullable = false, length = 50)
    private String recordType;

    @Column(nullable = false)
    private LocalDateTime deliveryDate;

    @Column(precision = 12, scale = 2)
    private BigDecimal priceSupplier;

    // Supplier (1) - restocks - StockRecord (many)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = true)
    private Supplier supplier;

    // StockRecord (many) - has - Product (1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @PrePersist
    protected void onCreate() {
        if (deliveryDate == null) {
            deliveryDate = LocalDateTime.now();
        }
        if (recordType == null) {
            recordType = "RECEIVED";
        }
    }

    public StockRecord() {}

    public StockRecord(Integer recordId, Integer stockQuantity, String recordType,
                      LocalDateTime deliveryDate, BigDecimal priceSupplier,
                      Supplier supplier, Product product) {
        this.recordId = recordId;
        this.stockQuantity = stockQuantity;
        this.recordType = recordType;
        this.deliveryDate = deliveryDate;
        this.priceSupplier = priceSupplier;
        this.supplier = supplier;
        this.product = product;
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

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
