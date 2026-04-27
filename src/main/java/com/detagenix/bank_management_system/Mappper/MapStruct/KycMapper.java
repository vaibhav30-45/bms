package com.detagenix.bank_management_system.Mappper.MapStruct;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.detagenix.bank_management_system.dto.request.KycUpdateDto;
import com.detagenix.bank_management_system.dto.request.kycRequestDto;
import com.detagenix.bank_management_system.dto.response.KycResponseDto;
import com.detagenix.bank_management_system.entity.KycDocument;

@Mapper(componentModel = "spring",nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface KycMapper {
	
	@Mapping(target = "kycId",              ignore = true)
    @Mapping(target = "user",               ignore = true)
    @Mapping(target = "kycStatus",          ignore = true)
    @Mapping(target = "documentStatus",     ignore = true)
    @Mapping(target = "documentType",       ignore = true)
    @Mapping(target = "verifiedAt",         ignore = true)
    @Mapping(target = "rejectionReason",    ignore = true)
    @Mapping(target = "documentPath",       ignore = true)
    @Mapping(target = "videoPath",          ignore = true)
    @Mapping(target = "infoSubmitted",      ignore = true)
    @Mapping(target = "documentsSubmitted", ignore = true)
    @Mapping(target = "videoSubmitted",     ignore = true)
    KycDocument toEntity(kycRequestDto dto);
 
    // ── toResponseDto ─────────────────────────────────────────
    // FIX 1: qualifiedByName tells MapStruct exactly which
    //         String→String method to call for each field,
    //         eliminating the "ambiguous mapping" error.
    // FIX 2: source "user.userId" maps to target "userId" —
    //         make sure KycResponseDto has a Long userId field.
 
    @Mapping(source = "user.userId",    target = "userId")
    @Mapping(
        expression = "java(entity.getUser().getFirstName() + \" \" + entity.getUser().getLastName())",
        target = "userName"
    )
    @Mapping(source = "aadharNumber",   target = "aadharNumber", qualifiedByName = "maskAadhar")
    @Mapping(source = "panNumber",      target = "panNumber",    qualifiedByName = "maskPan")
    KycResponseDto toResponseDto(KycDocument entity);
 
    // ── updateEntityFromDto ───────────────────────────────────
 
    @Mapping(target = "kycId",              ignore = true)
    @Mapping(target = "user",               ignore = true)
    @Mapping(target = "aadharNumber",       ignore = true)
    @Mapping(target = "panNumber",          ignore = true)
    @Mapping(target = "documentPath",       ignore = true)
    @Mapping(target = "videoPath",          ignore = true)
    @Mapping(target = "verifiedAt",         ignore = true)
    @Mapping(target = "infoSubmitted",      ignore = true)
    @Mapping(target = "documentsSubmitted", ignore = true)
    @Mapping(target = "videoSubmitted",     ignore = true)
    void updateEntityFromDto(KycUpdateDto dto, @MappingTarget KycDocument entity);
 
    // ── Masking helpers ───────────────────────────────────────
    // FIX 1 (cont.): @Named makes these non-candidates for
    //                automatic mapping — MapStruct only calls
    //                them when explicitly referenced via
    //                qualifiedByName, so "address" (and any
    //                other plain String field) is never
    //                accidentally routed through them.
 
    @Named("maskAadhar")
    default String maskAadhar(String aadhar) {
        if (aadhar == null || aadhar.length() != 12) return aadhar;
        return "XXXX-XXXX-" + aadhar.substring(8);
    }
 
    @Named("maskPan")
    default String maskPan(String pan) {
        if (pan == null || pan.length() != 10) return pan;
        return "XXXXX" + pan.substring(5);
    }
	

}
