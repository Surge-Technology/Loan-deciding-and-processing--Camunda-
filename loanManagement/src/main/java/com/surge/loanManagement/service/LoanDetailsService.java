package com.surge.loanManagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.Loan;
import com.surge.loanManagement.repository.LoanDetailsRepository;

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
}
