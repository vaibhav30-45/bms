package com.detagenix.bank_management_system.enums;

/**
 * Transaction processing status
 */
public enum TransactionStatus {
    PENDING,            // Transaction initiated, processing
    SUCCESS,            // Transaction completed successfully
    FAILED,             // Transaction failed
    CANCELLED,          // Transaction cancelled by user
    REVERSED            // Transaction reversed/refunded
}