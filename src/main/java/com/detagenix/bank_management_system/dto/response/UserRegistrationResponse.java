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
	    private UserStatus userStatus;  
	    private LocalDateTime registeredAt;  
	    private String message;
}