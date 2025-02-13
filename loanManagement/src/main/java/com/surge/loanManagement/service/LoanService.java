package com.surge.loanManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.LoanDetails;
import com.surge.loanManagement.repository.LoanRepository;

@Service
public class LoanService {

	@Autowired
	LoanRepository loanRepository;

	  public LoanDetails createLoan(LoanDetails loanDetails) {
	        return loanRepository.save(loanDetails);
	    }

	    public List<LoanDetails> getAllLoans() {
	        return loanRepository.findAll();
	    }

	    public LoanDetails getLoanById(long loanId) {
	        return loanRepository.findById(loanId)
	                .orElseThrow(() -> new RuntimeException("Loan not found"));
	    }

	    public LoanDetails updateLoan(long loanId, LoanDetails loanDetails) {
	        LoanDetails existingLoan = getLoanById(loanId);
	        existingLoan.setLoanType(loanDetails.getLoanType());
	        existingLoan.setLoanAmount(loanDetails.getLoanAmount());
	        existingLoan.setPriority(loanDetails.getPriority());
	        existingLoan.setCurrency(loanDetails.getCurrency());
	        existingLoan.setRepayPlan(loanDetails.getRepayPlan());
	        existingLoan.setInterestRate(loanDetails.getInterestRate());
	        existingLoan.setEmiAmount(loanDetails.getEmiAmount());
	        existingLoan.setExpectedDate(loanDetails.getExpectedDate());
	        existingLoan.setOtherComments(loanDetails.getOtherComments());
	        existingLoan.setRepayDuration(loanDetails.getRepayDuration());
	        existingLoan.setPurposeOfLoan(loanDetails.getPurposeOfLoan());
	        existingLoan.setUpdatedBy(loanDetails.getUpdatedBy());
	        existingLoan.setUpdatedOn(loanDetails.getUpdatedOn());
	        existingLoan.setUnderwriterDecision(loanDetails.getUnderwriterDecision());
	        existingLoan.setConsentOfBorrower(loanDetails.getConsentOfBorrower());
	        return loanRepository.save(existingLoan);
	    }

	    public void deleteLoan(long loanId) {
	        loanRepository.deleteById(loanId);
	    }
}
