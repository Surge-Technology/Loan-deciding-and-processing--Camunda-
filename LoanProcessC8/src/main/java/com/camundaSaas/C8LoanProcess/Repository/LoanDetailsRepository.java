package com.camundaSaas.C8LoanProcess.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.camundaSaas.C8LoanProcess.model.Loan;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Repository
public interface LoanDetailsRepository extends JpaRepository<Loan, Long> {
	Optional<Loan> findByLoanAccountNumber(String loanAccountNumber);

	List<Loan> findByBillDate(LocalDate billDate);
	
 //   Optional<Loan> findByLoanAccountNumber(String loanAccountNumber);

}
