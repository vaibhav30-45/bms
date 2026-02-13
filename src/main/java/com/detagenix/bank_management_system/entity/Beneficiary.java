package com.detagenix.bank_management_system.entities.user;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Beneficiary {

    @Id
    private String beneficiaryId;
    private UserEntity user;
    private String name;
    private String accountNumber;
    private String ifscCode;
    private String bankName;
    private Boolean isActive;

    public Boolean add() {
        return true;
    }

    public Boolean remove() {
        return true;
    }

    public Boolean validate() {
        return false;
    }
}

