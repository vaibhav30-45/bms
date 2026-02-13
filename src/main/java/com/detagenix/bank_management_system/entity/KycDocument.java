package com.detagenix.bank_management_system.entities.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class KycDocument {
    @Id
    private String documentId;

    @ManyToOne
    @JoinColumn(name = "document_user_id")
    private UserEntity documentUser;
    private String documentType;
    private String documentDescription;
    private String documentCategory;
    private String documentStatus;
    private String documentNumber;
    private String documentPath;

    public String uploadDocument() {

        return "";
    }
    public String verifyDocument() {
        return "";
    }

    public String rejectDocument() {
        return "";
    }

}
