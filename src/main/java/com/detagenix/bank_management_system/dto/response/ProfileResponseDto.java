package com.detagenix.bank_management_system.dto.response;

import com.detagenix.bank_management_system.enums.KycStatus;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.ALWAYS)
public class ProfileResponseDto {

	private String firstName;
	private String lastName;
	private String email;
	private String phoneNumber;
	private String address;
	private String city;
    private String state;
    private String pincode;
    private KycStatus kycStatus;
    
    
}
