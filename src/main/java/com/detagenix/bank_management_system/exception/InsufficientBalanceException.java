package com.detagenix.bank_management_system.exception;

import org.springframework.web.bind.annotation.ResponseStatus;


public class InsufficientBalanceException extends RuntimeException{
	 public InsufficientBalanceException(String message) {
	        super(message);
	    }
}
