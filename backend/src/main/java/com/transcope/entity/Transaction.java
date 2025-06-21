package com.transcope.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;
    
    @NotBlank(message = "Currency is required")
    @Size(max = 3, message = "Currency must be 3 characters")
    @Column(nullable = false)
    private String currency = "USD";
    
    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status must be less than 50 characters")
    @Column(nullable = false)
    private String status;
    
    @NotBlank(message = "Type is required")
    @Size(max = 50, message = "Type must be less than 50 characters")
    @Column(nullable = false)
    private String type;
    
    @NotBlank(message = "Customer name is required")
    @Size(max = 255, message = "Customer name must be less than 255 characters")
    @Column(name = "customer_name", nullable = false)
    private String customerName;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pos_device_id", nullable = false)
    private PosDevice posDevice;
    
    // Constructors
    public Transaction() {}
    
    public Transaction(BigDecimal amount, String currency, String status, String type, 
                      String customerName, User user, PosDevice posDevice) {
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.type = type;
        this.customerName = customerName;
        this.user = user;
        this.posDevice = posDevice;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
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
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public PosDevice getPosDevice() {
        return posDevice;
    }
    
    public void setPosDevice(PosDevice posDevice) {
        this.posDevice = posDevice;
    }
} 