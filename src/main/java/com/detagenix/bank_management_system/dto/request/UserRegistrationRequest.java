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

}