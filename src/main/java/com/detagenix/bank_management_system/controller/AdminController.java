package com.detagenix.bank_management_system.controller;

import com.detagenix.bank_management_system.dto.response.AccountResponse;
import com.detagenix.bank_management_system.dto.response.ApiResponse;
import com.detagenix.bank_management_system.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.detagenix.bank_management_system.dto.response.SavingsAccountResponse;
import com.detagenix.bank_management_system.dto.response.CurrentAccountResponse;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AccountService accountService;

    // View all accounts in the system
    @GetMapping("/accounts")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllAccounts() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        accountService.getAllAccounts()
                )
        );
    }

   
    @GetMapping("/accounts/savings")
    public ResponseEntity<ApiResponse<List<SavingsAccountResponse>>> getAllSavingsAccounts() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        accountService.getAllSavingsAccounts()
                )
        );
    }

    @GetMapping("/accounts/current")
    public ResponseEntity<ApiResponse<List<CurrentAccountResponse>>> getAllCurrentAccounts() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        accountService.getAllCurrentAccounts()
                )
        );
    }
    // View specific account details
    @GetMapping("/accounts/{accountId}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountById(
            @PathVariable Long accountId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        accountService.getAccountById(accountId)
                )
        );
    }
}