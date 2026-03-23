package com.detagenix.bank_management_system.dto.request;

import com.detagenix.bank_management_system.enums.KycStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycUpdateDto {

	@NotNull(message = "KYC status is required")
    private KycStatus kycStatus;  

    @Size(max = 500, message = "Rejection reason must not exceed 500 characters")
    private String rejectionReason;  
}
