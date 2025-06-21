package com.transcope.service;

import com.transcope.dto.DashboardStatsResponse;
import com.transcope.repository.MerchantSiteRepository;
import com.transcope.repository.PosDeviceRepository;
import com.transcope.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class DashboardService {
    
    private final TransactionRepository transactionRepository;
    private final MerchantSiteRepository merchantSiteRepository;
    private final PosDeviceRepository posDeviceRepository;
    
    public DashboardService(TransactionRepository transactionRepository,
                           MerchantSiteRepository merchantSiteRepository,
                           PosDeviceRepository posDeviceRepository) {
        this.transactionRepository = transactionRepository;
        this.merchantSiteRepository = merchantSiteRepository;
        this.posDeviceRepository = posDeviceRepository;
    }
    
    public DashboardStatsResponse getDashboardStats(UUID userId) {
        BigDecimal totalRevenue = transactionRepository.sumAmountByUserId(userId);
        Long totalTransactions = transactionRepository.countByUserId(userId);
        Long activeSites = (long) merchantSiteRepository.findByUserId(userId).size();
        Long posDevices = (long) posDeviceRepository.findBySiteUserId(userId).size();
        
        return new DashboardStatsResponse(totalRevenue, totalTransactions, activeSites, posDevices);
    }
} 