package com.surge.loanManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.surge.loanManagement.model.LoanDetails;
import com.surge.loanManagement.service.LoanService;

@RestController
public class LoanController {

	@Autowired
	LoanService loanService;

	@PostMapping("/createLoan")
	public ResponseEntity<LoanDetails> createLoan(@RequestBody LoanDetails loanDetails) {
		LoanDetails createdLoan = loanService.createLoan(loanDetails);
		return ResponseEntity.ok(createdLoan);
	}

	@GetMapping("/getAllLoans")
	public ResponseEntity<List<LoanDetails>> getAllLoans() {
		List<LoanDetails> loans = loanService.getAllLoans();
		return ResponseEntity.ok(loans);
	}

	@GetMapping("/getLoanById/{loanId}")
	public ResponseEntity<LoanDetails> getLoanById(@PathVariable long loanId) {
		LoanDetails loan = loanService.getLoanById(loanId);
		return ResponseEntity.ok(loan);
	}

	// Update LoanDetails by ID
	@PutMapping("/updateLoan/{loanId}")
	public ResponseEntity<LoanDetails> updateLoan(@PathVariable long loanId, @RequestBody LoanDetails loanDetails) {
		LoanDetails updatedLoan = loanService.updateLoan(loanId, loanDetails);
		return ResponseEntity.ok(updatedLoan);
	}

	@DeleteMapping("/deleteLoan/{loanId}")
	public ResponseEntity<Void> deleteLoan(@PathVariable long loanId) {
		loanService.deleteLoan(loanId);
		return ResponseEntity.noContent().build();
	}
}
