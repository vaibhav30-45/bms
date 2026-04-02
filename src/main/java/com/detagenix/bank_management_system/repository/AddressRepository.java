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
	
    List<Address> findByUserUserId(Long userId);
	boolean existsByUserUserId(Long userId);
}