package com.detagenix.bank_management_system.service;

import java.util.List;

import com.detagenix.bank_management_system.dto.request.KycUpdateDto;
import com.detagenix.bank_management_system.dto.request.kycRequestDto;
import com.detagenix.bank_management_system.dto.response.KycResponseDto;
import com.detagenix.bank_management_system.enums.KycStatus;

public interface KycService {
	
	KycResponseDto submitKyc(kycRequestDto kycRequestDto, Long userId);
	
	KycResponseDto getKycById(Long kycId);
	
	List<KycResponseDto> getKycByStatus(KycStatus kycStatus);
	
	KycResponseDto updateKycStatus(Long kycId, KycUpdateDto kycUpdateDto);
	
	void deleteKyc(Long kycId);

}
