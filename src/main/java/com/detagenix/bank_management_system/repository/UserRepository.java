package com.detagenix.bank_management_system.repository;

import com.detagenix.bank_management_system.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    // ============ DUPLICATE CHECK METHODS ============
    // These return boolean - used for validation before saving

    /**
     * Check if email already exists in database
     * Used in registration to prevent duplicate emails
     */
    boolean existsByEmail(String email);

    /**
     * Check if phone number already exists in database
     * Used in registration to prevent duplicate phone numbers
     */
    boolean existsByPhoneNumber(String phoneNumber);


    // ============ FIND METHODS ============
    // These return Optional<UserEntity> - used for login and lookups

    /**
     * Find user by email
     * Used in login functionality (Phase 2)
     */
    Optional<UserEntity> findByEmail(String email);

    /**
     * Find user by phone number
     * Used for phone-based login or lookups
     */
    Optional<UserEntity> findByPhoneNumber(String phoneNumber);

}