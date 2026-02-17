package com.detagenix.bank_management_system.controller;

import com.detagenix.bank_management_system.dto.request.LoginRequest;
import com.detagenix.bank_management_system.dto.response.ApiResponse;
import com.detagenix.bank_management_system.dto.response.LoginResponse;
import com.detagenix.bank_management_system.service.AuthService;
import com.detagenix.bank_management_system.util.Constants;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        log.info("Received login request for email: {}", request.getEmail());

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.success(Constants.SUCCESS_LOGIN, response)
        );
    }

}
