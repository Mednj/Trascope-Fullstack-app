package com.transcope.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pos_devices")
public class PosDevice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @NotBlank(message = "Device ID is required")
    @Size(max = 255, message = "Device ID must be less than 255 characters")
    @Column(name = "device_id", unique = true, nullable = false)
    private String deviceId;
    
    @NotBlank(message = "Model is required")
    @Size(max = 255, message = "Model must be less than 255 characters")
    @Column(nullable = false)
    private String model;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private MerchantSite site;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public PosDevice() {}
    
    public PosDevice(String deviceId, String model, MerchantSite site) {
        this.deviceId = deviceId;
        this.model = model;
        this.site = site;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getDeviceId() {
        return deviceId;
    }
    
    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }
    
    public String getModel() {
        return model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }
    
    public MerchantSite getSite() {
        return site;
    }
    
    public void setSite(MerchantSite site) {
        this.site = site;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
} 