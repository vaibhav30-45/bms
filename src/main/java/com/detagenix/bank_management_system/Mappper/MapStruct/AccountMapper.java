package com.detagenix.bank_management_system.Mappper.MapStruct;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.detagenix.bank_management_system.dto.response.CurrentAccountResponse;
import com.detagenix.bank_management_system.dto.response.SavingsAccountResponse;
import com.detagenix.bank_management_system.entity.CurrentAccount;
import com.detagenix.bank_management_system.entity.SavingsAccount;

@Mapper(componentModel = "spring")
public interface AccountMapper {
	
	@Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "userName", expression = "java(account.getUser().getFirstName() + \" \" + account.getUser().getLastName())")
    @Mapping(target = "branchId", source = "branch.branchId")
    @Mapping(target = "branchName", source = "branch.branchName")
	SavingsAccountResponse toSavingsAccountResponse(SavingsAccount account);
	
	
	
	@Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "userName", expression = "java(account.getUser().getFirstName() + \" \" + account.getUser().getLastName())")
    @Mapping(target = "branchId", source = "branch.branchId")
    @Mapping(target = "branchName", source = "branch.branchName")
	 CurrentAccountResponse toCurrentAccountResponse(CurrentAccount account);

}
