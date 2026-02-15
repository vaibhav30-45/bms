package com.detagenix.bank_management_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Base entity class containing common audit fields.
 * All entities should extend this class.
 */
@MappedSuperclass
@Data
public abstract class BaseEntity {

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @Column(name = "created_on", nullable = false, updatable = false)
    private LocalDateTime createdOn;

    @Column(name = "updated_on")
    private LocalDateTime updatedOn;

    /**
     * Automatically set createdOn and updatedOn before persisting
     */
    @PrePersist
    protected void onCreate() {
        this.createdOn = LocalDateTime.now();
        this.updatedOn = LocalDateTime.now();
        // TODO: Get from SecurityContext once JWT is implemented
        if (this.createdBy == null) {
            this.createdBy = "SYSTEM";
        }
    }

    /**
     * Automatically update updatedOn before updating
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedOn = LocalDateTime.now();
        // TODO: Get from SecurityContext once JWT is implemented
        if (this.updatedBy == null) {
            this.updatedBy = "SYSTEM";
        }
    }
}