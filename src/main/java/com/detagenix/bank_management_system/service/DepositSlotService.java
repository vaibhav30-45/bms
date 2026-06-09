package com.detagenix.bank_management_system.service;

import com.detagenix.bank_management_system.dto.request.CashDepositRequestDto;
import com.detagenix.bank_management_system.dto.response.CashDepositSlotResponseDto;

public interface DepositSlotService {

    // Automatically assign deposit slot
    CashDepositSlotResponseDto assignDepositSlot(
            CashDepositRequestDto requestDto
    );

}