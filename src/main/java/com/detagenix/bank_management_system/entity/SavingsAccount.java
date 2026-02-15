package com.detagenix.bank_management_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "savings_accounts")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class SavingsAccount extends Account {

    @Column(nullable = false)
    private Double interestRate;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal withdrawalLimit;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal dailyTxnLimit;

    @Column(nullable = false)
    private Integer maxWithdrawals;

    private LocalDate lastInterestDate;
}