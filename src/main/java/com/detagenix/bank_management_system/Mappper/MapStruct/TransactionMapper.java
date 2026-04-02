package com.detagenix.bank_management_system.Mappper.MapStruct;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.detagenix.bank_management_system.dto.response.DepositResponseDto;
import com.detagenix.bank_management_system.dto.response.TransferResponseDto;
import com.detagenix.bank_management_system.dto.response.WithdrawalResponseDto;
import com.detagenix.bank_management_system.entity.Transaction;

@Mapper(componentModel = "spring",nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TransactionMapper {

	
	
    @Mapping(target = "accountNumber",   source = "account.accountNumber")
	DepositResponseDto toDepositResponse(Transaction transaction);
    
    @Mapping(target = "accountNumber",  source = "account.accountNumber")
    @Mapping(target = "currentBalance", ignore = true)
    WithdrawalResponseDto toWithdrawalResponse(Transaction transaction);
    
    @Mapping(target = "senderAccountNumber",   source = "account.accountNumber")
    @Mapping(target = "receiverAccountNumber", source = "targetAccount.accountNumber")
    @Mapping(target = "currentBalance",        ignore = true)
    @Mapping(target = "receiverName",          ignore = true)
    TransferResponseDto toTransferResponse(Transaction transaction);
 
    
   
}
