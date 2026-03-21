package com.detagenix.bank_management_system.Mappper.MapStruct;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.detagenix.bank_management_system.dto.request.AddressRequest;
import com.detagenix.bank_management_system.dto.request.AddressUpdateRequest;
import com.detagenix.bank_management_system.dto.response.AddressResponse;
import com.detagenix.bank_management_system.entity.Address;

@Mapper(componentModel = "spring",nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AddressMapper {
	
	@Mapping(target = "addressId",ignore=true)
	@Mapping(target="user",ignore=true)
	Address toEntity(AddressRequest request);
	
	@Mapping(source = "user.userId", target = "userId")
	AddressResponse toResponse(Address address);
	
	 @Mapping(target = "addressId", ignore = true)
	 @Mapping(target = "user", ignore = true)
	void updateEntityFromDto(AddressUpdateRequest request,@MappingTarget Address address);

}
