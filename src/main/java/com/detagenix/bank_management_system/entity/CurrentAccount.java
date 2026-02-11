package com.detagenix.bank_management_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name="current_account")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrentAccount extends Account {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private BigDecimal overdraftLimit;

    @Column(nullable = false)
    private String gstNumber;

    @Column(nullable = false)
    private Double overdraftIntRate;

    @Column(nullable = false)
    private BigDecimal monthlyServiceFee;

    @Column(nullable = false)
    private Boolean overdraftUsed;

    @Column(nullable = false)
    private Integer freeTransLimit;
}