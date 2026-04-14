package com.detagenix.bank_management_system.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileUpdateDto {

	@NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
	
	@NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian phone number")
    private String phoneNumber;

    // Address fields
    private String address;

    private String city;

    @Size(max = 100, message = "State name too long")
    private String state;

    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Enter a valid 6-digit pincode")
    private String pincode;
}
