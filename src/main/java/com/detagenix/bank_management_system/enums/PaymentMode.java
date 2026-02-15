package com.detagenix.bank_management_system.enums;

/**
 * Payment methods/modes
 */
public enum PaymentMode {
    CASH,               // Cash deposit/withdrawal
    UPI,                // UPI payment
    NEFT,               // National Electronic Funds Transfer
    RTGS,               // Real Time Gross Settlement
    IMPS,               // Immediate Payment Service
    DEBIT_CARD,         // Debit card transaction
    CREDIT_CARD,        // Credit card transaction
    NET_BANKING,        // Internet banking
    CHEQUE,             // Cheque payment
    DD                  // Demand Draft
}