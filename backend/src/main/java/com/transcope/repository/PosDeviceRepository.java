package com.transcope.repository;

import com.transcope.entity.PosDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PosDeviceRepository extends JpaRepository<PosDevice, UUID> {
    
    List<PosDevice> findBySiteUserId(UUID userId);
    
    @Query("SELECT pd FROM PosDevice pd LEFT JOIN FETCH pd.site WHERE pd.site.user.id = :userId")
    List<PosDevice> findByUserIdWithSite(@Param("userId") UUID userId);
    
    boolean existsByDeviceId(String deviceId);
} 