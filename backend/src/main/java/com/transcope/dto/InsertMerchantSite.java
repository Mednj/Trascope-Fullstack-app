package com.transcope.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class InsertMerchantSite {
    
    @NotBlank(message = "Site name is required")
    @Size(max = 255, message = "Site name must be less than 255 characters")
    private String name;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    // Constructors
    public InsertMerchantSite() {}
    
    public InsertMerchantSite(String name, String address) {
        this.name = name;
        this.address = address;
    }
    
    // Getters and Setters
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
} 