package com.detagenix.bank_management_system.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.detagenix.bank_management_system.entity.SavingsAccount;

@Repository
public interface SavingsAccountRepository extends JpaRepository<SavingsAccount, Long> {

    Optional<SavingsAccount> findByAccountNumber(String accountNumber);

    List<SavingsAccount> findByUser_UserId(Long userId);
<<<<<<< Updated upstream
    long countByUser_UserId(Long userId);
}
=======

    long countByUser_UserId(Long userId); // ✅ for limiting to 2 accounts
}
>>>>>>> Stashed changes
