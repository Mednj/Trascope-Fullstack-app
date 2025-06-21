package com.transcope.repository;

import com.transcope.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    
    List<Transaction> findByUserId(UUID userId);
    
    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.posDevice pd LEFT JOIN FETCH pd.site WHERE t.user.id = :userId")
    List<Transaction> findByUserIdWithDetails(@Param("userId") UUID userId);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user.id = :userId")
    Long countByUserId(@Param("userId") UUID userId);
    
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId")
    BigDecimal sumAmountByUserId(@Param("userId") UUID userId);
} 