package com.detagenix.bank_management_system.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class SavingsAccountResponse extends AccountResponse{
	private Double interestRate;
    private BigDecimal withdrawalLimit;
    private BigDecimal dailyTxnLimit;
    private Integer maxWithdrawals;
    private LocalDate lastInterestDate;
}
