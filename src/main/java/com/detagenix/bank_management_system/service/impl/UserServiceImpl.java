package com.detagenix.bank_management_system.service.impl;

import com.detagenix.bank_management_system.dto.request.UpdateProfileRequest;
import com.detagenix.bank_management_system.dto.request.UserRegistrationRequest;
import com.detagenix.bank_management_system.dto.response.UserProfileResponse;
import com.detagenix.bank_management_system.dto.response.UserRegistrationResponse;
import com.detagenix.bank_management_system.entity.Address;
import com.detagenix.bank_management_system.entity.UserEntity;
import com.detagenix.bank_management_system.enums.AddressType;
import com.detagenix.bank_management_system.enums.UserStatus;
import com.detagenix.bank_management_system.exception.DuplicateResourceException;
import com.detagenix.bank_management_system.exception.ResourceNotFoundException;
import com.detagenix.bank_management_system.exception.ValidationException;
import com.detagenix.bank_management_system.repository.AddressRepository;
import com.detagenix.bank_management_system.repository.UserRepository;
import com.detagenix.bank_management_system.service.UserService;
import com.detagenix.bank_management_system.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Register a new user with complete validation and data persistence
     */
    @Override
    @Transactional
    public UserRegistrationResponse registerUser(UserRegistrationRequest request) {

        log.info("Starting user registration for email: {}", request.getEmail());

        // Step 1: Validate no duplicates exist
        validateNoDuplicates(request);

        // Step 2: Validate age requirement
        validateAge(request.getDateOfBirth());

        // Step 3: Create and save User entity
        UserEntity user = createUserEntity(request);
        UserEntity savedUser = userRepository.save(user);

        log.info("User created successfully with ID: {}", savedUser.getUserId());

        // Step 4: Create and save Address entity
        Address address = createAddressEntity(request, savedUser);
        Address savedAddress = addressRepository.save(address);

        log.info("Address created successfully with ID: {}", savedAddress.getAddressId());

        // Step 5: Build and return response
        return buildRegistrationResponse(savedUser, savedAddress);
    }

    @Override
    public UserProfileResponse getUserProfile(Long userId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        log.info("Fetching profile for user with email: {}", email);

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository.findByUserAndAddressType(user, AddressType.PERMANENT)
                .orElseThrow(() -> new ResourceNotFoundException("Permanent address not found "));

        return UserProfileResponse.builder()
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .dateOfBirth(user.getDateOfBirth())
                .age(user.getAge())
                .address(address.getAddressLine1())
                .city(address.getCity())
                .state(address.getState())
                .pinCode(address.getPincode())
                .userStatus(user.getUserStatus())
                .isActiveUser(user.getIsActiveUser())
                .registeredAt(user.getCreatedOn())
                .build();
    }

    private UserProfileResponse mapToUserProfileResponse(UserEntity user) {

        Address address = addressRepository.findByUserUserIdAndAddressType(user.getUserId(), AddressType.PERMANENT)
                .orElse(null);

        return UserProfileResponse.builder()
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .dateOfBirth(user.getDateOfBirth())
                .age(user.getAge())
                .userStatus(user.getUserStatus())
                .isActiveUser(user.getIsActiveUser())
                .registeredAt(user.getCreatedOn())
                .address(address != null ? address.getAddressLine1(): null)
                .city(address != null ? address.getCity() : null)
                .state(address != null ? address.getState() : null)
                .pinCode(address != null ? address.getPincode() : null)
                .build();
    }

    @Override
    @Transactional
    public UserProfileResponse updateUserProfile(Long userId, UpdateProfileRequest request) {

        //Fetch user first name and last name
        UserEntity userInDb = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));


        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            userInDb.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            userInDb.setLastName(request.getLastName());
        }

        //Check if address update requested
        boolean addressUpdateRequested = request.getAddress() != null && !request.getAddress().isBlank()||
                request.getCity() != null && !request.getCity().isBlank()||
                request.getState() != null && !request.getState().isBlank()||
                request.getPinCode() != null && !request.getPinCode().isBlank();

        //Fetch user address
        if (addressUpdateRequested) {
            Address address = addressRepository.findByUserUserIdAndAddressType(userInDb.getUserId(), AddressType.PERMANENT)
                    .orElseThrow(() -> new ResourceNotFoundException("Permanent address not found"));

            if (request.getAddress() != null) {
                address.setAddressLine1(request.getAddress());
            }

            if (request.getCity() != null) {
                address.setCity(request.getCity());
            }

            if (request.getState() != null) {
                address.setState(request.getState());
            }

            if (request.getPinCode() != null) {
                address.setPincode(request.getPinCode());
            }
        }

        return mapToUserProfileResponse(userInDb);
    }

    /**
     * Validate that email, phone, PAN, and Aadhaar are unique
     */
    private void validateNoDuplicates(UserRegistrationRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email already exists - {}", request.getEmail());
            throw new DuplicateResourceException(Constants.ERROR_EMAIL_ALREADY_EXISTS);
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            log.warn("Registration failed: Phone already exists - {}", request.getPhoneNumber());
            throw new DuplicateResourceException(Constants.ERROR_PHONE_ALREADY_EXISTS);
        }
    }

    /**
     * Validate user meets minimum age requirement (18 years)
     */
    private void validateAge(LocalDate dateOfBirth) {
        int age = Period.between(dateOfBirth, LocalDate.now()).getYears();

        if (age < Constants.MINIMUM_AGE) {
            log.warn("Registration failed: User age {} is below minimum {}", age, Constants.MINIMUM_AGE);
            throw new ValidationException(Constants.ERROR_MINIMUM_AGE);
        }

        log.info("Age validation passed: {} years old", age);
    }

    /**
     * Create UserEntity from registration request
     * Password is hashed using BCrypt
     */
    private UserEntity createUserEntity(UserRegistrationRequest request) {

        int age = Period.between(request.getDateOfBirth(), LocalDate.now()).getYears();

        return UserEntity.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword())) // Hash password
                .dateOfBirth(request.getDateOfBirth())
                .age(age)
                .isMinor(age < 18)
                .panNumber(null) // Will be added during account application
                .aadhaarNumber(null)
                .isActiveUser(true)
                .failedLoginAttempts(0)
                .role("CUSTOMER") // Default role
                .userStatus(UserStatus.REGISTERED) // Initial status
                .build();
    }

    /**
     * Create Address entity linked to the user
     */
    private Address createAddressEntity(UserRegistrationRequest request, UserEntity user) {

        return Address.builder()
                .user(user)
                .addressLine1(request.getAddress())
                .addressLine2(null) // Optional - can be added later
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPinCode())
                .addressType(AddressType.PERMANENT) // Default address type
                .build();
    }

    /**
     * Build the registration response DTO
     */
    private UserRegistrationResponse buildRegistrationResponse(UserEntity user, Address address) {

        return UserRegistrationResponse.builder()
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .dateOfBirth(user.getDateOfBirth())
                .address(address.getAddressLine1())
                .city(address.getCity())
                .state(address.getState())
                .pinCode(address.getPincode())
                .userStatus(user.getUserStatus())
                .isActiveUser(user.getIsActiveUser())
                .registeredAt(user.getCreatedOn())
                .message(Constants.SUCCESS_USER_REGISTERED)
                .build();
    }
}