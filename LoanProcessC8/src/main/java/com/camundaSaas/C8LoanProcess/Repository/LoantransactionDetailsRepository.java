package com.camundaSaas.C8LoanProcess.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.camundaSaas.C8LoanProcess.model.LoantransactionDetails;

@Repository
public interface LoantransactionDetailsRepository  extends JpaRepository<LoantransactionDetails, Long>{
 
	    List<LoantransactionDetails> findByLoanAccountNumber(String loanAccountNumber);
}
 