package com.detagenix.bank_management_system.exception;

/**
 * Exception thrown when request data is invalid
 * Example: Invalid amount, age < 18, invalid format, etc.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}