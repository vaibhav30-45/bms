package com.detagenix.bank_management_system.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.detagenix.bank_management_system.dto.request.DepositRequestDto;
import com.detagenix.bank_management_system.dto.request.TransferRequestDto;
import com.detagenix.bank_management_system.dto.request.WithdrawalRequestDto;
import com.detagenix.bank_management_system.dto.response.AccountVerifyResponseDto;
import com.detagenix.bank_management_system.dto.response.ApiResponse;
import com.detagenix.bank_management_system.dto.response.DepositResponseDto;
import com.detagenix.bank_management_system.dto.response.TransferResponseDto;
import com.detagenix.bank_management_system.dto.response.WithdrawalResponseDto;
import com.detagenix.bank_management_system.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {

	private final TransactionService transactionService;
	
	private Long getAuthenticatedUserId() {
        return (Long) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
    }

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<DepositResponseDto>> deposit(
            @RequestBody @Valid DepositRequestDto request) {
        Long userId = getAuthenticatedUserId();
        log.info("POST /api/v1/transactions/deposit requested by userId: {}", userId);
        DepositResponseDto response = transactionService.deposit(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Deposit successful", response));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<WithdrawalResponseDto>> withdraw(
            @RequestBody @Valid WithdrawalRequestDto request) {
        Long userId = getAuthenticatedUserId();
        log.info("POST /api/v1/transactions/withdraw requested by userId: {}", userId);
        WithdrawalResponseDto response = transactionService.withdraw(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Withdrawal successful", response));
    }

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<TransferResponseDto>> transfer(
            @RequestBody @Valid TransferRequestDto request) {
        Long userId = getAuthenticatedUserId();
        log.info("POST /api/v1/transactions/transfer requested by userId: {}", userId);
        TransferResponseDto response = transactionService.transfer(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Transfer successful", response));
    }

    @GetMapping("/verify-account")
    public ResponseEntity<ApiResponse<AccountVerifyResponseDto>> verifyAccount(
            @RequestParam String accountNumber) {
        log.info("GET /api/v1/transactions/verify-account requested for accountNumber: {}", accountNumber);
        AccountVerifyResponseDto response = transactionService.verifyAccount(accountNumber);
        return ResponseEntity.ok(ApiResponse.success("Account verified", response));
    }

}
