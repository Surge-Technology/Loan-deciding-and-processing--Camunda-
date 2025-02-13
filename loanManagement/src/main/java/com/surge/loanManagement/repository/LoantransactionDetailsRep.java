package com.surge.loanManagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
 
import com.surge.loanManagement.model.LoantransactionDetails;
 
@Repository
public interface LoantransactionDetailsRep  extends JpaRepository<LoantransactionDetails, Long>{
	
	//List<LoantransactionDetails> findByLoanAccountNumber(String loanAccountNumber);
	 @Query("SELECT l.loanAccountNumber AS loanAccountNumber, l.balanceAmount AS balanceAmount FROM LoantransactionDetails l")
	    List<LoantransactionDetails> findAllLoanAccountNumbersAndBalance();
 
}