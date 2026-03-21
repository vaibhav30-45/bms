package com.detagenix.bank_management_system.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.detagenix.bank_management_system.Mappper.MapStruct.AddressMapper;
import com.detagenix.bank_management_system.dto.request.AddressRequest;
import com.detagenix.bank_management_system.dto.request.AddressUpdateRequest;
import com.detagenix.bank_management_system.dto.response.AddressResponse;
import com.detagenix.bank_management_system.entity.Address;
import com.detagenix.bank_management_system.entity.UserEntity;
import com.detagenix.bank_management_system.enums.AddressType;
import com.detagenix.bank_management_system.exception.DuplicateResourceException;
import com.detagenix.bank_management_system.exception.ResourceNotFoundException;
import com.detagenix.bank_management_system.exception.UnauthorizedException;
import com.detagenix.bank_management_system.repository.AddressRepository;
import com.detagenix.bank_management_system.repository.UserRepository;
import com.detagenix.bank_management_system.service.AddressService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddressServiceImpl implements AddressService{

	private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final AddressMapper addressMapper;
    
    @Override
    @Transactional
    public AddressResponse createAddress(AddressRequest request, Long userId) {

        UserEntity user = findUserByIdOrThrow(userId);

        // Prevent duplicate address type for same user
        if (addressRepository.existsByUserUserIdAndAddressType(userId, request.getAddressType())) {
            throw new DuplicateResourceException(
                "Address of type '" + request.getAddressType() +
                "' already exists for this user. Please update the existing one."
            );
        }

        Address address = addressMapper.toEntity(request);
        address.setUser(user);

        Address saved = addressRepository.save(address);
        log.info("Address created with ID: {} for user: {}", saved.getAddressId(), userId);

        return addressMapper.toResponse(saved);
    }

    // ─────────────────────────────────────────────
    // READ
    // ─────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getMyAddresses(Long userId) {

        findUserByIdOrThrow(userId);

        List<Address> addresses = addressRepository.findByUserUserId(userId);

        if (addresses.isEmpty()) {
            throw new ResourceNotFoundException(
                "No addresses found for user with ID: " + userId
            );
        }

        log.info("Fetched {} address(es) for user: {}", addresses.size(), userId);

        return addresses.stream()
                .map(addressMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AddressResponse getAddressById(Long addressId, Long userId) {

        Address address = findAddressByIdOrThrow(addressId);
        verifyOwnership(address, userId);

        return addressMapper.toResponse(address);
    }

    @Override
    @Transactional(readOnly = true)
    public AddressResponse getAddressByType(AddressType addressType, Long userId) {

        findUserByIdOrThrow(userId);

        Address address = addressRepository
                .findByUserUserIdAndAddressType(userId, addressType)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "No address of type '" + addressType + "' found for user with ID: " + userId
                ));

        return addressMapper.toResponse(address);
    }

    // ─────────────────────────────────────────────
    // UPDATE
    // ─────────────────────────────────────────────

    @Override
    @Transactional
    public AddressResponse updateAddress(Long addressId, AddressUpdateRequest request, Long userId) {

        Address address = findAddressByIdOrThrow(addressId);
        verifyOwnership(address, userId);

        // If address type is being changed check no duplicate exists
        if (request.getAddressType() != null &&
            !request.getAddressType().equals(address.getAddressType())) {

            if (addressRepository.existsByUserUserIdAndAddressType(userId, request.getAddressType())) {
                throw new DuplicateResourceException(
                    "Address of type '" + request.getAddressType() +
                    "' already exists. Cannot change to this type."
                );
            }
        }

        addressMapper.updateEntityFromDto(request, address);

        Address updated = addressRepository.save(address);
        log.info("Address ID: {} updated for user: {}", addressId, userId);

        return addressMapper.toResponse(updated);
    }

    // ─────────────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────────────

    @Override
    @Transactional
    public void deleteAddress(Long addressId, Long userId) {

        Address address = findAddressByIdOrThrow(addressId);
        verifyOwnership(address, userId);

        addressRepository.delete(address);
        log.info("Address ID: {} deleted for user: {}", addressId, userId);
    }

    // ─────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────

    private UserEntity findUserByIdOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "User not found with ID: " + userId
                ));
    }

    private Address findAddressByIdOrThrow(Long addressId) {
        return addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Address not found with ID: " + addressId
                ));
    }

    private void verifyOwnership(Address address, Long userId) {
        if (!address.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedException(
                "You are not authorized to access address with ID: " + address.getAddressId()
            );
        }
    }
    
	
    
    
    
}
