package com.detagenix.bank_management_system.service;

import com.detagenix.bank_management_system.dto.request.kycRequestDto;
import com.detagenix.bank_management_system.dto.response.KycResponseDto;

public interface KycService {
	
	KycResponseDto submitKyc(kycRequestDto kycRequestDto, Long userId);
	
	 KycResponseDto getKycByUserId(Long userId);  
	
	void deleteKyc(Long userId);

}
