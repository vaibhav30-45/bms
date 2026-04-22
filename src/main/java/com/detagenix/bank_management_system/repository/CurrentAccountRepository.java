package com.detagenix.bank_management_system.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.detagenix.bank_management_system.entity.CurrentAccount;

public interface CurrentAccountRepository extends JpaRepository<CurrentAccount, Long> {

    Optional<CurrentAccount> findByAccountNumber(String accountNumber);

    List<CurrentAccount> findByUser_UserId(Long userId);

<<<<<<< Updated upstream
    long countByUser_UserId(Long userId);
=======
    long countByUser_UserId(Long userId); // ✅ for limiting to 2 accounts
>>>>>>> Stashed changes
}