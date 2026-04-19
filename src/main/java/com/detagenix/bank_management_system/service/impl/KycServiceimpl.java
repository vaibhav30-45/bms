package com.detagenix.bank_management_system.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.detagenix.bank_management_system.Mappper.MapStruct.KycMapper;
import com.detagenix.bank_management_system.dto.request.kycRequestDto;
import com.detagenix.bank_management_system.dto.response.KycResponseDto;
import com.detagenix.bank_management_system.entity.KycDocument;
import com.detagenix.bank_management_system.entity.UserEntity;
import com.detagenix.bank_management_system.enums.KycStatus;
import com.detagenix.bank_management_system.exception.ResourceNotFoundException;
import com.detagenix.bank_management_system.repository.KycDocumentRepository;
import com.detagenix.bank_management_system.repository.UserRepository;
import com.detagenix.bank_management_system.service.KycService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class KycServiceimpl implements KycService {

    private final KycDocumentRepository kycRepository;
    private final UserRepository userRepository;
    private final KycMapper kycMapper;

    // ================= USER METHODS =================

    @Override
    @Transactional
    public KycResponseDto submitKyc(kycRequestDto kycRequestDto, Long userId) {

        log.info("Submitting KYC for userId: {}", userId);

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check existing KYC
        kycRepository.findByUser_UserId(userId).ifPresent(existingKyc -> {
            if (existingKyc.getKycStatus() == KycStatus.VERIFIED) {
                throw new IllegalStateException("KYC is already VERIFIED. Cannot re-submit.");
            }
            if (existingKyc.getKycStatus() == KycStatus.SUBMITTED) {
                throw new IllegalStateException("KYC is already SUBMITTED. Please wait for review.");
            }
        });

        KycDocument kyc = kycMapper.toEntity(kycRequestDto);
        kyc.setUser(user);

    
        kyc.setKycStatus(KycStatus.SUBMITTED);
        kyc.setDocumentStatus(KycStatus.SUBMITTED);

    
        kyc.setDocumentType("AADHAR");

        KycDocument savedKyc = kycRepository.save(kyc);

        log.info("KYC submitted successfully with id: {}", savedKyc.getKycId());

        return kycMapper.toResponseDto(savedKyc);
    }

    @Override
    @Transactional
    public void deleteKyc(Long userId) {

        log.info("Cancelling KYC for userId: {}", userId);

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        KycDocument kyc = kycRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No KYC found for userId: " + userId));

        if (kyc.getKycStatus() == KycStatus.VERIFIED) {
            throw new IllegalStateException("Cannot cancel a VERIFIED KYC. Contact support.");
        }

        user.setKycDocument(null);
        userRepository.saveAndFlush(user);

        kycRepository.delete(kyc);

        log.info("KYC cancelled successfully for userId: {}", userId);
    }

    @Override
    @Transactional(readOnly = true)
    public KycResponseDto getKycByUserId(Long userId) {

        log.info("Fetching KYC status for userId: {}", userId);

        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return kycRepository.findByUser_UserId(userId)
                .map(kycMapper::toResponseDto)
                .orElse(null);
    }

    // ================= ADMIN METHODS =================

    @Override
    @Transactional(readOnly = true)
    public List<KycResponseDto> getPendingKyc() {

        log.info("Fetching all SUBMITTED KYC for admin");

        return kycRepository.findByKycStatus(KycStatus.SUBMITTED)
                .stream()
                .map(kycMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional
    public String approveKyc(Long kycId) {

        log.info("Approving KYC with id: {}", kycId);

        KycDocument kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new ResourceNotFoundException("KYC not found with id: " + kycId));

        kyc.setKycStatus(KycStatus.VERIFIED);
        kycRepository.save(kyc);

        return "KYC Approved Successfully";
    }

    @Override
    @Transactional
    public String rejectKyc(Long kycId) {

        log.info("Rejecting KYC with id: {}", kycId);

        KycDocument kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new ResourceNotFoundException("KYC not found with id: " + kycId));

        kyc.setKycStatus(KycStatus.REJECTED);
        kycRepository.save(kyc);

        return "KYC Rejected Successfully";
    }
}