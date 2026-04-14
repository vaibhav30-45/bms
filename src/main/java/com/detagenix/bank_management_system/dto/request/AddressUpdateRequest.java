package com.detagenix.bank_management_system.dto.request;

import com.detagenix.bank_management_system.enums.AddressType;

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
public class AddressUpdateRequest {
	
	
	@Size(max = 200, message = "Address  must not exceed 200 characters")
    private String address;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Size(max = 100, message = "State must not exceed 100 characters")
    private String state;

    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be exactly 6 digits")
    private String pincode;

}
