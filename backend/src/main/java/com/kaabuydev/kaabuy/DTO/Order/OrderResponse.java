package com.kaabuydev.kaabuy.DTO.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private Integer orderId;
    private LocalDateTime orderDate;
    private String status;
    private BigDecimal totalAmount;
    private Integer staffId;
    private String staffName;
    private Integer customerId;
    private String customerName;
    private String paymentMethod;
    private BigDecimal amountPaid;
    private BigDecimal change;
    private List<OrderItemResponse> items;

    public OrderResponse() {}

    public OrderResponse(Integer orderId, LocalDateTime orderDate, String status,
                        BigDecimal totalAmount, Integer staffId, String staffName,
                        Integer customerId, String customerName, String paymentMethod,
                        BigDecimal amountPaid, BigDecimal change, List<OrderItemResponse> items) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.status = status;
        this.totalAmount = totalAmount;
        this.staffId = staffId;
        this.staffName = staffName;
        this.customerId = customerId;
        this.customerName = customerName;
        this.paymentMethod = paymentMethod;
        this.amountPaid = amountPaid;
        this.change = change;
        this.items = items;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getStaffId() {
        return staffId;
    }

    public void setStaffId(Integer staffId) {
        this.staffId = staffId;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
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

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(BigDecimal amountPaid) {
        this.amountPaid = amountPaid;
    }

    public BigDecimal getChange() {
        return change;
    }

    public void setChange(BigDecimal change) {
        this.change = change;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }
}
