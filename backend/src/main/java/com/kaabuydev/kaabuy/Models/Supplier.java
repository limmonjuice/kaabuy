package com.kaabuydev.kaabuy.Models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer supplierId;

    @Column(nullable = false, length = 150)
    private String supplierName;

    @Column(length = 150)
    private String contactPerson;

    @Column(length = 50)
    private String contactNumber;

    @Column(columnDefinition = "TEXT")
    private String address;

    private LocalDateTime lastOrderDate;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer totalOrders = 0;

    @Column(columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isPreferred = false;

    // Supplier (1) - restocks - StockRecord (many)
    @OneToMany(mappedBy = "supplier", fetch = FetchType.LAZY)
    private List<StockRecord> stockRecords;

    public Supplier() {}

    public Supplier(Integer supplierId, String supplierName, String contactPerson,
                    String contactNumber, String address, LocalDateTime lastOrderDate,
                    Integer totalOrders, Boolean isPreferred) {
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.contactPerson = contactPerson;
        this.contactNumber = contactNumber;
        this.address = address;
        this.lastOrderDate = lastOrderDate;
        this.totalOrders = totalOrders;
        this.isPreferred = isPreferred;
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

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDateTime getLastOrderDate() {
        return lastOrderDate;
    }

    public void setLastOrderDate(LocalDateTime lastOrderDate) {
        this.lastOrderDate = lastOrderDate;
    }

    public Integer getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Integer totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Boolean getIsPreferred() {
        return isPreferred;
    }

    public void setIsPreferred(Boolean isPreferred) {
        this.isPreferred = isPreferred;
    }

    public List<StockRecord> getStockRecords() {
        return stockRecords;
    }

    public void setStockRecords(List<StockRecord> stockRecords) {
        this.stockRecords = stockRecords;
    }
}
