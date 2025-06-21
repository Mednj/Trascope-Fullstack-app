package com.transcope.config;

import com.transcope.entity.MerchantSite;
import com.transcope.entity.PosDevice;
import com.transcope.entity.Transaction;
import com.transcope.entity.User;
import com.transcope.repository.MerchantSiteRepository;
import com.transcope.repository.PosDeviceRepository;
import com.transcope.repository.TransactionRepository;
import com.transcope.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final MerchantSiteRepository merchantSiteRepository;
    private final PosDeviceRepository posDeviceRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;
    
    public DataInitializer(UserRepository userRepository,
                          MerchantSiteRepository merchantSiteRepository,
                          PosDeviceRepository posDeviceRepository,
                          TransactionRepository transactionRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.merchantSiteRepository = merchantSiteRepository;
        this.posDeviceRepository = posDeviceRepository;
        this.transactionRepository = transactionRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            initializeSampleData();
        }
    }
    
    private void initializeSampleData() {
        User user = new User();
        user.setUsername("merchant");
        user.setEmail("merchant@transcope.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setMerchantName("TechCorp Ltd");
        user.setIndustry("Technology");
        user.setRole("MERCHANT");
        user.setCreatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        
        MerchantSite site1 = new MerchantSite("Downtown Store", "123 Main St, Downtown", savedUser);
        MerchantSite site2 = new MerchantSite("Mall Location", "456 Shopping Ave, Mall", savedUser);
        
        MerchantSite savedSite1 = merchantSiteRepository.save(site1);
        MerchantSite savedSite2 = merchantSiteRepository.save(site2);
        
        PosDevice device1 = new PosDevice("POS001", "Verifone VX520", savedSite1);
        PosDevice device2 = new PosDevice("POS002", "Ingenico iSC250", savedSite1);
        PosDevice device3 = new PosDevice("POS003", "Pax A920", savedSite2);
        
        PosDevice savedDevice1 = posDeviceRepository.save(device1);
        PosDevice savedDevice2 = posDeviceRepository.save(device2);
        PosDevice savedDevice3 = posDeviceRepository.save(device3);
        
        List<Transaction> transactions = Arrays.asList(
            new Transaction(new BigDecimal("125.50"), "USD", "COMPLETED", "SALE", "John Doe", savedUser, savedDevice1),
            new Transaction(new BigDecimal("89.99"), "USD", "COMPLETED", "SALE", "Jane Smith", savedUser, savedDevice1),
            new Transaction(new BigDecimal("250.00"), "USD", "COMPLETED", "SALE", "Bob Johnson", savedUser, savedDevice2),
            new Transaction(new BigDecimal("45.75"), "USD", "PENDING", "REFUND", "Alice Brown", savedUser, savedDevice2),
            new Transaction(new BigDecimal("199.99"), "USD", "COMPLETED", "SALE", "Charlie Wilson", savedUser, savedDevice3),
            new Transaction(new BigDecimal("75.25"), "USD", "COMPLETED", "SALE", "Diana Davis", savedUser, savedDevice3),
            new Transaction(new BigDecimal("150.00"), "USD", "FAILED", "SALE", "Eve Miller", savedUser, savedDevice1),
            new Transaction(new BigDecimal("299.99"), "USD", "COMPLETED", "SALE", "Frank Garcia", savedUser, savedDevice2)
        );
        
        transactionRepository.saveAll(transactions);
        
        System.out.println("Sample data initialized successfully!");
        System.out.println("Demo user: merchant@transcope.com / password123");
    }
} 