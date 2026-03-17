package com.detagenix.bank_management_system.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.detagenix.bank_management_system.entity.Account;
import com.detagenix.bank_management_system.enums.AccountStatus;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long>{
	Optional<Account> findByAccountNumber(String accountNumber);

    List<Account> findByUser_UserId(Long userId);

    List<Account> findByBranch_BranchId(Long branchId);

    boolean existsByAccountNumber(String accountNumber);

    List<Account> findByAccountStatus(AccountStatus accountStatus);
}
