package com.detagenix.bank_management_system.dto.response;

import com.detagenix.bank_management_system.enums.AddressType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {
	private Long addressId;
    private Long userId;
    private String address;
    private String city;
    private String state;
    private String pincode;

}
