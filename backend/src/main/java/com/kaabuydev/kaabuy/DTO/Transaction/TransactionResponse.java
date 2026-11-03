package com.kaabuydev.kaabuy.DTO.Transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {

    private Integer transactionId;
    private LocalDateTime transactionDate;
    private BigDecimal amount;
    private BigDecimal amountPaid;
    private BigDecimal totalAmount;
    private Integer itemCount;
    private String paymentMethod;
    private Integer orderId;
    private Integer customerId;
    private String customerName;
    private java.util.List<TransactionItemResponse> items;

    public TransactionResponse() {
    }

    public TransactionResponse(Integer transactionId, LocalDateTime transactionDate,
            BigDecimal amount, BigDecimal amountPaid, BigDecimal totalAmount, Integer itemCount,
            String paymentMethod, Integer orderId, Integer customerId,
            String customerName, java.util.List<TransactionItemResponse> items) {
        this.transactionId = transactionId;
        this.transactionDate = transactionDate;
        this.amount = amount;
        this.amountPaid = amountPaid;
        this.totalAmount = totalAmount;
        this.itemCount = itemCount;
        this.paymentMethod = paymentMethod;
        this.orderId = orderId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.items = items;
    }

    public Integer getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Integer transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
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

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(BigDecimal amountPaid) {
        this.amountPaid = amountPaid;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getItemCount() {
        return itemCount;
    }

    public void setItemCount(Integer itemCount) {
        this.itemCount = itemCount;
    }

    public java.util.List<TransactionItemResponse> getItems() {
        return items;
    }

    public void setItems(java.util.List<TransactionItemResponse> items) {
        this.items = items;
    }
}
