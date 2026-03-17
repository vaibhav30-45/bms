package com.detagenix.bank_management_system.exception;

public class AccountAlreadyExistsException extends RuntimeException{
	public AccountAlreadyExistsException(String message) {
        super(message);
    }

}
