package com.camundaSaas.C8LoanProcess.Repository;

import com.camundaSaas.C8LoanProcess.model.LoanTransactionDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanTransactionDetailsRepository extends JpaRepository<LoanTransactionDetails, Long>{
	Optional<List<LoanTransactionDetails>> findByLoanAccountNumber(String loanAccountNumber);

	Optional<List<LoanTransactionDetails>> findByEmail(String email);
}
 