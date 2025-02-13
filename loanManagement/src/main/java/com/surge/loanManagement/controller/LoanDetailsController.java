package com.surge.loanManagement.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.surge.loanManagement.model.Loan;
import com.surge.loanManagement.service.LoanDetailsService;

public class LoanDetailsController {


    @Autowired
    private LoanDetailsService loanDetailsService;

    @PostMapping("/createLoanDetails")
    public Loan createLoan(@RequestBody Loan loan) {
        return loanDetailsService.saveLoan(loan);
    }

    @GetMapping("/fetchAll")
    public List<Loan> getAllLoans() {
        return loanDetailsService.getAllLoans();
    }

    @GetMapping("/{id}")
    public Optional<Loan> getLoanById(@PathVariable Long id) {
        return loanDetailsService.getLoanById(id);
    }
}