package com.detagenix.bank_management_system.service.impl;

import com.detagenix.bank_management_system.dto.response.BranchResponse;
import com.detagenix.bank_management_system.entity.Branch;
import com.detagenix.bank_management_system.exception.ResourceNotFoundException;
import com.detagenix.bank_management_system.repository.BranchRepository;
import com.detagenix.bank_management_system.service.BranchService;
import com.detagenix.bank_management_system.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;

    @Override
    public List<BranchResponse> getAllBranches() {
        log.info("Fetching all branches");

        List<Branch> branches = branchRepository.findAll();

        log.info("Found {} branches", branches.size());

        return branches.stream()
                .map(this::mapToBranchResponse)
                .toList();
    }

    @Override
    public BranchResponse getBranchById(Long branchId) {
        log.info("Fetching branch with ID: {}", branchId);

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> {
                    log.warn("Branch not found with ID: {}", branchId);
                    return new ResourceNotFoundException(Constants.ERROR_BRANCH_NOT_FOUND);
                });

        log.info("Branch found: {}", branch.getBranchName());

        return mapToBranchResponse(branch);
    }

    @Override
    public List<BranchResponse> searchBranches(String city, String state) {
        log.info("Searching branches - city: {}, state: {}", city, state);

        List<Branch> branches;

        if (city != null && state != null) {
            branches = branchRepository.findByCityAndState(city, state);
        } else if (city != null) {
            branches = branchRepository.findByCity(city);
        } else if (state != null) {
            branches = branchRepository.findByState(state);
        } else {
            branches = branchRepository.findAll();
        }

        log.info("Found {} branches for search", branches.size());

        return branches.stream()
                .map(this::mapToBranchResponse)
                .toList();
    }

    private BranchResponse mapToBranchResponse(Branch branch) {
        return BranchResponse.builder()
                .branchId(branch.getBranchId())
                .branchCode(branch.getBranchCode())
                .branchName(branch.getBranchName())
                .ifscCode(branch.getIfscCode())
                .address(branch.getAddress())
                .city(branch.getCity())
                .state(branch.getState())
                .phoneNumber(branch.getPhoneNumber())
                .build();
    }
}