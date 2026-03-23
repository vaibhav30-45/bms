package com.detagenix.bank_management_system.Mappper.MapStruct;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.detagenix.bank_management_system.dto.request.KycUpdateDto;
import com.detagenix.bank_management_system.dto.request.kycRequestDto;
import com.detagenix.bank_management_system.dto.response.KycResponseDto;
import com.detagenix.bank_management_system.entity.KycDocument;

@Mapper(componentModel = "spring",nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface KycMapper {
	
	@Mapping(target = "kycId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "kycStatus", ignore = true)   // defaulted to PENDING in entity
    @Mapping(target = "verifiedAt", ignore = true)  // set programmatically
    @Mapping(target = "rejectionReason", ignore = true)
    KycDocument toEntity(kycRequestDto kycRequestdto);
	
	@Mapping(source = "user.userId", target = "userId")
	@Mapping(
	    expression = "java(entity.getUser().getFirstName() + \" \" + entity.getUser().getLastName())",
	    target = "userName"
	)
    KycResponseDto toResponseDto(KycDocument entity);
	
	
	@Mapping(target = "kycId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "aadharNumber", ignore = true)
    @Mapping(target = "panNumber", ignore = true)
    @Mapping(target = "documentPath", ignore = true)
    @Mapping(target = "verifiedAt", ignore = true)  
    void updateEntityFromDto(KycUpdateDto dto, @MappingTarget KycDocument entity);
	
	

}
