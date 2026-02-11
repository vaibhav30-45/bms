package com.detagenix.bank_management_system.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

//@Entity
//@Table(name="account")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String accountId;
    @Column(nullable = false)
    private String accountNumber;

    @ManyToOne
    @JoinColumn(name="branchId", nullable = false)
    private Branch branch;

    @Column(nullable = false)
    private User user;

    @Column(nullable = false)
    private BigDecimal accountBalance;

    @Column(nullable = false)
    private BigDecimal minimumRequiredBalance;

    @Column(nullable = false)
    private boolean isActive;

    @Column(nullable = false)
    private String accountStatus; // or Enum

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
}