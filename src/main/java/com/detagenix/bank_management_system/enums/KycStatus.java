package com.detagenix.bank_management_system.enums;

/**
 * KYC document verification status
 */
public enum KycStatus {
	NOT_SUBMITTED,     // User has not uploaded any KYC documents
    PENDING,            // Not yet submitted
    SUBMITTED,          // Submitted, awaiting review
    IN_REVIEW,          // Being reviewed by admin
    VERIFIED,           // Approved
    REJECTED            // Rejected, needs resubmission
}