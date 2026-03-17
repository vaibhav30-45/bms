package com.detagenix.bank_management_system.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CurrentAccountRequest {
	
	   @NotNull(message = "Branch ID is required")
	    private Long branchId;

	    @Size(max = 20, message = "GST number must not exceed 20 characters")
	    private String gstNumber;
}
