package com.detagenix.bank_management_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name="standing_instruction")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StandingInstruction {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String instructionId;

    @Column(nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Account fromAccount;

    @Column(nullable = false)
    private Beneficiary beneficiary;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String frequency;

    @Column(nullable = false)
    private Date startDate;

    @Column(nullable = false)
    private Date endDate;
}