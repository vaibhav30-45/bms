package com.detagenix.bank_management_system.util;

/**
 * Application-wide constants
 * DO NOT hardcode values in code - use these constants
 */
public class Constants {

    // Regex Patterns for Validation
    public static final String PATTERN_EMAIL = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
    public static final String PATTERN_PHONE = "^[6-9]\\d{9}$";
    public static final String PATTERN_PAN = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$";
    public static final String PATTERN_AADHAAR = "^\\d{12}$";
    public static final String PATTERN_PINCODE = "^\\d{6}$";
    public static final String PATTERN_IFSC = "^[A-Z]{4}0[A-Z0-9]{6}$";
    public static final String PATTERN_ACCOUNT_NUMBER = "^\\d{10,16}$";

    // Password Requirements
    public static final String PATTERN_PASSWORD = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$";
    public static final int PASSWORD_MIN_LENGTH = 8;
    public static final int PASSWORD_MAX_LENGTH = 50;

    // Account Number Format
    public static final String ACCOUNT_NUMBER_PREFIX = "ACC";
    public static final int ACCOUNT_NUMBER_LENGTH = 16;

    // Transaction Reference Format
    public static final String TRANSACTION_REF_PREFIX = "TXN";
    public static final int TRANSACTION_REF_LENGTH = 20;

    // Customer ID Format
    public static final String CUSTOMER_ID_PREFIX = "CUST";
    public static final int CUSTOMER_ID_LENGTH = 14;

    // Balance Limits
    public static final String DEFAULT_SAVINGS_MIN_BALANCE = "10000.00";
    public static final String DEFAULT_CURRENT_MIN_BALANCE = "100000.00";
    public static final String MAX_ACCOUNT_BALANCE = "10000000.00"; // 1 Crore

    // Transaction Limits
    public static final String DEFAULT_DAILY_WITHDRAWAL_LIMIT = "50000.00";
    public static final String DEFAULT_DAILY_TRANSFER_LIMIT = "100000.00";
    public static final int MAX_WITHDRAWALS_PER_MONTH = 5; // For savings

    // Interest Rates
    public static final String DEFAULT_SAVINGS_INTEREST_RATE = "3.5";
    public static final String DEFAULT_OVERDRAFT_INTEREST_RATE = "12.0";

    // Age Requirements
    public static final int MINIMUM_AGE = 18;
    public static final int MAXIMUM_AGE = 100;

    // JWT Settings (will use later)
    public static final long JWT_EXPIRATION = 86400000L; // 24 hours in milliseconds

    // OTP Settings (will use later)
    public static final int OTP_LENGTH = 6;
    public static final int OTP_EXPIRY_MINUTES = 10;

    // File Upload Settings
    public static final long MAX_FILE_SIZE = 5242880L; // 5MB
    public static final String[] ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/jpg"};
    public static final String[] ALLOWED_DOCUMENT_TYPES = {"application/pdf", "image/jpeg", "image/png"};

    // Error Messages
    public static final String ERROR_USER_NOT_FOUND = "User not found";
    public static final String ERROR_ACCOUNT_NOT_FOUND = "Account not found";
    public static final String ERROR_INSUFFICIENT_BALANCE = "Insufficient balance";
    public static final String ERROR_INVALID_CREDENTIALS = "Invalid email or password";
    public static final String ERROR_EMAIL_ALREADY_EXISTS = "Email already registered";
    public static final String ERROR_PHONE_ALREADY_EXISTS = "Phone number already registered";
    public static final String ERROR_PAN_ALREADY_EXISTS = "PAN already registered";
    public static final String ERROR_ACCOUNT_FROZEN = "Account is frozen";
    public static final String ERROR_ACCOUNT_CLOSED = "Account is closed";
    public static final String ERROR_DAILY_LIMIT_EXCEEDED = "Daily transaction limit exceeded";
    public static final String ERROR_MINIMUM_AGE = "Must be at least 18 years old";

    // Success Messages
    public static final String SUCCESS_USER_REGISTERED = "User registered successfully";
    public static final String SUCCESS_ACCOUNT_CREATED = "Account created successfully";
    public static final String SUCCESS_TRANSACTION_COMPLETED = "Transaction completed successfully";
    public static final String SUCCESS_KYC_SUBMITTED = "KYC documents submitted successfully";

    // Private constructor to prevent instantiation
    private Constants() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }
}