package com.detagenix.bank_management_system.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.detagenix.bank_management_system.enums.AccountStatus;

import lombok.Data;

@Data
public class AccountResponse {
	
	    private Long accountId;
	    private String accountNumber;
	    private Long userId;
	    private String userName;
	    private Long branchId;
	    private String branchName;
	    private BigDecimal accountBalance;
	    private BigDecimal minimumRequiredBalance;
	    private Boolean isActive;
	    private AccountStatus accountStatus;
	    private LocalDateTime createdAt;

}
