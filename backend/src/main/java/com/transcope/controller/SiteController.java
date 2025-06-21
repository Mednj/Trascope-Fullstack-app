package com.transcope.controller;

import com.transcope.dto.InsertMerchantSite;
import com.transcope.dto.MerchantSiteWithDevices;
import com.transcope.entity.MerchantSite;
import com.transcope.entity.User;
import com.transcope.repository.MerchantSiteRepository;
import com.transcope.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/sites")
@CrossOrigin(origins = "http://localhost:8082")
public class SiteController {
    
    private final MerchantSiteRepository merchantSiteRepository;
    private final UserService userService;
    
    public SiteController(MerchantSiteRepository merchantSiteRepository, UserService userService) {
        this.merchantSiteRepository = merchantSiteRepository;
        this.userService = userService;
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MerchantSiteWithDevices>> getUserSites(@PathVariable UUID userId) {
        List<MerchantSite> sites = merchantSiteRepository.findByUserIdWithDevices(userId);
        List<MerchantSiteWithDevices> siteDtos = sites.stream()
                .map(MerchantSiteWithDevices::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(siteDtos);
    }
    
    @PostMapping
    public ResponseEntity<MerchantSite> createSite(@Valid @RequestBody InsertMerchantSite siteDto) {
        // Set the user from the authenticated context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByEmail(auth.getName());
        
        MerchantSite site = new MerchantSite();
        site.setName(siteDto.getName());
        site.setAddress(siteDto.getAddress());
        site.setUser(user);
        
        MerchantSite savedSite = merchantSiteRepository.save(site);
        return ResponseEntity.ok(savedSite);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MerchantSite> updateSite(@PathVariable UUID id, 
                                                  @Valid @RequestBody InsertMerchantSite siteDto) {
        return merchantSiteRepository.findById(id)
                .map(site -> {
                    site.setName(siteDto.getName());
                    site.setAddress(siteDto.getAddress());
                    
                    MerchantSite updatedSite = merchantSiteRepository.save(site);
                    return ResponseEntity.ok(updatedSite);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSite(@PathVariable UUID id) {
        return merchantSiteRepository.findById(id)
                .map(site -> {
                    merchantSiteRepository.delete(site);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 