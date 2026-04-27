package com.detagenix.bank_management_system.dto.response;

import java.time.LocalDateTime;

import com.detagenix.bank_management_system.enums.KycStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor 
@AllArgsConstructor
public class KycResponseDto { 
	
	 private Long userId;
	    private String userName;            // firstName + " " + lastName
	 
	    // ── KYC record ───────────────────────────────────────────
	    private Long kycId;
	 
	    // ── Step 1: Identity (aadharNumber & panNumber are masked) ─
	    private String aadharNumber;        // XXXX-XXXX-3456
	    private String aadharName;
	    private String panNumber;           // XXXXX1234F
	    private String panName;
	    private String dateOfBirth;
	    private String address;
	 
	    // ── Step 2: PDF ───────────────────────────────────────────
	    private String documentPath;
	 
	    // ── Step 3: Video ─────────────────────────────────────────
	    private String videoPath;
	 
	    // ── Status ───────────────────────────────────────────────
	    private KycStatus kycStatus;
	    private KycStatus documentStatus;
	    private String documentType;
	 
	    // ── Step completion flags ─────────────────────────────────
	    private boolean infoSubmitted;
	    private boolean documentsSubmitted;
	    private boolean videoSubmitted;
	 
	    // ── Admin ─────────────────────────────────────────────────
	    private String rejectionReason;
}

