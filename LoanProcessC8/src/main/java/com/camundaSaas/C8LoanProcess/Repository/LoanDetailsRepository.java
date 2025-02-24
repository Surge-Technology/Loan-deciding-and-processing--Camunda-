package com.camundaSaas.C8LoanProcess.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.camundaSaas.C8LoanProcess.model.Loan;


@Repository
public interface LoanDetailsRepository extends JpaRepository<Loan, Long> {

	Loan findByLoanAccountNumber(String loanAccountNumber);
}
