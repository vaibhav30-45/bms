package com.detagenix.bank_management_system.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.detagenix.bank_management_system.dto.request.*;
import com.detagenix.bank_management_system.dto.response.*;
import com.detagenix.bank_management_system.security.CustomUserDetails;
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser().getUserId();
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

    @PostMapping("/statement")
    public ResponseEntity<ApiResponse<AccountStatementResponseDto>> getAccountStatement(
            @RequestBody @Valid AccountStatementRequestDto request) {

        Long userId = getAuthenticatedUserId();
        log.info("POST /api/v1/transactions/statement requested by userId: {}", userId);

        AccountStatementResponseDto response = transactionService.getAccountStatement(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Account statement fetched successfully", response));
    }
}