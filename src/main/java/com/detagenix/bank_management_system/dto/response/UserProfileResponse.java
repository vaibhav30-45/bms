package com.detagenix.bank_management_system.dto.response;

import com.detagenix.bank_management_system.entity.Address;
import com.detagenix.bank_management_system.enums.UserStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private Integer age;
    private String address;
    private String city;
    private String state;
    private String pinCode;
    private UserStatus userStatus = UserStatus.REGISTERED;
    private Boolean isActiveUser = true;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime registeredAt;
}