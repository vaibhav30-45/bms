package com.detagenix.bank_management_system.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
 
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountVerifyResponseDto {

	 private Long accountId;
	    private String accountNumber;
	    private String accountHolderName;
	    private boolean exists;
}
