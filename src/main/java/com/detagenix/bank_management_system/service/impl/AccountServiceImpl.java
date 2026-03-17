package com.detagenix.bank_management_system.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.detagenix.bank_management_system.Mappper.MapStruct.AccountMapper;
import com.detagenix.bank_management_system.dto.request.CurrentAccountRequest;
import com.detagenix.bank_management_system.dto.request.SavingsAccountRequest;
import com.detagenix.bank_management_system.dto.response.AccountResponse;
import com.detagenix.bank_management_system.dto.response.CurrentAccountResponse;
import com.detagenix.bank_management_system.dto.response.SavingsAccountResponse;
import com.detagenix.bank_management_system.entity.Branch;
import com.detagenix.bank_management_system.entity.CurrentAccount;
import com.detagenix.bank_management_system.entity.SavingsAccount;
import com.detagenix.bank_management_system.entity.UserEntity;
import com.detagenix.bank_management_system.enums.AccountStatus;
import com.detagenix.bank_management_system.exception.BadRequestException;
import com.detagenix.bank_management_system.exception.DuplicateResourceException;
import com.detagenix.bank_management_system.exception.ResourceNotFoundException;
import com.detagenix.bank_management_system.repository.AccountRepository;
import com.detagenix.bank_management_system.repository.BranchRepository;
import com.detagenix.bank_management_system.repository.CurrentAccountRepository;
import com.detagenix.bank_management_system.repository.SavingsAccountRepository;
import com.detagenix.bank_management_system.repository.UserRepository;
import com.detagenix.bank_management_system.service.AccountService;
import com.detagenix.bank_management_system.util.AccountNumberGenerator;
import com.detagenix.bank_management_system.util.Constants;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService{
	
	
	private final AccountRepository accountRepository;
    private final SavingsAccountRepository savingsAccountRepository;
    private final CurrentAccountRepository currentAccountRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final AccountNumberGenerator accountNumberGenerator;
    private final AccountMapper accountMapper;

	@Override
	@Transactional
	public SavingsAccountResponse createSavingsAccount(SavingsAccountRequest request, Long userId) {
		
		UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(Constants.ERROR_USER_NOT_FOUND));
		
		Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException(Constants.ERROR_BRANCH_NOT_FOUND));
		
		List<SavingsAccount> existing = savingsAccountRepository.findByUser_UserId(userId);
        if (!existing.isEmpty()) {
            throw new DuplicateResourceException("User already has a savings account");
        }
		
        SavingsAccount savingsAccount = new SavingsAccount();
        
        savingsAccount.setUser(user);
        savingsAccount.setBranch(branch);
        savingsAccount.setAccountNumber(accountNumberGenerator.generateAccountNumber());
        savingsAccount.setAccountBalance(BigDecimal.ZERO);
        savingsAccount.setMinimumRequiredBalance(new BigDecimal(Constants.DEFAULT_SAVINGS_MIN_BALANCE));
        savingsAccount.setIsActive(true);
        savingsAccount.setAccountStatus(AccountStatus.ACTIVE);
        
        savingsAccount.setInterestRate(Double.parseDouble(Constants.DEFAULT_SAVINGS_INTEREST_RATE));
        savingsAccount.setWithdrawalLimit(new BigDecimal(Constants.DEFAULT_SAVINGS_WITHDRAWAL_LIMIT));
        savingsAccount.setDailyTxnLimit(new BigDecimal(Constants.DEFAULT_SAVINGS_DAILY_TXN_LIMIT));
        savingsAccount.setMaxWithdrawals(Constants.MAX_WITHDRAWALS_PER_MONTH);
        savingsAccount.setLastInterestDate(null);
        
        
        SavingsAccount saved = savingsAccountRepository.save(savingsAccount);
        
		
		return accountMapper.toSavingsAccountResponse(saved);
	}

	@Override
	@Transactional
	public CurrentAccountResponse createCurrentAccount(CurrentAccountRequest request, Long userId) {
		
		 UserEntity user = userRepository.findById(userId)
	                .orElseThrow(() -> new ResourceNotFoundException(Constants.ERROR_USER_NOT_FOUND));
		 
		 Branch branch = branchRepository.findById(request.getBranchId())
	                .orElseThrow(() -> new ResourceNotFoundException(Constants.ERROR_BRANCH_NOT_FOUND));
		 
		 List<CurrentAccount> existing = currentAccountRepository.findByUser_UserId(userId);
	        if (!existing.isEmpty()) {
	            throw new DuplicateResourceException("User already has a current account");
	        }

	        if (request.getGstNumber() != null && !request.getGstNumber().isBlank()) {
	            currentAccountRepository.findByGstNumber(request.getGstNumber())
	                    .ifPresent(a -> {
	                        throw new DuplicateResourceException("GST number already registered");
	                    });
	        }
	        
	        CurrentAccount currentAccount = new CurrentAccount();

	        // common account fields
	        currentAccount.setUser(user);
	        currentAccount.setBranch(branch);
	        currentAccount.setAccountNumber(accountNumberGenerator.generateAccountNumber());
	        currentAccount.setAccountBalance(BigDecimal.ZERO);
	        currentAccount.setMinimumRequiredBalance(new BigDecimal(Constants.DEFAULT_CURRENT_MIN_BALANCE));
	        currentAccount.setIsActive(true);
	        currentAccount.setAccountStatus(AccountStatus.ACTIVE);

	        // current specific fields
	        currentAccount.setOverdraftLimit(new BigDecimal(Constants.DEFAULT_OVERDRAFT_LIMIT));
	        currentAccount.setGstNumber(request.getGstNumber());
	        currentAccount.setOverdraftIntRate(Double.parseDouble(Constants.DEFAULT_OVERDRAFT_INTEREST_RATE));
	        currentAccount.setMonthlyServiceFee(new BigDecimal(Constants.DEFAULT_MONTHLY_SERVICE_FEE));
	        currentAccount.setOverdraftUsed(false);
	        currentAccount.setFreeTransLimit(Constants.DEFAULT_FREE_TRANS_LIMIT);

	        // 6. Save
	        CurrentAccount saved = currentAccountRepository.save(currentAccount);

	        // 7. Map to response and return
	        return accountMapper.toCurrentAccountResponse(saved);
	
	}

	@Override
	public AccountResponse getAccountById(Long accountId) {
		return accountRepository.findById(accountId)
                .map(account -> {
                    if (account instanceof SavingsAccount) {
                        return (AccountResponse) accountMapper
                                .toSavingsAccountResponse((SavingsAccount) account);
                    } else if (account instanceof CurrentAccount) {
                        return (AccountResponse) accountMapper
                                .toCurrentAccountResponse((CurrentAccount) account);
                    }
                    throw new BadRequestException("Unknown account type");
                })
                .orElseThrow(() -> new ResourceNotFoundException(Constants.ERROR_ACCOUNT_NOT_FOUND));
	}

	@Override
	public List<AccountResponse> getAccountsByUserId(Long userId) {
		
		userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException(Constants.ERROR_USER_NOT_FOUND));
		
		return accountRepository.findByUser_UserId(userId)
                .stream()
                .map(account -> {
                    if (account instanceof SavingsAccount) {
                        return (AccountResponse) accountMapper
                                .toSavingsAccountResponse((SavingsAccount) account);
                    } else if (account instanceof CurrentAccount) {
                        return (AccountResponse) accountMapper
                                .toCurrentAccountResponse((CurrentAccount) account);
                    }
                    throw new BadRequestException("Unknown account type");
                })
                .collect(Collectors.toList());
	}

}
