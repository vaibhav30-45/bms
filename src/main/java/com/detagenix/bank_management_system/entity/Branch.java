package com.detagenix.bank_management_system.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "branch")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String branchId;

    @Column(nullable = false)
    private String branchCode;

    @Column(nullable = false)
    private String branchName;

    @Column(nullable = false)
    private String ifscCode;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String phoneNumber;
}