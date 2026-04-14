package com.detagenix.bank_management_system.service.impl;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.detagenix.bank_management_system.Mappper.MapStruct.TransactionMapper;
import com.detagenix.bank_management_system.dto.request.AccountStatementRequestDto;
import com.detagenix.bank_management_system.dto.request.DepositRequestDto;
import com.detagenix.bank_management_system.dto.request.TransferRequestDto;
import com.detagenix.bank_management_system.dto.request.WithdrawalRequestDto;
import com.detagenix.bank_management_system.dto.response.AccountStatementResponseDto;
import com.detagenix.bank_management_system.dto.response.AccountStatementResponseDto.TransactionLineItem;
import com.detagenix.bank_management_system.dto.response.AccountVerifyResponseDto;
import com.detagenix.bank_management_system.dto.response.DepositResponseDto;
import com.detagenix.bank_management_system.dto.response.TransferResponseDto;
import com.detagenix.bank_management_system.dto.response.WithdrawalResponseDto;
import com.detagenix.bank_management_system.entity.Account;
import com.detagenix.bank_management_system.entity.Transaction;
import com.detagenix.bank_management_system.enums.AccountStatus;
import com.detagenix.bank_management_system.enums.TransactionStatus;
import com.detagenix.bank_management_system.enums.TransactionType;
import com.detagenix.bank_management_system.exception.InsufficientBalanceException;
import com.detagenix.bank_management_system.exception.ResourceNotFoundException;
import com.detagenix.bank_management_system.exception.UnauthorizedException;
import com.detagenix.bank_management_system.repository.AccountRepository;
import com.detagenix.bank_management_system.repository.TransactionRepository;
import com.detagenix.bank_management_system.service.TransactionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService{
	
	
	private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;

    
    
    @Override
    @Transactional
    public DepositResponseDto deposit(DepositRequestDto request, Long userId) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Account not found with account number: " + request.getAccountNumber()));

        if (!account.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedException("You don't own this account");
        }

        if (!account.getIsActive() || account.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new IllegalStateException("Account is not active");
        }

        BigDecimal newBalance = account.getAccountBalance().add(request.getAmount());
        account.setAccountBalance(newBalance);
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .user(account.getUser())
                .account(account)
                .transactionType(TransactionType.DEPOSIT)
                .paymentMode(request.getPaymentMode())
                .amount(request.getAmount())
                .status(TransactionStatus.SUCCESS)
                .balanceAfter(newBalance)
                .build();

        Transaction savedTransaction =   transactionRepository.save(transaction);

        return transactionMapper.toDepositResponse(savedTransaction);
    }

    @Override
    @Transactional
    public WithdrawalResponseDto withdraw(WithdrawalRequestDto request, Long userId) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Account not found with account Number: " + request.getAccountNumber()));

        if (!account.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedException("You don't own this account");
        }

        if (!account.getIsActive() || account.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new IllegalStateException("Account is not active");
        }

        BigDecimal balanceAfterWithdrawal = account.getAccountBalance().subtract(request.getAmount());
        if (balanceAfterWithdrawal.compareTo(account.getMinimumRequiredBalance()) < 0) {
            throw new InsufficientBalanceException(
                    "Insufficient balance. Minimum required balance is: "
                    + account.getMinimumRequiredBalance());
        }

        account.setAccountBalance(balanceAfterWithdrawal);
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .user(account.getUser())
                .account(account)
                .transactionType(TransactionType.WITHDRAWAL)
                .paymentMode(request.getPaymentMode())
                .amount(request.getAmount())
                .status(TransactionStatus.SUCCESS)
                .balanceAfter(balanceAfterWithdrawal)
                .build();

        transactionRepository.save(transaction);

        WithdrawalResponseDto response = transactionMapper.toWithdrawalResponse(transaction);
        response.setCurrentBalance(account.getAccountBalance());

        return response;
    }

    @Override
    @Transactional
    public TransferResponseDto transfer(TransferRequestDto request, Long userId) {
        Account senderAccount = accountRepository.findByAccountNumber(request.getSenderAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Sender account not found with id: " + request.getSenderAccountNumber()));

        if (!senderAccount.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedException("You don't own this account");
        }

        if (!senderAccount.getIsActive() || senderAccount.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new IllegalStateException("Sender account is not active");
        }

        Account receiverAccount = accountRepository.findByAccountNumber(request.getReceiverAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Receiver account not found with id: " + request.getReceiverAccountNumber()));

        if (!receiverAccount.getIsActive() || receiverAccount.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new IllegalStateException("Receiver account is not active");
        }

        if (senderAccount.getAccountId().equals(receiverAccount.getAccountId())) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        BigDecimal senderBalanceAfterTransfer = senderAccount.getAccountBalance()
                .subtract(request.getAmount());
        if (senderBalanceAfterTransfer.compareTo(senderAccount.getMinimumRequiredBalance()) < 0) {
            throw new InsufficientBalanceException(
                    "Insufficient balance. Minimum required balance is: "
                    + senderAccount.getMinimumRequiredBalance());
        }

        senderAccount.setAccountBalance(senderBalanceAfterTransfer);
        receiverAccount.setAccountBalance(receiverAccount.getAccountBalance().add(request.getAmount()));

        accountRepository.save(senderAccount);
        accountRepository.save(receiverAccount);

        Transaction transaction = Transaction.builder()
                .user(senderAccount.getUser())
                .account(senderAccount)
                .targetAccount(receiverAccount)
                .transactionType(TransactionType.TRANSFER)
                .paymentMode(request.getPaymentMode())
                .amount(request.getAmount())
                .status(TransactionStatus.SUCCESS)
                .balanceAfter(senderBalanceAfterTransfer)
                .build();

        transactionRepository.save(transaction);

        TransferResponseDto response = transactionMapper.toTransferResponse(transaction);
        response.setCurrentBalance(senderAccount.getAccountBalance());
        response.setReceiverName(
                receiverAccount.getUser().getFirstName() + " "
                + receiverAccount.getUser().getLastName());

        return response;
    }

    @Override
    public AccountVerifyResponseDto verifyAccount(String accountNumber) {
        Optional<Account> optionalAccount = accountRepository.findByAccountNumber(accountNumber);

        if (optionalAccount.isEmpty()) {
            return AccountVerifyResponseDto.builder()
                    .accountNumber(accountNumber)
                    .exists(false)
                    .build();
        }

        Account account = optionalAccount.get();

        return AccountVerifyResponseDto.builder()
                .accountId(account.getAccountId())
                .accountNumber(account.getAccountNumber())
                .accountHolderName(account.getUser().getFirstName()
                        + " " + account.getUser().getLastName())
                .exists(true)
                .build();
    }

	@Override
	public AccountStatementResponseDto getAccountStatement(AccountStatementRequestDto request, Long userId) {
		Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
	            .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

	    if (!account.getUser().getUserId().equals(userId)) {
	        throw new UnauthorizedException("You don't own this account");
	    }
	    
	    List<Transaction> transactions;

	    if (request.getTransactionType() != null) {
	        transactions = transactionRepository
	            .findByAccount_AccountNumberAndCreatedAtBetweenAndTransactionType(
	                request.getAccountNumber(),
	                request.getFromDate().atStartOfDay(),
	                request.getToDate().atTime(LocalTime.MAX),
	                request.getTransactionType()
	            );
	    } else {
	        transactions = transactionRepository
	            .findByAccount_AccountNumberAndCreatedAtBetween(
	                request.getAccountNumber(),
	                request.getFromDate().atStartOfDay(),
	                request.getToDate().atTime(LocalTime.MAX)
	            );
	    }
	    
	    List<TransactionLineItem> lineItems = transactions.stream()
	            .map(tx -> TransactionLineItem.builder()
	                    .date(tx.getCreatedAt())
	                    .transactionId(tx.getTransactionId())
	                    .type(tx.getTransactionType())
	                    .paymentMode(tx.getPaymentMode())
	                    .amount(tx.getAmount())
	                    .status(tx.getStatus())
	                    .balanceAfter(tx.getBalanceAfter())
	                    .build())
	            .toList();

	    return AccountStatementResponseDto.builder()
	            .fromDate(request.getFromDate())
	            .toDate(request.getToDate())
	            .transactions(lineItems)
	            .build();
	}


}
