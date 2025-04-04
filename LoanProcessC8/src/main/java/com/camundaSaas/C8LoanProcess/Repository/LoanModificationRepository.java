package com.camundaSaas.C8LoanProcess.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.camundaSaas.C8LoanProcess.model.LoanModification;

@Repository
public interface LoanModificationRepository extends JpaRepository<LoanModification, Long> {
	 Optional<LoanModification> findByLoanAccountNumber(String loanAccountNumber);
}