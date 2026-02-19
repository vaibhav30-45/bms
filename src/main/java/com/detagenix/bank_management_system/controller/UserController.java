package com.detagenix.bank_management_system.controller;

import com.detagenix.bank_management_system.dto.request.UserRegistrationRequest;
import com.detagenix.bank_management_system.dto.response.ApiResponse;
import com.detagenix.bank_management_system.dto.response.UserProfileResponse;
import com.detagenix.bank_management_system.dto.response.UserRegistrationResponse;
import com.detagenix.bank_management_system.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for User-related operations
 * Base URL: /api/users
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * Register a new user
     *
     * POST /api/users/register
     *
     * @param request User registration details
     * @return Success response with user details
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserRegistrationResponse>> registerUser(
            @Valid @RequestBody UserRegistrationRequest request) {

        log.info("Received registration request for email: {}", request.getEmail());

        UserRegistrationResponse response = userService.registerUser(request);

        log.info("User registered successfully with ID: {}", response.getUserId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    /**
     * Health check endpoint
     * GET /api/users/health
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(
                ApiResponse.success("User service is running", "OK")
        );
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> profile(
            @PathVariable Long userId
    ) {
        UserProfileResponse profile = userService.getUserProfile(userId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.success("User profile retrieved successfully", profile));
    }

}