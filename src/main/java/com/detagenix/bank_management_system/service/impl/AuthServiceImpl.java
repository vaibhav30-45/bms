package com.detagenix.bank_management_system.service.impl;

import com.detagenix.bank_management_system.dto.request.LoginRequest;
import com.detagenix.bank_management_system.dto.response.LoginResponse;
import com.detagenix.bank_management_system.entity.UserEntity;
import com.detagenix.bank_management_system.exception.UnauthorizedException;
import com.detagenix.bank_management_system.exception.ValidationException;
import com.detagenix.bank_management_system.repository.UserRepository;
import com.detagenix.bank_management_system.security.JwtUtil;
import com.detagenix.bank_management_system.service.AuthService;
import com.detagenix.bank_management_system.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Value("${jwt.expiration}")
    private long jwtExpirationInMs;

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        log.info("Login attempt for email: {}", request.getEmail());

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (AuthenticationException e) {
            log.warn("Authentication failed for email: {}", request.getEmail());
            throw new UnauthorizedException(Constants.ERROR_INVALID_CREDENTIALS);
        }

        // If authentication successful: fetch user
        UserEntity user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UnauthorizedException(Constants.ERROR_INVALID_CREDENTIALS)
                );

        // Generate jwt
        String token = jwtUtil.generateToken(user.getEmail());

        log.info("Login successful for user ID: {}", user.getUserId());

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .expiresIn(jwtExpirationInMs / 1000)
                .build();
    }

}
