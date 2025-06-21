package com.transcope.dto;

import com.transcope.entity.Transaction;
import com.transcope.entity.PosDevice;
import com.transcope.entity.MerchantSite;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class TransactionWithDetails {
    private UUID id;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String type;
    private String customerName;
    private LocalDateTime timestamp;
    private PosDeviceWithSite posDevice;
    private SiteInfo site; // Top-level site info for frontend compatibility
    
    public TransactionWithDetails() {}
    
    public TransactionWithDetails(Transaction transaction) {
        this.id = transaction.getId();
        this.amount = transaction.getAmount();
        this.currency = transaction.getCurrency();
        this.status = transaction.getStatus();
        this.type = transaction.getType();
        this.customerName = transaction.getCustomerName();
        this.timestamp = transaction.getTimestamp();
        
        if (transaction.getPosDevice() != null) {
            this.posDevice = new PosDeviceWithSite(transaction.getPosDevice());
            // Also set the top-level site info for frontend compatibility
            if (transaction.getPosDevice().getSite() != null) {
                this.site = new SiteInfo(transaction.getPosDevice().getSite());
            }
        }
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
    
    public PosDeviceWithSite getPosDevice() {
        return posDevice;
    }
    
    public void setPosDevice(PosDeviceWithSite posDevice) {
        this.posDevice = posDevice;
    }
    
    public SiteInfo getSite() {
        return site;
    }
    
    public void setSite(SiteInfo site) {
        this.site = site;
    }
    
    // Inner class for POS device with site info
    public static class PosDeviceWithSite {
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