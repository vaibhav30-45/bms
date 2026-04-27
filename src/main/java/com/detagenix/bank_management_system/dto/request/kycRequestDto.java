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
	
	  @NotBlank(message = "Aadhaar number is required")
	    @Pattern(regexp = "^[2-9]{1}[0-9]{11}$", message = "Invalid Aadhaar number (must be 12 digits, starting with 2-9)")
	    private String aadharNumber;
	 
	    @NotBlank(message = "Name on Aadhaar is required")
	    @Size(min = 2, max = 100)
	    private String aadharName;
	 
	    @NotBlank(message = "Date of birth is required")
	    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "DOB must be in format YYYY-MM-DD")
	    private String dateOfBirth;
	 
	    @NotBlank(message = "Address is required")
	    @Size(min = 10, max = 300)
	    private String address;
	 
	    // ── PAN ───────────────────────────────────────────────────
	    // Field name matches entity field "panNumber" exactly
	    @NotBlank(message = "PAN number is required")
	    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "Invalid PAN format (e.g. ABCDE1234F)")
	    private String panNumber;
	 
	    @NotBlank(message = "Name on PAN is required")
	    @Size(min = 2, max = 100)
	    private String panName;
}
