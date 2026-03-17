package com.detagenix.bank_management_system.service;

import java.util.List;

import com.detagenix.bank_management_system.dto.request.CurrentAccountRequest;
import com.detagenix.bank_management_system.dto.request.SavingsAccountRequest;
import com.detagenix.bank_management_system.dto.response.AccountResponse;
import com.detagenix.bank_management_system.dto.response.CurrentAccountResponse;
import com.detagenix.bank_management_system.dto.response.SavingsAccountResponse;

public interface AccountService {
	
	SavingsAccountResponse createSavingsAccount(SavingsAccountRequest request, Long userId);

    CurrentAccountResponse createCurrentAccount(CurrentAccountRequest request, Long userId);

    AccountResponse getAccountById(Long accountId);

    List<AccountResponse> getAccountsByUserId(Long userId);
	
}
