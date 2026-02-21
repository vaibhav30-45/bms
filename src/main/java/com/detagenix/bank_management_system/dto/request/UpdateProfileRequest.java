package com.detagenix.bank_management_system.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Pattern(regexp = "^[A-Za-z]+$", message = "First name must contain letters only")
    private String firstName;

    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Pattern(regexp = "^[A-Za-z]+$", message = "Last name must contain letters only")
    private String lastName;

    @Size(min = 10, max = 200, message = "Address must be between 10 and 200 characters")
    private String address;

    @Size(min = 2, max = 50, message = "City must be between 2 and 50 characters")
    private String city;

    @Size(min = 2, max = 50, message = "State must be between 2 and 50 characters")
    private String state;

    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "PinCode must be 6 digits and cannot start with 0")
    private String pinCode;
}