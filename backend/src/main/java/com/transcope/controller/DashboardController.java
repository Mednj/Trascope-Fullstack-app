package com.transcope.controller;

import com.transcope.dto.DashboardStatsResponse;
import com.transcope.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "http://localhost:8082")
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }
    
    @GetMapping("/stats/{userId}")
    public ResponseEntity<DashboardStatsResponse> getStats(@PathVariable UUID userId) {
        // In a real application, you would verify that the authenticated user
        // has permission to access this userId's data
        DashboardStatsResponse stats = dashboardService.getDashboardStats(userId);
        return ResponseEntity.ok(stats);
    }
} 