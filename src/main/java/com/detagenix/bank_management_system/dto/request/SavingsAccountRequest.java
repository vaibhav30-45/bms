package com.detagenix.bank_management_system.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SavingsAccountRequest {
	
	@NotNull(message = "Branch ID is required")
    private Long branchId;

}
