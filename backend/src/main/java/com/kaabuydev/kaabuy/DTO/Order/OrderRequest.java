package com.kaabuydev.kaabuy.DTO.Order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public class OrderRequest {

    @NotNull(message = "Staff ID is required")
    private Integer staffId;

    // Customer ID is optional - only required for UTANG
    private Integer customerId;

    @NotNull(message = "Payment method is required")
    @Size(max = 50, message = "Payment method must not exceed 50 characters")
    private String paymentMethod;

    // Amount paid by customer (for calculating change)
    private BigDecimal amountPaid;

    @NotEmpty(message = "Order must have at least one item")
    @Valid
    private List<OrderItemRequest> items;

    public OrderRequest() {}

    public OrderRequest(Integer staffId, Integer customerId, String paymentMethod,
                       BigDecimal amountPaid, List<OrderItemRequest> items) {
        this.staffId = staffId;
        this.customerId = customerId;
        this.paymentMethod = paymentMethod;
        this.amountPaid = amountPaid;
        this.items = items;
    }

    public Integer getStaffId() {
        return staffId;
    }

    public void setStaffId(Integer staffId) {
        this.staffId = staffId;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
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

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
}
