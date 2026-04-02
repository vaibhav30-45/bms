package com.detagenix.bank_management_system.dto.request;

import java.math.BigDecimal;

import com.detagenix.bank_management_system.enums.PaymentMode;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
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
public class DepositRequestDto {

	    @NotNull(message = "Account number is required")
	    private Long accountId;
	 
	    @NotNull(message = "Deposit amount is required")
	    @DecimalMin(value = "0.01", message = "Deposit amount must be greater than zero")
	    private BigDecimal amount;
	 
	    @NotNull(message = "Payment mode is required")
	    private PaymentMode paymentMode;
}
