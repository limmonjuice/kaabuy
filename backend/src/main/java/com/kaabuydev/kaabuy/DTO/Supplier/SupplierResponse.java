package com.kaabuydev.kaabuy.DTO.Supplier;

import java.time.LocalDateTime;

public class SupplierResponse {

    private Integer supplierId;
    private String supplierName;
    private String contactPerson;
    private String contactNumber;
    private String address;
    private LocalDateTime lastOrderDate;
    private Integer totalOrders;
    private Boolean isPreferred;

    public SupplierResponse() {}

    public SupplierResponse(Integer supplierId, String supplierName, String contactPerson,
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
}
