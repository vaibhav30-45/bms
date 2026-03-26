package com.detagenix.bank_management_system.service;

import java.util.List;

import com.detagenix.bank_management_system.dto.request.AddressRequest;
import com.detagenix.bank_management_system.dto.request.AddressUpdateRequest;
import com.detagenix.bank_management_system.dto.response.AddressResponse;
import com.detagenix.bank_management_system.enums.AddressType;

public interface AddressService {
	
	AddressResponse createAddress(AddressRequest request, Long userId);

    List<AddressResponse> getMyAddresses(Long userId);

    AddressResponse getAddressById(Long addressId, Long userId);

    AddressResponse getAddressByType(AddressType addressType, Long userId);

    AddressResponse updateAddress(Long addressId, AddressUpdateRequest request, Long userId);

    void deleteAddress(Long addressId, Long userId);


}
