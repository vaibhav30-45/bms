package com.detagenix.bank_management_system.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.detagenix.bank_management_system.dto.response.ApiResponse;
import com.detagenix.bank_management_system.dto.response.ProfileResponseDto;
import com.detagenix.bank_management_system.dto.response.ProfileUpdateDto;
import com.detagenix.bank_management_system.security.CustomUserDetails;
import com.detagenix.bank_management_system.service.ProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final ProfileService profileService;

    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser().getUserId();
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponseDto>> getProfile() {

        Long userId = getAuthenticatedUserId();
        log.info("GET /api/profile requested by userId: {}", userId);

        ProfileResponseDto response = profileService.getProfile(userId);

        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ProfileResponseDto>> updateProfile(
            @RequestBody @Valid ProfileUpdateDto dto) {

        Long userId = getAuthenticatedUserId();
        log.info("PUT /api/profile requested by userId: {}", userId);

        ProfileResponseDto response = profileService.updateProfile(dto, userId);

        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }
}