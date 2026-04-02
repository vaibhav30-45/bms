package com.detagenix.bank_management_system.dto.request;

import java.math.BigDecimal;

import com.detagenix.bank_management_system.enums.PaymentMode;
 
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
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
public class TransferRequestDto {
	
	@NotNull(message = "Sender account number is required")
    private Long senderAccountId;
 
    @NotNull(message = "Receiver account number is required")
    private Long receiverAccountId;
 
    @NotNull(message = "Transfer amount is required")
    @DecimalMin(value = "0.01", message = "Transfer amount must be greater than zero")
    private BigDecimal amount;
 
    @NotNull(message = "Payment mode is required")
    private PaymentMode paymentMode;

}
