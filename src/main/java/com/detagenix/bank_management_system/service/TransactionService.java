package com.detagenix.bank_management_system.service;

import com.detagenix.bank_management_system.dto.request.DepositRequestDto;

import com.detagenix.bank_management_system.dto.request.TransferRequestDto;
import com.detagenix.bank_management_system.dto.request.WithdrawalRequestDto;
import com.detagenix.bank_management_system.dto.response.AccountVerifyResponseDto;
import com.detagenix.bank_management_system.dto.response.DepositResponseDto;
import com.detagenix.bank_management_system.dto.response.TransferResponseDto;
import com.detagenix.bank_management_system.dto.response.WithdrawalResponseDto;

public interface TransactionService {
	 DepositResponseDto deposit(DepositRequestDto request, Long userId);
	    WithdrawalResponseDto withdraw(WithdrawalRequestDto request, Long userId);
	    TransferResponseDto transfer(TransferRequestDto request, Long userId);
	 AccountVerifyResponseDto verifyAccount(String accountNumber);

}
