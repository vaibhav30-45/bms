package com.detagenix.bank_management_system.dto.request;

import com.detagenix.bank_management_system.util.Constants;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = Constants.MSG_EMAIL_REQUIRED)
    @Email(message = Constants.MSG_EMAIL_INVALID)
    private String email;

    @NotBlank(message = Constants.MSG_PASSWORD_REQUIRED)
    private String password;

    public void setEmail(String email) {
        this.email = email == null ? null : email.trim().toLowerCase();
    }
}
