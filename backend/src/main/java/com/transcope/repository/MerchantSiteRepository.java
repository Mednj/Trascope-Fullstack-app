package com.transcope.repository;

import com.transcope.entity.MerchantSite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MerchantSiteRepository extends JpaRepository<MerchantSite, UUID> {
    
    List<MerchantSite> findByUserId(UUID userId);
    
    @Query("SELECT ms FROM MerchantSite ms LEFT JOIN FETCH ms.devices WHERE ms.user.id = :userId")
    List<MerchantSite> findByUserIdWithDevices(@Param("userId") UUID userId);
} 