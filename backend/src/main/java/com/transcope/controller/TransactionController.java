package com.transcope.controller;

import com.transcope.dto.InsertTransaction;
import com.transcope.dto.TransactionWithDetails;
import com.transcope.entity.PosDevice;
import com.transcope.entity.Transaction;
import com.transcope.entity.User;
import com.transcope.repository.PosDeviceRepository;
import com.transcope.repository.TransactionRepository;
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
@RequestMapping("/transactions")
@CrossOrigin(origins = "http://localhost:8082")
public class TransactionController {
    
    private final TransactionRepository transactionRepository;
    private final PosDeviceRepository posDeviceRepository;
    private final UserService userService;
    
    public TransactionController(TransactionRepository transactionRepository, 
                               PosDeviceRepository posDeviceRepository,
                               UserService userService) {
        this.transactionRepository = transactionRepository;
        this.posDeviceRepository = posDeviceRepository;
        this.userService = userService;
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionWithDetails>> getUserTransactions(@PathVariable UUID userId) {
        List<Transaction> transactions = transactionRepository.findByUserIdWithDetails(userId);
        List<TransactionWithDetails> transactionDtos = transactions.stream()
                .map(TransactionWithDetails::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(transactionDtos);
    }
    
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@Valid @RequestBody InsertTransaction transactionDto) {
        // Set the user from the authenticated context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByEmail(auth.getName());
        
        // Fetch the device and validate it belongs to the user
        PosDevice device = posDeviceRepository.findById(transactionDto.getPosDeviceId())
                .orElseThrow(() -> new RuntimeException("Device not found"));
        
        if (!device.getSite().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Device does not belong to the authenticated user");
        }
        
        // Create the transaction
        Transaction transaction = new Transaction();
        transaction.setAmount(transactionDto.getAmount());
        transaction.setCurrency(transactionDto.getCurrency());
        transaction.setStatus(transactionDto.getStatus());
        transaction.setType(transactionDto.getType());
        transaction.setCustomerName(transactionDto.getCustomerName());
        transaction.setUser(user);
        transaction.setPosDevice(device);
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        return ResponseEntity.ok(savedTransaction);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable UUID id, 
                                                       @Valid @RequestBody InsertTransaction transactionDto) {
        return transactionRepository.findById(id)
                .map(transaction -> {
                    // Fetch the device and validate it belongs to the user
                    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                    User user = userService.getUserByEmail(auth.getName());
                    
                    PosDevice device = posDeviceRepository.findById(transactionDto.getPosDeviceId())
                            .orElseThrow(() -> new RuntimeException("Device not found"));
                    
                    if (!device.getSite().getUser().getId().equals(user.getId())) {
                        throw new RuntimeException("Device does not belong to the authenticated user");
                    }
                    
                    transaction.setAmount(transactionDto.getAmount());
                    transaction.setCurrency(transactionDto.getCurrency());
                    transaction.setStatus(transactionDto.getStatus());
                    transaction.setType(transactionDto.getType());
                    transaction.setCustomerName(transactionDto.getCustomerName());
                    transaction.setPosDevice(device);
                    
                    Transaction updatedTransaction = transactionRepository.save(transaction);
                    return ResponseEntity.ok(updatedTransaction);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable UUID id) {
        return transactionRepository.findById(id)
                .map(transaction -> {
                    transactionRepository.delete(transaction);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 