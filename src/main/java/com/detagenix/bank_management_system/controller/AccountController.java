package com.detagenix.bank_management_system.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.detagenix.bank_management_system.dto.request.CurrentAccountRequest;
import com.detagenix.bank_management_system.dto.request.SavingsAccountRequest;
import com.detagenix.bank_management_system.dto.response.*;
import com.detagenix.bank_management_system.security.CustomUserDetails;
import com.detagenix.bank_management_system.service.AccountService;
import com.detagenix.bank_management_system.util.Constants;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    // ✅ CLEAN & FINAL METHOD
    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUserId();
    }

    @PostMapping("/savings")
    public ResponseEntity<ApiResponse<SavingsAccountResponse>> createSavingsAccount(
            @Valid @RequestBody SavingsAccountRequest request) {

        Long userId = getAuthenticatedUserId();
        SavingsAccountResponse response = accountService.createSavingsAccount(request, userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(Constants.SUCCESS_ACCOUNT_CREATED, response));
    }

    @PostMapping("/current")
    public ResponseEntity<ApiResponse<CurrentAccountResponse>> createCurrentAccount(
            @Valid @RequestBody CurrentAccountRequest request) {

        Long userId = getAuthenticatedUserId();
        CurrentAccountResponse response = accountService.createCurrentAccount(request, userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(Constants.SUCCESS_ACCOUNT_CREATED, response));
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountById(
            @PathVariable Long accountId) {

        AccountResponse response = accountService.getAccountById(accountId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.success(response));
    }

    @GetMapping("/my-accounts")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getMyAccounts() {

        Long userId = getAuthenticatedUserId();
        List<AccountResponse> response = accountService.getAccountsByUserId(userId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.success(response));
    }
}