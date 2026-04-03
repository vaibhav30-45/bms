package com.detagenix.bank_management_system.dto.request;

import java.time.LocalDate;

import com.detagenix.bank_management_system.enums.TransactionType;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountStatementRequestDto {
	
	    @NotNull
	    private String accountNumber;

	    @NotNull
	    private LocalDate fromDate;         

	    @NotNull
	    private LocalDate toDate;            

	    private TransactionType transactionType;  

}
