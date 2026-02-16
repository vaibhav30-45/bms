package com.detagenix.bank_management_system.exception;

/**
 * Exception thrown when business validation fails
 * Examples: Age validation, balance checks, limit validations
 */
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}