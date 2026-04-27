package com.detagenix.bank_management_system.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.detagenix.bank_management_system.dto.request.kycRequestDto;
import com.detagenix.bank_management_system.dto.response.KycResponseDto;

public interface KycService {

	 KycResponseDto submitKycInfo(kycRequestDto dto, Long userId);
	 
	    /**
	     * Step 2: Upload PDF document containing photos of Aadhaar + PAN.
	     * KYC record must exist (Step 1 completed first).
	     */
	    KycResponseDto submitKycDocuments(MultipartFile pdfFile, Long userId);
	 
	    /**
	     * Step 3: Upload video for face verification.
	     * Once all 3 steps are done, KYC status moves to SUBMITTED for admin review.
	     */
	    KycResponseDto submitKycVideo(MultipartFile videoFile, Long userId);
	 
	    // ── User Methods ─────────────────────────────────────────
	 
	    void deleteKyc(Long userId);
	 
	    KycResponseDto getKycByUserId(Long userId);
	 
	    // ── Admin Methods ────────────────────────────────────────
	 
	    List<KycResponseDto> getPendingKyc();
	 
	    String approveKyc(Long kycId);
	 
	    String rejectKyc(Long kycId);
}