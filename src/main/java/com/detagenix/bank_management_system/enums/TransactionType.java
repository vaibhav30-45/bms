package com.detagenix.bank_management_system.enums;

/**
 * Types of transactions
 */
public enum TransactionType {
    DEPOSIT,            // Money deposited into account
    WITHDRAWAL,         // Money withdrawn from account
    TRANSFER,           // Money transferred to another account
    INTEREST_CREDIT,    // Interest credited (for savings)
    FEE_DEBIT,          // Service fee deducted
    REVERSAL            // Transaction reversed/refunded
}