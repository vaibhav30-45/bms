package com.detagenix.bank_management_system.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.detagenix.bank_management_system.dto.request.CashDepositRequestDto;
import com.detagenix.bank_management_system.dto.response.CashDepositSlotResponseDto;
import com.detagenix.bank_management_system.entity.Account;
import com.detagenix.bank_management_system.entity.Branch;
import com.detagenix.bank_management_system.entity.DepositSlot;
import com.detagenix.bank_management_system.enums.SlotStatus;
import com.detagenix.bank_management_system.repository.AccountRepository;
import com.detagenix.bank_management_system.repository.BranchRepository;
import com.detagenix.bank_management_system.repository.DepositSlotRepository;
import com.detagenix.bank_management_system.service.DepositSlotService;

@Service
public class DepositSlotServiceImpl implements DepositSlotService {

    @Autowired
    private DepositSlotRepository depositSlotRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Override
    public CashDepositSlotResponseDto assignDepositSlot(
            CashDepositRequestDto requestDto) {

        // Find Account
        Account account = accountRepository
                .findByAccountNumber(requestDto.getAccountNumber())
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        // Find Branch
        Branch branch = branchRepository
                .findById(requestDto.getBranchId())
                .orElseThrow(() ->
                        new RuntimeException("Branch not found"));

        // Slot Timing Configuration
        LocalDate slotDate = LocalDate.now();

        LocalTime openingTime = LocalTime.of(10, 0);

        LocalTime closingTime = LocalTime.of(17, 0);

        int slotDuration = 15;

        // Find Next Available Slot
        LocalTime currentStartTime = openingTime;

        while (currentStartTime.isBefore(closingTime)) {

            boolean slotExists =
            		depositSlotRepository
            		.existsByBranchBranchIdAndSlotDateAndStartTime(
                                    branch.getBranchId(),
                                    slotDate,
                                    currentStartTime
                            );

            // If slot is free
            if (!slotExists) {

                LocalTime endTime =
                        currentStartTime.plusMinutes(slotDuration);

                // Create Deposit Slot
                DepositSlot depositSlot = new DepositSlot();

                depositSlot.setAccount(account);
                depositSlot.setBranch(branch);
                depositSlot.setAmount(requestDto.getAmount());

                depositSlot.setSlotDate(slotDate);
                depositSlot.setStartTime(currentStartTime);
                depositSlot.setEndTime(endTime);

                depositSlot.setStatus(SlotStatus.ASSIGNED);

                depositSlot.setCreatedAt(LocalDateTime.now());

                // Generate Token
                String token =
                        "DEP-" +
                        System.currentTimeMillis();

                depositSlot.setTokenNumber(token);

                // Save
                depositSlotRepository.save(depositSlot);

                // Response
                CashDepositSlotResponseDto response =
                        new CashDepositSlotResponseDto();

                response.setMessage(
                        "Deposit slot assigned successfully"
                );

                response.setTokenNumber(token);

                response.setBranchName(
                        branch.getBranchName()
                );

                response.setSlotDate(slotDate);

                response.setStartTime(currentStartTime);

                response.setEndTime(endTime);

                response.setAmount(
                        requestDto.getAmount()
                );

                return response;
            }

            // Move to next slot
            currentStartTime =
                    currentStartTime.plusMinutes(slotDuration);
        }

        throw new RuntimeException(
                "No slots available for today"
        );
    }
}