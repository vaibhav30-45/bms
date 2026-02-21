package com.detagenix.bank_management_system.service;

import com.detagenix.bank_management_system.dto.request.UpdateProfileRequest;
import com.detagenix.bank_management_system.dto.request.UserRegistrationRequest;
import com.detagenix.bank_management_system.dto.response.UserProfileResponse;
import com.detagenix.bank_management_system.dto.response.UserRegistrationResponse;
import com.detagenix.bank_management_system.exception.DuplicateResourceException;

/**
 * Service interface for User-related operations
 * Defines the contract for user management
 */
public interface UserService {

    /**
     * Register a new user in the system
     *
     * @param request User registration details
     * @return UserRegistrationResponse with user details and success message
     * @throws DuplicateResourceException if email, phone, PAN, or Aadhaar already exists
     * @throws ValidationException if age is below minimum requirement
     */
    UserRegistrationResponse registerUser(UserRegistrationRequest request);

    // Future methods (Phase 2 and beyond):
    // UserLoginResponse loginUser(UserLoginRequest request);
    // UserDetailsResponse getUserById(Long userId);
    // UserDetailsResponse updateUser(Long userId, UpdateUserRequest request);
    // void deleteUser(Long userId);

    UserProfileResponse getUserProfile(Long userId);

    UserProfileResponse updateUserProfile(Long userId, UpdateProfileRequest request);
}