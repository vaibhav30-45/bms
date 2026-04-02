package com.detagenix.bank_management_system.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.detagenix.bank_management_system.dto.request.AddressRequest;
import com.detagenix.bank_management_system.dto.request.AddressUpdateRequest;
import com.detagenix.bank_management_system.dto.response.AddressResponse;
import com.detagenix.bank_management_system.dto.response.ApiResponse;
import com.detagenix.bank_management_system.enums.AddressType;
import com.detagenix.bank_management_system.service.AddressService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@Slf4j
public class AddressController {

	private final AddressService addressService;
	
	private Long getAuthenticatedUserId() {
        return (Long) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
    }
	
	@PostMapping
    public ResponseEntity<ApiResponse<AddressResponse>> createAddress(
            @Valid @RequestBody AddressRequest request) {

        Long userId = getAuthenticatedUserId();
        AddressResponse response = addressService.createAddress(request, userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Address created successfully", response));
    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getMyAddresses() {

        Long userId = getAuthenticatedUserId();
        List<AddressResponse> response = addressService.getMyAddresses(userId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.success(response));
    }

    @GetMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponse>> getAddressById(
            @PathVariable Long addressId) {

        Long userId = getAuthenticatedUserId();
        AddressResponse response = addressService.getAddressById(addressId, userId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.success(response));
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @PathVariable Long addressId,
            @Valid @RequestBody AddressUpdateRequest request) {

        Long userId = getAuthenticatedUserId();
        AddressResponse response = addressService.updateAddress(addressId, request, userId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.success("Address updated successfully", response));
    }

}
