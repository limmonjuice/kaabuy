package com.kaabuydev.kaabuy.DTO.Customer;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CustomerResponse {

    private Integer customerId;
    private String customerName;
    private String contactNumber;
    private String email;
    private String address;
    private LocalDateTime createdAt;
    private BigDecimal totalUtang;
    private Integer transactionCount;

    public CustomerResponse() {}

    public CustomerResponse(Integer customerId, String customerName, String contactNumber,
                           String email, String address, LocalDateTime createdAt,
                           BigDecimal totalUtang, Integer transactionCount) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.contactNumber = contactNumber;
        this.email = email;
        this.address = address;
        this.createdAt = createdAt;
        this.totalUtang = totalUtang;
        this.transactionCount = transactionCount;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public BigDecimal getTotalUtang() {
        return totalUtang;
    }

    public void setTotalUtang(BigDecimal totalUtang) {
        this.totalUtang = totalUtang;
    }

    public Integer getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(Integer transactionCount) {
        this.transactionCount = transactionCount;
    }
}
