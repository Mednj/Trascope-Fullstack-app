package com.transcope.dto;

import com.transcope.entity.PosDevice;
import com.transcope.entity.MerchantSite;

import java.time.LocalDateTime;
import java.util.UUID;

public class PosDeviceWithSite {
    private UUID id;
    private String deviceId;
    private String model;
    private LocalDateTime createdAt;
    private SiteInfo site;
    
    public PosDeviceWithSite() {}
    
    public PosDeviceWithSite(PosDevice device) {
        this.id = device.getId();
        this.deviceId = device.getDeviceId();
        this.model = device.getModel();
        this.createdAt = device.getCreatedAt();
        
        if (device.getSite() != null) {
            this.site = new SiteInfo(device.getSite());
        }
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public SiteInfo getSite() {
        return site;
    }
    
    public void setSite(SiteInfo site) {
        this.site = site;
    }
    
    // Inner class for site info
    public static class SiteInfo {
        private UUID id;
        private String name;
        private String address;
        private LocalDateTime createdAt;
        
        public SiteInfo() {}
        
        public SiteInfo(MerchantSite site) {
            this.id = site.getId();
            this.name = site.getName();
            this.address = site.getAddress();
            this.createdAt = site.getCreatedAt();
        }
        
        // Getters and Setters
        public UUID getId() {
            return id;
        }
        
        public void setId(UUID id) {
            this.id = id;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
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
    }
} 