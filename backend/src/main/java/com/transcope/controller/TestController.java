package com.transcope.controller;

import com.transcope.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "http://localhost:8082")
public class TestController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Backend is running");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> checkUsers() {
        Map<String, Object> response = new HashMap<>();
        try {
            long userCount = userRepository.count();
            response.put("userCount", userCount);
            
            // Check if demo user exists
            var demoUser = userRepository.findByEmail("merchant@transcope.com");
            response.put("demoUserExists", demoUser.isPresent());
            if (demoUser.isPresent()) {
                response.put("demoUserUsername", demoUser.get().getUsername());
                response.put("demoUserEmail", demoUser.get().getEmail());
                response.put("demoUserPasswordLength", demoUser.get().getPassword().length());
                response.put("demoUserPasswordStartsWith", demoUser.get().getPassword().substring(0, Math.min(10, demoUser.get().getPassword().length())));
            }
            
            response.put("message", "Database connection successful");
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            response.put("message", "Database connection failed");
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @PostMapping("/echo")
    public ResponseEntity<Map<String, Object>> echo(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Echo response");
        response.put("received", request);
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/test-auth")
    public ResponseEntity<Map<String, Object>> testAuth(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            // Test user lookup
            var user = userRepository.findByEmail(email);
            response.put("userFound", user.isPresent());
            
            if (user.isPresent()) {
                response.put("userEmail", user.get().getEmail());
                response.put("userUsername", user.get().getUsername());
                
                // Test password matching
                var passwordEncoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
                boolean passwordMatches = passwordEncoder.matches(password, user.get().getPassword());
                response.put("passwordMatches", passwordMatches);
                
                // Test UserDetails creation
                try {
                    var userDetails = new org.springframework.security.core.userdetails.User(
                        user.get().getEmail(),
                        user.get().getPassword(),
                        java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.get().getRole()))
                    );
                    response.put("userDetailsCreated", true);
                    response.put("userDetailsUsername", userDetails.getUsername());
                    response.put("userDetailsAuthorities", userDetails.getAuthorities().toString());
                } catch (Exception e) {
                    response.put("userDetailsCreated", false);
                    response.put("userDetailsError", e.getMessage());
                }
            }
            
            response.put("message", "Authentication test completed");
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            response.put("message", "Authentication test failed");
            return ResponseEntity.status(500).body(response);
        }
    }
} 