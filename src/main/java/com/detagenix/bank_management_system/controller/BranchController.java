package com.detagenix.bank_management_system.controller;

import com.detagenix.bank_management_system.dto.response.ApiResponse;
import com.detagenix.bank_management_system.dto.response.BranchResponse;
import com.detagenix.bank_management_system.service.BranchService;
import com.detagenix.bank_management_system.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
@RequiredArgsConstructor
@Slf4j
public class BranchController {

    private final BranchService branchService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BranchResponse>>> getAllBranches() {
        log.info("Request received: GET /api/branches");

        List<BranchResponse> branches = branchService.getAllBranches();

        return ResponseEntity.ok(
                ApiResponse.success(Constants.SUCCESS_BRANCHES_RETRIEVED, branches)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BranchResponse>> getBranchById(@PathVariable Long id) {
        log.info("Request received: GET /api/branches/{}", id);

        BranchResponse branch = branchService.getBranchById(id);

        return ResponseEntity.ok(
                ApiResponse.success(Constants.SUCCESS_BRANCH_FOUND, branch)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<BranchResponse>>> searchBranches(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state) {

        log.info("Request received: GET /api/branches/search - city: {}, state: {}", city, state);

        List<BranchResponse> branches = branchService.searchBranches(city, state);

        return ResponseEntity.ok(
                ApiResponse.success(Constants.SUCCESS_BRANCHES_FOUND, branches)
        );
    }
}