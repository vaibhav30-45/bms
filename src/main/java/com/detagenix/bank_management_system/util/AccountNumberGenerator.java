package com.detagenix.bank_management_system.util;

import java.security.SecureRandom;

import org.springframework.stereotype.Component;

import com.detagenix.bank_management_system.repository.AccountRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AccountNumberGenerator {
	
	private final AccountRepository accountRepository;
	private static final SecureRandom random = new SecureRandom();
	
	
	public String generateAccountNumber() {
        String accountNumber;
        do {
            accountNumber = buildAccountNumber();
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
	
	
	private String buildAccountNumber() {
        // Total length = 16, PREFIX = "ACC" (3 chars), so digits = 13
        int digitsLength = Constants.ACCOUNT_NUMBER_LENGTH - Constants.ACCOUNT_NUMBER_PREFIX.length();
        StringBuilder digits = new StringBuilder();
        for (int i = 0; i < digitsLength; i++) {
            digits.append(random.nextInt(10));
        }
        return Constants.ACCOUNT_NUMBER_PREFIX + digits;
    }


}
