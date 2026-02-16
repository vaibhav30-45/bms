package com.detagenix.bank_management_system.dto.response;

import com.detagenix.bank_management_system.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationResponse {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;

    // Address fields (from Address entity)
    private String address;
    private String city;
    private String state;
    private String pinCode;

    // Status fields
    private UserStatus userStatus;  // REGISTERED, ACTIVE, INACTIVE, BLOCKED
    private Boolean isActiveUser;

    // Timestamps
    private LocalDateTime registeredAt;  // From BaseEntity createdAt

    // Success message
    private String message;
}