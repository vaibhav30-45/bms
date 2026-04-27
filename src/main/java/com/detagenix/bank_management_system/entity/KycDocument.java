package com.detagenix.bank_management_system.entity;

import java.time.LocalDateTime;

import com.detagenix.bank_management_system.enums.KycStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "kyc_documents",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_aadhar", columnNames = "aadharNumber"),
        @UniqueConstraint(name = "uk_pan",    columnNames = "panNumber")
    },
    indexes = {
        @Index(name = "idx_user_id",    columnList = "user_id"),
        @Index(name = "idx_kyc_status", columnList = "kycStatus"),
        @Index(name = "idx_aadhar",     columnList = "aadharNumber"),
        @Index(name = "idx_pan",        columnList = "panNumber")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycDocument extends BaseEntity {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long kycId;
	 
	    @OneToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "user_id", nullable = false)
	    private UserEntity user;
	 
	    // ── Overall KYC status ────────────────────────────────────
	    @Enumerated(EnumType.STRING)
	    @Column(nullable = false, length = 50)
	    private KycStatus kycStatus = KycStatus.PENDING;
	 
	    @Enumerated(EnumType.STRING)
	    @Column(name = "document_status")
	    private KycStatus documentStatus;
	 
	    @Column(name = "document_type", nullable = false)
	    private String documentType;
	 
	    // ── Step 1: Identity info ─────────────────────────────────
	    @Column(length = 12)
	    private String aadharNumber;
	 
	    @Column(name = "aadhar_name", length = 100)
	    private String aadharName;             // Name as on Aadhaar
	 
	    @Column(length = 10)
	    private String panNumber;
	 
	    @Column(name = "pan_name", length = 100)
	    private String panName;                // Name as on PAN
	 
	    @Column(name = "date_of_birth", length = 10)
	    private String dateOfBirth;            // YYYY-MM-DD
	 
	    @Column(length = 300)
	    private String address;
	 
	    @Column(name = "info_submitted")
	    private boolean infoSubmitted = false;
	 
	    // ── Step 2: PDF document ──────────────────────────────────
	 
	    @Column(name = "document_path", length = 500)
	    private String documentPath;
	 
	    @Column(name = "documents_submitted")
	    private boolean documentsSubmitted = false;
	 
	    // ── Step 3: Video ─────────────────────────────────────────
	    @Column(name = "video_path", length = 500)
	    private String videoPath;
	 
	    @Column(name = "video_submitted")
	    private boolean videoSubmitted = false;
	 
	    // ── Admin review fields ───────────────────────────────────
	    private LocalDateTime verifiedAt;
	 
	    @Column(length = 500)
	    private String rejectionReason;
}