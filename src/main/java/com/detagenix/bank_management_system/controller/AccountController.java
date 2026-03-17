package com.detagenix.bank_management_system.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.detagenix.bank_management_system.dto.request.CurrentAccountRequest;
import com.detagenix.bank_management_system.dto.request.SavingsAccountRequest;
import com.detagenix.bank_management_system.dto.response.AccountResponse;
import com.detagenix.bank_management_system.dto.response.ApiResponse;
import com.detagenix.bank_management_system.dto.response.CurrentAccountResponse;
import com.detagenix.bank_management_system.dto.response.SavingsAccountResponse;
import com.detagenix.bank_management_system.service.AccountService;
import com.detagenix.bank_management_system.util.Constants;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
	
	private final AccountService accountService;
	
	 private Long getAuthenticatedUserId() {
	        return (Long) SecurityContextHolder.getContext()
	                .getAuthentication().getPrincipal();
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
