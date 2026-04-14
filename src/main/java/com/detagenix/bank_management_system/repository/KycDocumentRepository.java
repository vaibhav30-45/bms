package com.detagenix.bank_management_system.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.detagenix.bank_management_system.entity.KycDocument;
import com.detagenix.bank_management_system.enums.KycStatus;

public interface KycDocumentRepository extends JpaRepository<KycDocument, Long> {
	
	Optional<KycDocument> findByUser_UserId(Long userId);

    
    boolean existsByUser_UserId(Long userId);

   
    boolean existsByAadharNumber(String aadharNumber);

    
    boolean existsByPanNumber(String panNumber);

    List<KycDocument> findByKycStatus(KycStatus kycStatus);

 
    boolean existsByAadharNumberAndUser_UserIdNot(String aadharNumber, Long userId);

    
    boolean existsByPanNumberAndUser_UserIdNot(String panNumber, Long userId);

}
