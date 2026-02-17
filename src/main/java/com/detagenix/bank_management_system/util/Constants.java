package com.detagenix.bank_management_system.util;

/**
 * Application-wide constants
 * DO NOT hardcode values in code - use these constants
 */
public class Constants {

    // ============ REGEX PATTERNS FOR VALIDATION ============
    public static final String PATTERN_EMAIL = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
    public static final String PATTERN_PHONE = "^[6-9]\\d{9}$";
    public static final String PATTERN_PAN = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$";
    public static final String PATTERN_AADHAAR = "^[2-9]{1}[0-9]{11}$"; // Updated: Can't start with 0 or 1
    public static final String PATTERN_PINCODE = "^[1-9][0-9]{5}$"; // Updated: Can't start with 0
    public static final String PATTERN_IFSC = "^[A-Z]{4}0[A-Z0-9]{6}$";
    public static final String PATTERN_ACCOUNT_NUMBER = "^\\d{10,16}$";
    public static final String PATTERN_NAME = "^[a-zA-Z\\s]+$"; // NEW: Only letters and spaces
    public static final String PATTERN_PASSWORD = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

    // ============ SIZE CONSTRAINTS ============
    public static final int NAME_MIN_LENGTH = 2;
    public static final int NAME_MAX_LENGTH = 50;
    public static final int EMAIL_MAX_LENGTH = 100;
    public static final int PASSWORD_MIN_LENGTH = 8;
    public static final int PASSWORD_MAX_LENGTH = 100;
    public static final int ADDRESS_MIN_LENGTH = 10;
    public static final int ADDRESS_MAX_LENGTH = 200;
    public static final int CITY_MIN_LENGTH = 2;
    public static final int CITY_MAX_LENGTH = 50;
    public static final int STATE_MIN_LENGTH = 2;
    public static final int STATE_MAX_LENGTH = 50;

    // ============ VALIDATION MESSAGES - REQUIRED FIELDS ============
    public static final String MSG_FIRST_NAME_REQUIRED = "First name is required";
    public static final String MSG_LAST_NAME_REQUIRED = "Last name is required";
    public static final String MSG_EMAIL_REQUIRED = "Email is required";
    public static final String MSG_PHONE_REQUIRED = "Phone number is required";
    public static final String MSG_DOB_REQUIRED = "Date of birth is required";
    public static final String MSG_PASSWORD_REQUIRED = "Password is required";
    public static final String MSG_ADDRESS_REQUIRED = "Address is required";
    public static final String MSG_CITY_REQUIRED = "City is required";
    public static final String MSG_STATE_REQUIRED = "State is required";
    public static final String MSG_PINCODE_REQUIRED = "PIN code is required";
    public static final String MSG_PAN_REQUIRED = "PAN number is required";
    public static final String MSG_AADHAAR_REQUIRED = "Aadhaar number is required";

    // ============ VALIDATION MESSAGES - FORMAT ERRORS ============
    public static final String MSG_NAME_INVALID = "Name should contain only letters";
    public static final String MSG_EMAIL_INVALID = "Invalid email format";
    public static final String MSG_PHONE_INVALID = "Invalid Indian phone number. Must be 10 digits starting with 6-9";
    public static final String MSG_DOB_INVALID = "Date of birth must be in the past";
    public static final String MSG_PASSWORD_INVALID = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
    public static final String MSG_PINCODE_INVALID = "Invalid PIN code. Must be 6 digits and cannot start with 0";
    public static final String MSG_PAN_INVALID = "Invalid PAN format. Example: ABCDE1234F";
    public static final String MSG_AADHAAR_INVALID = "Invalid Aadhaar number. Must be 12 digits and cannot start with 0 or 1";

    // ============ VALIDATION MESSAGES - SIZE ERRORS ============
    public static final String MSG_NAME_SIZE = "Name must be between 2 and 50 characters";
    public static final String MSG_EMAIL_SIZE = "Email must not exceed 100 characters";
    public static final String MSG_PASSWORD_SIZE = "Password must be at least 8 characters";
    public static final String MSG_ADDRESS_SIZE = "Address must be between 10 and 200 characters";
    public static final String MSG_CITY_SIZE = "City must be between 2 and 50 characters";
    public static final String MSG_STATE_SIZE = "State must be between 2 and 50 characters";

    // ============ ACCOUNT NUMBER FORMAT ============
    public static final String ACCOUNT_NUMBER_PREFIX = "ACC";
    public static final int ACCOUNT_NUMBER_LENGTH = 16;

    // ============ TRANSACTION REFERENCE FORMAT ============
    public static final String TRANSACTION_REF_PREFIX = "TXN";
    public static final int TRANSACTION_REF_LENGTH = 20;

    // ============ CUSTOMER ID FORMAT ============
    public static final String CUSTOMER_ID_PREFIX = "CUST";
    public static final int CUSTOMER_ID_LENGTH = 14;

    // ============ BALANCE LIMITS ============
    public static final String DEFAULT_SAVINGS_MIN_BALANCE = "10000.00";
    public static final String DEFAULT_CURRENT_MIN_BALANCE = "100000.00";
    public static final String MAX_ACCOUNT_BALANCE = "10000000.00"; // 1 Crore

    // ============ TRANSACTION LIMITS ============
    public static final String DEFAULT_DAILY_WITHDRAWAL_LIMIT = "50000.00";
    public static final String DEFAULT_DAILY_TRANSFER_LIMIT = "100000.00";
    public static final int MAX_WITHDRAWALS_PER_MONTH = 5; // For savings

    // ============ INTEREST RATES ============
    public static final String DEFAULT_SAVINGS_INTEREST_RATE = "3.5";
    public static final String DEFAULT_OVERDRAFT_INTEREST_RATE = "12.0";

    // ============ AGE REQUIREMENTS ============
    public static final int MINIMUM_AGE = 18;
    public static final int MAXIMUM_AGE = 100;

    // ============ JWT SETTINGS (Phase 2) ============
//    public static final long JWT_EXPIRATION = 86400000L; // 24 hours in milliseconds

    // ============ OTP SETTINGS (Future) ============
    public static final int OTP_LENGTH = 6;
    public static final int OTP_EXPIRY_MINUTES = 10;

    // ============ FILE UPLOAD SETTINGS ============
    public static final long MAX_FILE_SIZE = 5242880L; // 5MB
    public static final String[] ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/jpg"};
    public static final String[] ALLOWED_DOCUMENT_TYPES = {"application/pdf", "image/jpeg", "image/png"};

    // ============ ERROR MESSAGES ============
    public static final String ERROR_USER_NOT_FOUND = "User not found";
    public static final String ERROR_ACCOUNT_NOT_FOUND = "Account not found";
    public static final String ERROR_INSUFFICIENT_BALANCE = "Insufficient balance";
    public static final String ERROR_INVALID_CREDENTIALS = "Invalid email or password";
    public static final String ERROR_EMAIL_ALREADY_EXISTS = "Email already registered";
    public static final String ERROR_PHONE_ALREADY_EXISTS = "Phone number already registered";
    public static final String ERROR_PAN_ALREADY_EXISTS = "PAN already registered";
    public static final String ERROR_AADHAAR_ALREADY_EXISTS = "Aadhaar already registered"; // NEW
    public static final String ERROR_ACCOUNT_FROZEN = "Account is frozen";
    public static final String ERROR_ACCOUNT_CLOSED = "Account is closed";
    public static final String ERROR_DAILY_LIMIT_EXCEEDED = "Daily transaction limit exceeded";
    public static final String ERROR_MINIMUM_AGE = "Must be at least 18 years old";

    // ============ SUCCESS MESSAGES ============
    public static final String SUCCESS_USER_REGISTERED = "User registered successfully";
    public static final String SUCCESS_LOGIN = "Login successful";
    public static final String SUCCESS_ACCOUNT_CREATED = "Account created successfully";
    public static final String SUCCESS_TRANSACTION_COMPLETED = "Transaction completed successfully";
    public static final String SUCCESS_KYC_SUBMITTED = "KYC documents submitted successfully";

    // Branch Messages
    public static final String SUCCESS_BRANCHES_RETRIEVED = "Branches retrieved successfully";
    public static final String SUCCESS_BRANCH_FOUND = "Branch found";
    public static final String SUCCESS_BRANCHES_FOUND = "Branches found";
    public static final String ERROR_BRANCH_NOT_FOUND = "Branch not found";

    // Private constructor to prevent instantiation
    private Constants() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    // JWT Settings
//    public static final String JWT_SECRET = "your-256-bit-secret";

    // Messages
    public static final String ERROR_ACCOUNT_LOCKED = "Account is locked due to multiple failed login attempts";
    public static final String ERROR_ACCOUNT_INACTIVE = "Account is inactive. Please contact support";
    public static final int MAX_FAILED_LOGIN_ATTEMPTS = 5;

}