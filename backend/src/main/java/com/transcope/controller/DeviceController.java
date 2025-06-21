package com.transcope.controller;

import com.transcope.dto.InsertPosDevice;
import com.transcope.dto.PosDeviceWithSite;
import com.transcope.entity.MerchantSite;
import com.transcope.entity.PosDevice;
import com.transcope.entity.User;
import com.transcope.repository.MerchantSiteRepository;
import com.transcope.repository.PosDeviceRepository;
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
@RequestMapping("/devices")
@CrossOrigin(origins = "http://localhost:8082")
public class DeviceController {
    
    private final PosDeviceRepository posDeviceRepository;
    private final MerchantSiteRepository merchantSiteRepository;
    private final UserService userService;
    
    public DeviceController(PosDeviceRepository posDeviceRepository, 
                          MerchantSiteRepository merchantSiteRepository,
                          UserService userService) {
        this.posDeviceRepository = posDeviceRepository;
        this.merchantSiteRepository = merchantSiteRepository;
        this.userService = userService;
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PosDeviceWithSite>> getUserDevices(@PathVariable UUID userId) {
        List<PosDevice> devices = posDeviceRepository.findByUserIdWithSite(userId);
        List<PosDeviceWithSite> deviceDtos = devices.stream()
                .map(PosDeviceWithSite::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(deviceDtos);
    }
    
    @PostMapping
    public ResponseEntity<PosDevice> createDevice(@Valid @RequestBody InsertPosDevice deviceDto) {
        // Set the user from the authenticated context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByEmail(auth.getName());
        
        // Fetch the site and validate it belongs to the user
        MerchantSite site = merchantSiteRepository.findById(deviceDto.getSiteId())
                .orElseThrow(() -> new RuntimeException("Site not found"));
        
        if (!site.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Site does not belong to the authenticated user");
        }
        
        // Create the device
        PosDevice device = new PosDevice();
        device.setDeviceId(deviceDto.getDeviceId());
        device.setModel(deviceDto.getModel());
        device.setSite(site);
        
        PosDevice savedDevice = posDeviceRepository.save(device);
        return ResponseEntity.ok(savedDevice);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PosDevice> updateDevice(@PathVariable UUID id, 
                                                 @Valid @RequestBody InsertPosDevice deviceDto) {
        return posDeviceRepository.findById(id)
                .map(device -> {
                    // Fetch the site and validate it belongs to the user
                    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                    User user = userService.getUserByEmail(auth.getName());
                    
                    MerchantSite site = merchantSiteRepository.findById(deviceDto.getSiteId())
                            .orElseThrow(() -> new RuntimeException("Site not found"));
                    
                    if (!site.getUser().getId().equals(user.getId())) {
                        throw new RuntimeException("Site does not belong to the authenticated user");
                    }
                    
                    device.setDeviceId(deviceDto.getDeviceId());
                    device.setModel(deviceDto.getModel());
                    device.setSite(site);
                    
                    PosDevice updatedDevice = posDeviceRepository.save(device);
                    return ResponseEntity.ok(updatedDevice);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable UUID id) {
        return posDeviceRepository.findById(id)
                .map(device -> {
                    posDeviceRepository.delete(device);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 