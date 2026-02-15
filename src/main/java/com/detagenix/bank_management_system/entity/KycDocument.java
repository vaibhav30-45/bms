package com.detagenix.bank_management_system.entity;

import com.detagenix.bank_management_system.enums.KycStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "kyc_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycDocument extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity documentUser;

    @Column(nullable = false, length = 50)
    private String documentType;

    @Column(length = 500)
    private String documentDescription;

    @Column(length = 50)
    private String documentCategory;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private KycStatus documentStatus;

    @Column(length = 50)
    private String documentNumber;

    @Column(nullable = false, length = 500)
    private String documentPath;

    // Remove these methods - they belong in a Service class, not Entity
    // public String uploadDocument() { return ""; }
    // public String verifyDocument() { return ""; }
    // public String rejectDocument() { return ""; }
}