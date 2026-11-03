package com.kaabuydev.kaabuy.DTO.Supplier;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SupplierRequest {

    @NotBlank(message = "Supplier name is required")
    @Size(max = 150, message = "Supplier name must not exceed 150 characters")
    private String supplierName;

    @Size(max = 150, message = "Contact person must not exceed 150 characters")
    private String contactPerson;

    @Size(max = 50, message = "Contact number must not exceed 50 characters")
    private String contactNumber;

    private String address;

    private Boolean isPreferred = false;

    public SupplierRequest() {}

    public SupplierRequest(String supplierName, String contactPerson, String contactNumber,
                           String address, Boolean isPreferred) {
        this.supplierName = supplierName;
        this.contactPerson = contactPerson;
        this.contactNumber = contactNumber;
        this.address = address;
        this.isPreferred = isPreferred;
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

    public Boolean getIsPreferred() {
        return isPreferred;
    }

    public void setIsPreferred(Boolean isPreferred) {
        this.isPreferred = isPreferred;
    }
}
