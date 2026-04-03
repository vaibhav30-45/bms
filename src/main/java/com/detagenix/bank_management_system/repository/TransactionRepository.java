package com.detagenix.bank_management_system.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.detagenix.bank_management_system.entity.Account;
import com.detagenix.bank_management_system.entity.Transaction;
import com.detagenix.bank_management_system.enums.TransactionType;

public interface TransactionRepository extends JpaRepository<Transaction, Long>{
	
	List<Transaction> findByAccount(Account account);
	 List<Transaction> findByTargetAccount(Account account);
	 List<Transaction> findByAccountAndTransactionType(Account account, TransactionType transactionType);

	 List<Transaction> findByAccount_AccountNumberAndCreatedAtBetween(
			    String accountNumber,
			    LocalDateTime fromDate,
			    LocalDateTime toDate
			);

			List<Transaction> findByAccount_AccountNumberAndCreatedAtBetweenAndTransactionType(
			    String accountNumber,
			    LocalDateTime fromDate,
			    LocalDateTime toDate,
			    TransactionType transactionType
			);
}
