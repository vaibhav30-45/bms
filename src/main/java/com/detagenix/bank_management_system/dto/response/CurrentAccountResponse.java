package com.detagenix.bank_management_system.dto.response;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class CurrentAccountResponse extends AccountResponse{
	private BigDecimal overdraftLimit;
//    private String gstNumber;
    private Double overdraftIntRate;
    private BigDecimal monthlyServiceFee;
    private Boolean overdraftUsed;
    private Integer freeTransLimit;
}
