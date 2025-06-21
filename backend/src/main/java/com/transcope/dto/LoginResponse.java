package com.transcope.dto;

import com.transcope.entity.User;

import java.time.LocalDateTime;
import java.util.UUID;

public class LoginResponse {
    
    private UserDto user;
    private String token;
    
    // Constructors
    public LoginResponse() {}
    
    public LoginResponse(User user, String token) {
        this.user = new UserDto(user);
        this.token = token;
    }
    
    // Getters and Setters
    public UserDto getUser() {
        return user;
    }
    
    public void setUser(UserDto user) {
        this.user = user;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    // Inner DTO class to avoid password exposure
    public static class UserDto {
        private UUID id;
        private String username;
        private String email;
        private String merchantName;
        private String industry;
        private String role;
        private LocalDateTime createdAt;
        
        public UserDto() {}
        
        public UserDto(User user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.email = user.getEmail();
            this.merchantName = user.getMerchantName();
            this.industry = user.getIndustry();
            this.role = user.getRole();
            this.createdAt = user.getCreatedAt();
        }
        
        // Getters and Setters
        public UUID getId() {
            return id;
        }
        
        public void setId(UUID id) {
            this.id = id;
        }
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getMerchantName() {
            return merchantName;
        }
        
        public void setMerchantName(String merchantName) {
            this.merchantName = merchantName;
        }
        
        public String getIndustry() {
            return industry;
        }
        
        public void setIndustry(String industry) {
            this.industry = industry;
        }
        
        public String getRole() {
            return role;
        }
        
        public void setRole(String role) {
            this.role = role;
        }
        
        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
        
        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }
} 