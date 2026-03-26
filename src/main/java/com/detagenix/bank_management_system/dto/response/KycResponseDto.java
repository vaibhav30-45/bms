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
@Builder
public class KycResponseDto {
	private Long kycId;

    private Long userId;         // flattened from UserEntity
    private String userName;     // flattened from UserEntity (optional, if useful)

    private KycStatus kycStatus;

    private String aadharNumber;
    private String panNumber;

    private String documentPath;

    
    private LocalDateTime verifiedAt;

    private String rejectionReason;

    private LocalDateTime createdAt;  // from BaseEntity
    private LocalDateTime updatedAt;  // from BaseEntity
}
