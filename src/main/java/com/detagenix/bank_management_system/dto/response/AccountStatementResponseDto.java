package com.detagenix.bank_management_system.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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
public class AccountStatementResponseDto {


    private LocalDate fromDate;
    private LocalDate toDate;
    private List<TransactionLineItem> transactions;
    
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionLineItem {
        private LocalDateTime date;
        private Long transactionId;
        private TransactionType type;
        private PaymentMode paymentMode;
        private BigDecimal amount;
        private TransactionStatus status;
        private BigDecimal balanceAfter;
    }
}
