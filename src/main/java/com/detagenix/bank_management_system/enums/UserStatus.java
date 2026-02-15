package com.detagenix.bank_management_system.enums;

/**
 * User account status
 */
public enum UserStatus {
    REGISTERED,          // User registered, KYC pending
    KYC_PENDING,        // Waiting for KYC documents
    KYC_SUBMITTED,      // KYC documents submitted, awaiting verification
    KYC_VERIFIED,       // KYC verified, can create accounts
    KYC_REJECTED,       // KYC rejected, need to resubmit
    ACTIVE,             // Account fully active
    SUSPENDED,          // Temporarily suspended
    BLOCKED,            // Permanently blocked
    INACTIVE            // Deactivated by user
}