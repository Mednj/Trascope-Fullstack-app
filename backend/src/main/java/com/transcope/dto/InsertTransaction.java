package com.transcope.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public class InsertTransaction {
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    @NotBlank(message = "Currency is required")
    @Size(max = 3, message = "Currency must be 3 characters")
    private String currency = "USD";
    
    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status must be less than 50 characters")
    private String status;
    
    @NotBlank(message = "Type is required")
    @Size(max = 50, message = "Type must be less than 50 characters")
    private String type;
    
    @NotBlank(message = "Customer name is required")
    @Size(max = 255, message = "Customer name must be less than 255 characters")
    private String customerName;
    
    @NotNull(message = "Device ID is required")
    private UUID deviceId;
    
    // Constructors
    public InsertTransaction() {}
    
    public InsertTransaction(BigDecimal amount, String currency, String status, String type, 
                           String customerName, UUID deviceId) {
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.type = type;
        this.customerName = customerName;
        this.deviceId = deviceId;
    }
    
    // Getters and Setters
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public UUID getDeviceId() {
        return deviceId;
    }
    
    public void setDeviceId(UUID deviceId) {
        this.deviceId = deviceId;
    }
} 