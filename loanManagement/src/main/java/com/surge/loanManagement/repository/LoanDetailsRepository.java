package com.surge.loanManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.surge.loanManagement.model.Loan;

@Repository
public interface LoanDetailsRepository extends JpaRepository<Loan, Long> {

}
