package com.detagenix.bank_management_system.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.detagenix.bank_management_system.dto.request.kycRequestDto;
import com.detagenix.bank_management_system.dto.response.ApiResponse;
import com.detagenix.bank_management_system.dto.response.KycResponseDto;
import com.detagenix.bank_management_system.security.CustomUserDetails;
import com.detagenix.bank_management_system.service.KycService;
import com.detagenix.bank_management_system.util.Constants;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/kyc")
@RequiredArgsConstructor
@Slf4j
public class KycController {

    private final KycService kycService;

    // ================= AUTH USER =================

    private Long getAuthenticatedUserId() {

        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        if (principal instanceof CustomUserDetails userDetails) {
            return userDetails.getUserId();
        }

        throw new RuntimeException("Invalid user authentication");
    }

    // ================= USER APIs =================

    @PostMapping("/submit/info")
    public ResponseEntity<ApiResponse<KycResponseDto>> submitKycInfo(
            @Valid @RequestBody kycRequestDto dto) {
 
        Long userId = getAuthenticatedUserId();
        KycResponseDto response = kycService.submitKycInfo(dto, userId);
        return ResponseEntity.ok(ApiResponse.success("Step 1 complete: KYC info submitted.", response));
    }
    
    @PostMapping(value = "/submit/documents", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<KycResponseDto>> submitKycDocuments(
            @RequestPart("pdf") MultipartFile pdfFile) {
 
        Long userId = getAuthenticatedUserId();
        KycResponseDto response = kycService.submitKycDocuments(pdfFile, userId);
        return ResponseEntity.ok(ApiResponse.success("Step 2 complete: Documents uploaded.", response));
    }
    
    @PostMapping(value = "/submit/video", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<KycResponseDto>> submitKycVideo(
            @RequestPart("video") MultipartFile videoFile) {
 
        Long userId = getAuthenticatedUserId();
        KycResponseDto response = kycService.submitKycVideo(videoFile, userId);
        return ResponseEntity.ok(ApiResponse.success("Step 3 complete: Video uploaded. KYC submitted for review.", response));
    }
    

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<KycResponseDto>> getKycStatus() {
        Long userId = getAuthenticatedUserId();
        KycResponseDto response = kycService.getKycByUserId(userId);
        if (response == null) {
            return ResponseEntity.ok(ApiResponse.success("No KYC found. Please start with Step 1.", null));
        }
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/cancel")
    public ResponseEntity<ApiResponse<String>> cancelKyc() {
        Long userId = getAuthenticatedUserId();
        kycService.deleteKyc(userId);
        return ResponseEntity.ok(ApiResponse.success("KYC cancelled successfully."));
    }

    // ================= ADMIN APIs =================

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<KycResponseDto>>> getPendingKyc() {
        List<KycResponseDto> list = kycService.getPendingKyc();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<ApiResponse<String>> approveKyc(@PathVariable Long id) {
        String msg = kycService.approveKyc(id);
        return ResponseEntity.ok(ApiResponse.success(msg));
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<ApiResponse<String>> rejectKyc(@PathVariable Long id) {
        String msg = kycService.rejectKyc(id);
        return ResponseEntity.ok(ApiResponse.success(msg));
    }
}