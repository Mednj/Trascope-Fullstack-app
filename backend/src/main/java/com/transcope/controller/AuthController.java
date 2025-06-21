package com.transcope.controller;

import com.transcope.dto.LoginRequest;
import com.transcope.dto.LoginResponse;
import com.transcope.security.JwtTokenProvider;
import com.transcope.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:8082")
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    
    public AuthController(AuthenticationManager authenticationManager,
                         JwtTokenProvider tokenProvider,
                         UserService userService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate user using email as username
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), // Use email as username
                    loginRequest.getPassword()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Generate JWT token
            String jwt = tokenProvider.generateToken(authentication);
            
            // Get user details
            var user = userService.getUserByEmail(loginRequest.getEmail());
            
            return ResponseEntity.ok(new LoginResponse(user, jwt));
        } catch (Exception e) {
            // Return a more specific error response
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // In a stateless JWT setup, logout is typically handled client-side
        // by removing the token. This endpoint can be used for additional
        // server-side cleanup if needed.
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }
} 