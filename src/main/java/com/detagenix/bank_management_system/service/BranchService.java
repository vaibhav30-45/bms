package com.detagenix.bank_management_system.service;

import com.detagenix.bank_management_system.dto.response.BranchResponse;

import java.util.List;

public interface BranchService {

    List<BranchResponse> getAllBranches();

    BranchResponse getBranchById(Long branchId);

    List<BranchResponse> searchBranches(String city, String state);
}