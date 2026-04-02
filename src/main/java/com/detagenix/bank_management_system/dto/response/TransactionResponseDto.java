package com.detagenix.bank_management_system.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
 
import com.detagenix.bank_management_system.enums.PaymentMode;
import com.detagenix.bank_management_system.enums.TransactionStatus;
import com.detagenix.bank_management_system.enums.TransactionType;
 
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
 
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponseDto {

	private BigDecimal currentBalance;
    private String accountNumber;
 
    // Transaction details
    private Long transactionId;
    private TransactionType transactionType;
    private PaymentMode paymentMode;
    private TransactionStatus status;
    private BigDecimal amount;
 
    // Populated only for TRANSFER
    private String receiverAccountNumber;
 
    private LocalDateTime createdAt;
}
