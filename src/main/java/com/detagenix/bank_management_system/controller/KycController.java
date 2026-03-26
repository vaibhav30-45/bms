package com.detagenix.bank_management_system.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.detagenix.bank_management_system.dto.response.ApiResponse;
import com.detagenix.bank_management_system.dto.response.KycResponseDto;
import com.detagenix.bank_management_system.service.KycService;
import com.detagenix.bank_management_system.util.Constants;
import com.detagenix.bank_management_system.dto.request.kycRequestDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/kyc")
@RequiredArgsConstructor
@Slf4j
public class KycController {
	
	private final KycService kycService;
	
	 private Long getAuthenticatedUserId() {
	        return (Long) SecurityContextHolder.getContext()
	                .getAuthentication().getPrincipal();
	    }
	
	
	 @PostMapping("/submit")
	    public ResponseEntity<ApiResponse<KycResponseDto>> submitKyc(
	            @Valid @RequestBody kycRequestDto kycRequestDto) {
	        Long userId = getAuthenticatedUserId();
	        KycResponseDto response = kycService.submitKyc(kycRequestDto, userId);
	        return ResponseEntity
	                .status(HttpStatus.CREATED)
	                .body(ApiResponse.success(Constants.SUCCESS_KYC_SUBMITTED, response));
	    }
	 
	 @GetMapping("/status")
	    public ResponseEntity<ApiResponse<KycResponseDto>> getKycStatus() {
	        Long userId = getAuthenticatedUserId();
	        KycResponseDto response = kycService.getKycByUserId(userId);
	        return ResponseEntity
	                .status(HttpStatus.OK)
	                .body(ApiResponse.success(response));
	    }

	    @DeleteMapping("/cancel")
	    public ResponseEntity<ApiResponse<String>> cancelKyc() {
	        Long userId = getAuthenticatedUserId();
	        kycService.deleteKyc(userId);
	        return ResponseEntity
	                .status(HttpStatus.OK)
	                .body(ApiResponse.success(Constants.SUCCESS_KYC_SUBMITTED));
	    }


}
