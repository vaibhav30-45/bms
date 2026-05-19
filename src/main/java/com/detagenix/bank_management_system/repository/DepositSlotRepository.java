package com.detagenix.bank_management_system.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.detagenix.bank_management_system.entity.DepositSlot;

@Repository
public interface DepositSlotRepository
        extends JpaRepository<DepositSlot, Long> {

    // Find all slots for branch and date
    List<DepositSlot> findByBranchBranchIdAndSlotDate(
            Long branchId,
            LocalDate slotDate
    );

    // Check if slot already exists
    boolean existsByBranchBranchIdAndSlotDateAndStartTime(
            Long branchId,
            LocalDate slotDate,
            LocalTime startTime
    );

    // Find slots by account
    List<DepositSlot> findByAccountAccountId(
            Long accountId
    );
}