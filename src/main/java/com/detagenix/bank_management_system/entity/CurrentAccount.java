package com.detagenix.bank_management_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "current_accounts")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class CurrentAccount extends Account {

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal overdraftLimit;

    @Column(length = 20)
    private String gstNumber;

    @Column(nullable = false)
    private Double overdraftIntRate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyServiceFee;

    @Column(nullable = false)
    private Boolean overdraftUsed = false;

    @Column(nullable = false)
    private Integer freeTransLimit;
}