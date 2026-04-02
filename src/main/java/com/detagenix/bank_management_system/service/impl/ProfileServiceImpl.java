package com.detagenix.bank_management_system.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.detagenix.bank_management_system.dto.response.ProfileResponseDto;
import com.detagenix.bank_management_system.dto.response.ProfileUpdateDto;
import com.detagenix.bank_management_system.entity.Address;
import com.detagenix.bank_management_system.entity.KycDocument;
import com.detagenix.bank_management_system.entity.UserEntity;
import com.detagenix.bank_management_system.enums.AddressType;
import com.detagenix.bank_management_system.enums.KycStatus;
import com.detagenix.bank_management_system.exception.ResourceNotFoundException;
import com.detagenix.bank_management_system.repository.AddressRepository;
import com.detagenix.bank_management_system.repository.KycDocumentRepository;
import com.detagenix.bank_management_system.repository.UserRepository;
import com.detagenix.bank_management_system.service.ProfileService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService {
	private final UserRepository userRepository;
	 private final AddressRepository addressRepository;
	 private final KycDocumentRepository kycRepository;
	 
	 
	 @Override
	    @Transactional(readOnly = true)
	    public ProfileResponseDto getProfile(Long userId) {

	        log.info("Fetching profile for userId: {}", userId);

	        UserEntity user = userRepository.findById(userId)
	                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

	        Address address = addressRepository.findByUserUserId(userId)
	                .stream()
	                .findFirst()
	                .orElse(null);
	        
	        KycDocument kyc = kycRepository.findByUser_UserId(userId).orElse(null);

	        return mapToProfileResponseDto(user, address,kyc);
	    }

	    @Override
	    @Transactional
	    public ProfileResponseDto updateProfile(ProfileUpdateDto dto, Long userId) {

	        log.info("Updating profile for userId: {}", userId);

	        UserEntity user = userRepository.findById(userId)
	                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

	        // ── Update user fields ───────────────────────────────────────────────────
	        if (dto.getFirstName() != null && !dto.getFirstName().isBlank()) {
	            user.setFirstName(dto.getFirstName());
	        }
	        if (dto.getLastName() != null && !dto.getLastName().isBlank()) {
	            user.setLastName(dto.getLastName());
	        }
	        if (dto.getPhoneNumber() != null && !dto.getPhoneNumber().isBlank()) {
	            user.setPhoneNumber(dto.getPhoneNumber());
	        }

	        userRepository.save(user);
	        log.info("User fields updated for userId: {}", userId);

	        // ── Update address fields ────────────────────────────────────────────────
	        if (isAddressUpdateRequested(dto)) {

	            Address address = addressRepository.findByUserUserId(userId)
	                    .stream()
	                    .findFirst()
	                    .orElseThrow(() -> new ResourceNotFoundException(
	                            "Address not found for user ID: " + userId));

	            if (dto.getAddress() != null && !dto.getAddress().isBlank()) {
	                address.setAddress(dto.getAddress());
	            }
	            if (dto.getCity() != null && !dto.getCity().isBlank()) {
	                address.setCity(dto.getCity());
	            }
	            if (dto.getState() != null && !dto.getState().isBlank()) {
	                address.setState(dto.getState());
	            }
	            if (dto.getPincode() != null && !dto.getPincode().isBlank()) {
	                address.setPincode(dto.getPincode());
	            }

	            addressRepository.save(address);
	            log.info("Address updated for userId: {}", userId);
	        }

	        // ── Fetch fresh address and return ───────────────────────────────────────
	        Address updatedAddress = addressRepository.findByUserUserId(userId)
	                .stream()
	                .findFirst()
	                .orElse(null);

	        KycDocument kyc = kycRepository.findByUser_UserId(userId).orElse(null);
	        return mapToProfileResponseDto(user, updatedAddress,kyc);
	    }

	    // ─── Private Helpers ─────────────────────────────────────────────────────────

	    private boolean isAddressUpdateRequested(ProfileUpdateDto dto) {
	        return (dto.getAddress() != null && !dto.getAddress().isBlank())
	                || (dto.getCity() != null && !dto.getCity().isBlank())
	                || (dto.getState() != null && !dto.getState().isBlank())
	                || (dto.getPincode() != null && !dto.getPincode().isBlank());
	    }

	    private ProfileResponseDto mapToProfileResponseDto(UserEntity user, Address address,KycDocument kyc) {

	        ProfileResponseDto dto = new ProfileResponseDto();

	        dto.setFirstName(user.getFirstName());
	        dto.setLastName(user.getLastName());
	        dto.setEmail(user.getEmail());
	        dto.setPhoneNumber(user.getPhoneNumber());

	        if (address != null) {
	            dto.setAddress(address.getAddress());
	            dto.setCity(address.getCity());
	            dto.setState(address.getState());
	            dto.setPincode(address.getPincode());
	        }

	        if (kyc != null) {
	            dto.setKycStatus(kyc.getKycStatus());
	        } else {
	            dto.setKycStatus(KycStatus.NOT_SUBMITTED); // or KycStatus.NOT_SUBMITTED if you have that enum
	        }

	        return dto;
	    }
	 

}
