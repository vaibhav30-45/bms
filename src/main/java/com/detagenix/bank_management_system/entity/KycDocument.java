package com.detagenix.bank_management_system.entity;

import java.time.LocalDateTime;

import com.detagenix.bank_management_system.enums.KycStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "kyc_documents",
         uniqueConstraints= {
        		 @UniqueConstraint(name="uk_aadhar",columnNames = "aadharNumber"),
        		 @UniqueConstraint(name="uk_pan",columnNames = "panNumber")
         },
         indexes= {
        		 @Index(name="idx_user_id",columnList = "user_id"),
        		 @Index(name = "idx_kyc_status", columnList = "kycStatus"),
        		 @Index(name = "idx_aadhar", columnList = "aadharNumber"),
        		 @Index(name = "idx_pan", columnList = "panNumber")
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private KycStatus kycStatus = KycStatus.PENDING;

    // ✅ FIX 1
    @Enumerated(EnumType.STRING)
    @Column(name = "document_status", nullable = false)
    private KycStatus documentStatus;

    // ✅ FIX 2 (NEW FIELD)
    @Column(name = "document_type", nullable = false)
    private String documentType;

    @Column(length = 12)
    private String aadharNumber;
    
    @Column(length = 10)
    private String panNumber;

    @Column(nullable = false, length = 500)
    private String documentPath;
    
    private LocalDateTime verifiedAt;
    
    @Column(length = 500)
    private String rejectionReason;
}