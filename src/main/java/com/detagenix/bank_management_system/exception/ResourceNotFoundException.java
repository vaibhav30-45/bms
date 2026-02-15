package com.detagenix.bank_management_system.exception;

/**
 * Exception thrown when a requested resource is not found
 * Example: User not found, Account not found, etc.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}