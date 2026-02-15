package com.detagenix.bank_management_system.enums;

/**
 * Account operational status
 */
public enum AccountStatus {
    ACTIVE,             // Account is operational
    FROZEN,             // Temporarily frozen, no transactions
    CLOSED,             // Permanently closed
    DORMANT,            // Inactive for long period
    PENDING_APPROVAL    // Awaiting admin approval
}