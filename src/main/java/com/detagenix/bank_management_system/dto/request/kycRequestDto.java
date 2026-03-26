package com.detagenix.bank_management_system.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class kycRequestDto {
	
	@NotBlank(message = "Aadhar number is required")
    @Pattern(
        regexp = "^[2-9]{1}[0-9]{11}$",
        message = "Aadhar number must be a valid 12-digit number"
    )
    private String aadharNumber;

    @NotBlank(message = "PAN number is required")
    @Pattern(
        regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
        message = "PAN number must be in valid format (e.g., ABCDE1234F)"
    )
    private String panNumber;

    @NotBlank(message = "Document path is required")
    @Size(max = 500, message = "Document path must not exceed 500 characters")
    private String documentPath;

}
