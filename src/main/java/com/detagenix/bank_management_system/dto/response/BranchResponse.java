package com.detagenix.bank_management_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchResponse {

    private Long branchId;
    private String branchCode;
    private String branchName;
    private String ifscCode;
    private String address;
    private String city;
    private String state;
    private String phoneNumber;
}