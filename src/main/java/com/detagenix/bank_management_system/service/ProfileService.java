package com.detagenix.bank_management_system.service;

import com.detagenix.bank_management_system.dto.response.ProfileResponseDto;
import com.detagenix.bank_management_system.dto.response.ProfileUpdateDto;

public interface ProfileService {
	ProfileResponseDto getProfile(Long userId);
	ProfileResponseDto updateProfile(ProfileUpdateDto dto,Long userId);
}
