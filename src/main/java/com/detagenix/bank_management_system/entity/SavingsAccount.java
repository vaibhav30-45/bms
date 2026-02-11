package com.detagenix.bank_management_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name="savings_account")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavingsAccount extends Account {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private Double interestRate;

    @Column(nullable = false)
    private BigDecimal withdrawalLimit;

    @Column(nullable = false)
    private BigDecimal dailyTxnLimit;

    @Column(nullable = false)
    private Integer maxWithdrawals;

    @Column(nullable = false)
    private Date lastInterestDate;
}