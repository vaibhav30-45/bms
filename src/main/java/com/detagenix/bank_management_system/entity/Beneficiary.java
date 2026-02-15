package com.detagenix.bank_management_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity  // Was missing!
@Table(name = "beneficiaries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Beneficiary extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long beneficiaryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 20)
    private String accountNumber;

    @Column(nullable = false, length = 11)
    private String ifscCode;

    @Column(nullable = false, length = 200)
    private String bankName;

    @Column(nullable = false)
    private Boolean isActive = true;

    // Remove these methods - they belong in a Service class
    // public Boolean add() { return true; }
    // public Boolean remove() { return true; }
    // public Boolean validate() { return false; }
}