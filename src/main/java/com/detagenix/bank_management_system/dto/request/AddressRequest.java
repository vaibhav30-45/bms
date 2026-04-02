package com.detagenix.bank_management_system.dto.request;

import com.detagenix.bank_management_system.enums.AddressType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddressRequest {
	
	    @NotBlank(message = "Address  is required")
	    @Size(max = 200, message = "Address  must not exceed 200 characters")
	    private String address;

	    @NotBlank(message = "City is required")
	    @Size(max = 100, message = "City must not exceed 100 characters")
	    private String city;

	    @NotBlank(message = "State is required")
	    @Size(max = 100, message = "State must not exceed 100 characters")
	    private String state;

	    @NotBlank(message = "Pincode is required")
	    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be exactly 6 digits")
	    private String pincode;

}
