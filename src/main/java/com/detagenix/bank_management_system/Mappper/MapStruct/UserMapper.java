package com.detagenix.bank_management_system.Mappper.MapStruct;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.detagenix.bank_management_system.dto.request.UserRegistrationRequest;
import com.detagenix.bank_management_system.dto.response.UserRegistrationResponse;
import com.detagenix.bank_management_system.entity.UserEntity;

@Mapper(componentModel = "spring")
public interface UserMapper {

	
	   @Mapping(target = "userId", ignore = true)
	    @Mapping(target = "userStatus", constant = "REGISTERED")
	    @Mapping(target = "isActiveUser", constant = "true")
	    @Mapping(target = "failedLoginAttempts", constant = "0")
	    @Mapping(target = "password", ignore = true)        // encoded in service
	    @Mapping(target = "panNumber", ignore = true)       // handled in KYC
	    @Mapping(target = "aadhaarNumber", ignore = true)   // handled in KYC
	    @Mapping(target = "gender", ignore = true)          // not in registration
	    @Mapping(target = "age", ignore = true)             // calculated field
	    @Mapping(target = "isMinor", ignore = true)         // calculated field
	    @Mapping(target = "guardianId", ignore = true)
	    @Mapping(target = "guardianName", ignore = true)
	    @Mapping(target = "role", ignore = true)
	    @Mapping(target = "addresses", ignore = true)
	    @Mapping(target = "transactions", ignore = true)
	    @Mapping(target = "kycDocument", ignore = true)
	    UserEntity toEntity(UserRegistrationRequest request);
	   
	   
	   @Mapping(target = "registeredAt", source = "createdAt")
	    @Mapping(target = "message", ignore = true)         // set manually in service
	    UserRegistrationResponse toResponse(UserEntity userEntity);
	   
}
