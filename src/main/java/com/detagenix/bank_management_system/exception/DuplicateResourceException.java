package com.detagenix.bank_management_system.exception;

/**
 * Exception thrown when trying to create a resource that already exists
 * Example: Email already registered, PAN already exists, etc.
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }

    public DuplicateResourceException(String message, Throwable cause) {
        super(message, cause);
    }
}