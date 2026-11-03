package com.kaabuydev.kaabuy.DTO.Customer;

public class CustomerRequest {

    private String customerName;
    private String contactNumber;
    private String email;
    private String address;

    public CustomerRequest() {}

    public CustomerRequest(String customerName, String contactNumber, String email, String address) {
        this.customerName = customerName;
        this.contactNumber = contactNumber;
        this.email = email;
        this.address = address;
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
}
