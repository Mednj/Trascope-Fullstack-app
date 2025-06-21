package com.transcope.dto;

import com.transcope.entity.MerchantSite;
import com.transcope.entity.PosDevice;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class MerchantSiteWithDevices {
    private UUID id;
    private String name;
    private String address;
    private LocalDateTime createdAt;
    private List<DeviceInfo> devices;
    
    public MerchantSiteWithDevices() {}
    
    public MerchantSiteWithDevices(MerchantSite site) {
        this.id = site.getId();
        this.name = site.getName();
        this.address = site.getAddress();
        this.createdAt = site.getCreatedAt();
        
        if (site.getDevices() != null) {
            this.devices = site.getDevices().stream()
                    .map(DeviceInfo::new)
                    .collect(Collectors.toList());
        }
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
    
    public List<DeviceInfo> getDevices() {
        return devices;
    }
    
    public void setDevices(List<DeviceInfo> devices) {
        this.devices = devices;
    }
    
    // Inner class for device info
    public static class DeviceInfo {
        private UUID id;
        private String deviceId;
        private String model;
        private LocalDateTime createdAt;
        
        public DeviceInfo() {}
        
        public DeviceInfo(PosDevice device) {
            this.id = device.getId();
            this.deviceId = device.getDeviceId();
            this.model = device.getModel();
            this.createdAt = device.getCreatedAt();
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
    }
} 