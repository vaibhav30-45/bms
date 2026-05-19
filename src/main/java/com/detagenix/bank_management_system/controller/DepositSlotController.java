package com.detagenix.bank_management_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.detagenix.bank_management_system.dto.request.CashDepositRequestDto;
import com.detagenix.bank_management_system.dto.response.CashDepositSlotResponseDto;
import com.detagenix.bank_management_system.service.DepositSlotService;

@RestController
@RequestMapping("/deposit-slot")
public class DepositSlotController {

    @Autowired
    private DepositSlotService depositSlotService;

    @PostMapping("/assign")
    public ResponseEntity<CashDepositSlotResponseDto> assignDepositSlot(
            @RequestBody CashDepositRequestDto requestDto
    ) {

        CashDepositSlotResponseDto response =
                depositSlotService.assignDepositSlot(requestDto);

        return ResponseEntity.ok(response);
    }
}