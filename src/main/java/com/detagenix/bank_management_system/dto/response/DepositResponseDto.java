package com.detagenix.bank_management_system.dto.response;


import java.math.BigDecimal;
import java.time.LocalDateTime;
 
import com.detagenix.bank_management_system.enums.PaymentMode;
import com.detagenix.bank_management_system.enums.TransactionStatus;
 
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
public class DepositResponseDto {
	 private Long transactionId;
	    private String accountNumber;
	    private BigDecimal amount;
	    private PaymentMode paymentMode;
	    private TransactionStatus status;
	    private LocalDateTime createdAt;
}
