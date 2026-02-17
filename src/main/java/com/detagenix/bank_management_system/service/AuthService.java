package com.detagenix.bank_management_system.service;

import com.detagenix.bank_management_system.dto.request.LoginRequest;
import com.detagenix.bank_management_system.dto.response.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}
