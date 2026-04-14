package com.detagenix.bank_management_system.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.detagenix.bank_management_system.Mappper.MapStruct.UserMapper;
import com.detagenix.bank_management_system.dto.request.UserRegistrationRequest;
import com.detagenix.bank_management_system.dto.response.UserRegistrationResponse;
import com.detagenix.bank_management_system.entity.UserEntity;
import com.detagenix.bank_management_system.enums.Role; // ✅ ADD THIS
import com.detagenix.bank_management_system.exception.DuplicateResourceException;
import com.detagenix.bank_management_system.repository.UserRepository;
import com.detagenix.bank_management_system.service.UserService;
import com.detagenix.bank_management_system.util.Constants;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public UserRegistrationResponse registerUser(UserRegistrationRequest request) {

        log.info("Registering new user with email: {}", request.getEmail());

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            log.warn("Registration failed - email already exists: {}", normalizedEmail);
            throw new DuplicateResourceException(Constants.MSG_EMAIL_ALREADY_EXISTS);
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            log.warn("Registration failed - phone already exists: {}", request.getPhoneNumber());
            throw new DuplicateResourceException(Constants.MSG_PHONE_ALREADY_EXISTS);
        }

        UserEntity user = userMapper.toEntity(request);

        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        //for role
        user.setRole(Role.ROLE_CUSTOMER);

        UserEntity savedUser = userRepository.save(user);

        log.info("User registered successfully with ID: {}", savedUser.getUserId());

        UserRegistrationResponse response = userMapper.toResponse(savedUser);
        response.setMessage(Constants.MSG_REGISTRATION_SUCCESS);

        return response;
    }
}