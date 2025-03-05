package com.camundaSaas.C8LoanProcess.service;

import java.util.List;
import java.util.Optional;

import com.camundaSaas.C8LoanProcess.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.camundaSaas.C8LoanProcess.Repository.LoanDetailsRepository;
import com.camundaSaas.C8LoanProcess.model.Loan;


@Service
public class LoanDetailsService {

    @Autowired
    private LoanDetailsRepository loanDetailsRepository;

    public Loan saveLoan(Loan loan) {
        return loanDetailsRepository.save(loan);
    }

    public List<Loan> getAllLoans() {
        return loanDetailsRepository.findAll();
    }

    public Optional<Loan> getLoanById(Long id) {
        return loanDetailsRepository.findById(id);
    }

    public Loan getLoanByAccountNumber(String loanAccountNumber) {

        return loanDetailsRepository.findByLoanAccountNumber(loanAccountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found for account number: " + loanAccountNumber));
    }
}