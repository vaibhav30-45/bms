package com.detagenix.bank_management_system.dto.request;

import com.detagenix.bank_management_system.util.Constants;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationRequest {

    @NotBlank(message = Constants.MSG_FIRST_NAME_REQUIRED)
    @Size(min = Constants.NAME_MIN_LENGTH,
            max = Constants.NAME_MAX_LENGTH,
            message = Constants.MSG_NAME_SIZE)
    @Pattern(regexp = Constants.PATTERN_NAME,
            message = Constants.MSG_NAME_INVALID)
    private String firstName;

    @NotBlank(message = Constants.MSG_LAST_NAME_REQUIRED)
    @Size(min = Constants.NAME_MIN_LENGTH,
            max = Constants.NAME_MAX_LENGTH,
            message = Constants.MSG_NAME_SIZE)
    @Pattern(regexp = Constants.PATTERN_NAME,
            message = Constants.MSG_NAME_INVALID)
    private String lastName;

    @NotBlank(message = Constants.MSG_EMAIL_REQUIRED)
    @Email(message = Constants.MSG_EMAIL_INVALID)
    @Size(max = Constants.EMAIL_MAX_LENGTH,
            message = Constants.MSG_EMAIL_SIZE)
    private String email;

    @NotBlank(message = Constants.MSG_PHONE_REQUIRED)
    @Pattern(regexp = Constants.PATTERN_PHONE,
            message = Constants.MSG_PHONE_INVALID)
    private String phoneNumber;

    @NotNull(message = Constants.MSG_DOB_REQUIRED)
    @Past(message = Constants.MSG_DOB_INVALID)
    private LocalDate dateOfBirth;

    @NotBlank(message = Constants.MSG_PASSWORD_REQUIRED)
    @Size(min = Constants.PASSWORD_MIN_LENGTH,
            max = Constants.PASSWORD_MAX_LENGTH,
            message = Constants.MSG_PASSWORD_SIZE)
    @Pattern(regexp = Constants.PATTERN_PASSWORD,
            message = Constants.MSG_PASSWORD_INVALID)
    private String password;

    @NotBlank(message = Constants.MSG_ADDRESS_REQUIRED)
    @Size(min = Constants.ADDRESS_MIN_LENGTH,
            max = Constants.ADDRESS_MAX_LENGTH,
            message = Constants.MSG_ADDRESS_SIZE)
    private String address;

    @NotBlank(message = Constants.MSG_CITY_REQUIRED)
    @Size(min = Constants.CITY_MIN_LENGTH,
            max = Constants.CITY_MAX_LENGTH,
            message = Constants.MSG_CITY_SIZE)
    private String city;

    @NotBlank(message = Constants.MSG_STATE_REQUIRED)
    @Size(min = Constants.STATE_MIN_LENGTH,
            max = Constants.STATE_MAX_LENGTH,
            message = Constants.MSG_STATE_SIZE)
    private String state;

    @NotBlank(message = Constants.MSG_PINCODE_REQUIRED)
    @Pattern(regexp = Constants.PATTERN_PINCODE,
            message = Constants.MSG_PINCODE_INVALID)
    private String pinCode;

    //Normalized email: convert email to lowercase before storing in db for consistency
    public void setEmail(String email){
        this.email = email == null ? null : email.trim().toLowerCase();
    }

}