package com.detagenix.bank_management_system.service;

import java.util.List;

import com.detagenix.bank_management_system.dto.request.kycRequestDto;
import com.detagenix.bank_management_system.dto.response.KycResponseDto;

public interface KycService {

    // ================= USER METHODS =================

    KycResponseDto submitKyc(kycRequestDto kycRequestDto, Long userId);

    KycResponseDto getKycByUserId(Long userId);

    void deleteKyc(Long userId);

    // ================= ADMIN METHODS =================

    List<KycResponseDto> getPendingKyc();

    String approveKyc(Long kycId);

    String rejectKyc(Long kycId);
}