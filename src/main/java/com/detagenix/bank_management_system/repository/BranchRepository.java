package com.detagenix.bank_management_system.repository;

import com.detagenix.bank_management_system.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

    List<Branch> findByCity(String city);

    List<Branch> findByState(String state);

    List<Branch> findByCityAndState(String city, String state);
}