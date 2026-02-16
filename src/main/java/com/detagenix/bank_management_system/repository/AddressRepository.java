package com.detagenix.bank_management_system.repository;

import com.detagenix.bank_management_system.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    /**
     * Find all addresses for a specific user
     * A user can have multiple addresses (home, office, etc.)
     */
    List<Address> findByUser_UserId(Long userId);

    /**
     * Find address by user and address type
     * Example: Find user's PERMANENT or CURRENT address
     */
    Optional<Address> findByUser_UserIdAndAddressType(Long userId, String addressType);

    /**
     * Find primary address (PERMANENT) for a user
     * Useful shorthand for getting permanent address
     */
    default Optional<Address> findPrimaryAddress(Long userId) {
        return findByUser_UserIdAndAddressType(userId, "PERMANENT");
    }
}