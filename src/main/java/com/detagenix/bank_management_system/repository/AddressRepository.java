package com.detagenix.bank_management_system.repository;

import com.detagenix.bank_management_system.entity.Address;
import com.detagenix.bank_management_system.entity.UserEntity;
import com.detagenix.bank_management_system.enums.AddressType;
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
    Optional<Address> findByUserAndAddressType(UserEntity user, AddressType addressType);

    /**
     * Find primary address (PERMANENT) for a user
     * Useful shorthand for getting permanent address
     */
    default Optional<Address> findPrimaryAddress(UserEntity user) {
        return findByUserAndAddressType(user, AddressType.PERMANENT);
    }
}