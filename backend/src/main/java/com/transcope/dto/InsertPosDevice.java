package com.transcope.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class InsertPosDevice {
    
    @NotBlank(message = "Device ID is required")
    @Size(max = 255, message = "Device ID must be less than 255 characters")
    private String deviceId;
    
    @NotBlank(message = "Model is required")
    @Size(max = 255, message = "Model must be less than 255 characters")
    private String model;
    
    @NotNull(message = "Site ID is required")
    private UUID siteId;
    
    // Constructors
    public InsertPosDevice() {}
    
    public InsertPosDevice(String deviceId, String model, UUID siteId) {
        this.deviceId = deviceId;
        this.model = model;
        this.siteId = siteId;
    }
    
    // Getters and Setters
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
    
    public UUID getSiteId() {
        return siteId;
    }
    
    public void setSiteId(UUID siteId) {
        this.siteId = siteId;
    }
} 