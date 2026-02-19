package com.detagenix.bank_management_system.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "branches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Branch extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long branchId;

    @Column(unique = true, nullable = false, length = 20)
    private String branchCode;

    @Column(nullable = false, length = 200)
    private String branchName;

    @Column(unique = true, nullable = false, length = 11)
    private String ifscCode;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 15)
    private String phoneNumber;
}