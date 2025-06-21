package com.transcope.dto;

import java.math.BigDecimal;

public class DashboardStatsResponse {
    
    private BigDecimal totalRevenue;
    private Long totalTransactions;
    private Long activeSites;
    private Long posDevices;
    
    // Constructors
    public DashboardStatsResponse() {}
    
    public DashboardStatsResponse(BigDecimal totalRevenue, Long totalTransactions, 
                                 Long activeSites, Long posDevices) {
        this.totalRevenue = totalRevenue;
        this.totalTransactions = totalTransactions;
        this.activeSites = activeSites;
        this.posDevices = posDevices;
    }
    
    // Getters and Setters
    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }
    
    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
    
    public Long getTotalTransactions() {
        return totalTransactions;
    }
    
    public void setTotalTransactions(Long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }
    
    public Long getActiveSites() {
        return activeSites;
    }
    
    public void setActiveSites(Long activeSites) {
        this.activeSites = activeSites;
    }
    
    public Long getPosDevices() {
        return posDevices;
    }
    
    public void setPosDevices(Long posDevices) {
        this.posDevices = posDevices;
    }
} 