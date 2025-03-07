package com.camundaSaas.C8LoanProcess.controller;

import com.camundaSaas.C8LoanProcess.model.LoanTransactionDetails;
import com.camundaSaas.C8LoanProcess.service.LoanTransactionDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class LoanTransactionDetailsController {

    @Autowired
    private LoanTransactionDetailsService loanTransactionDetailsService;

    @PostMapping("/loanTransaction/save")
    public ResponseEntity<LoanTransactionDetails> saveTransaction(@RequestBody LoanTransactionDetails loanTransactionDetails) {
        LoanTransactionDetails savedTransaction = loanTransactionDetailsService.saveLoanTransaction(loanTransactionDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTransaction);
    }

    @GetMapping("/loanTransaction/allTransactions")
    public ResponseEntity<List<LoanTransactionDetails>> getAllTransactions() {
        List<LoanTransactionDetails> transactions = loanTransactionDetailsService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/loanTransaction/loanAccountNumber/{id}")
    public ResponseEntity<List<LoanTransactionDetails>> getTransactionByLoanAccountNumber(@PathVariable String id) {
        List<LoanTransactionDetails> transaction = loanTransactionDetailsService.getTransactionByAccountLoanNumber(id);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/loanTransaction/email/{email}")
    public ResponseEntity<List<LoanTransactionDetails>> getTransactionByEmail(@PathVariable String email) {
        List<LoanTransactionDetails> transaction = loanTransactionDetailsService.getTransactionByEmail(email);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/loanTransaction/download/{loanAccountNumber}")
    public ResponseEntity<byte[]> downloadTransactionDetails(@PathVariable String loanAccountNumber) {
        List<LoanTransactionDetails> transactions = loanTransactionDetailsService.getTransactionByAccountLoanNumber(loanAccountNumber);

        if (transactions.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        byte[] pdfBytes = loanTransactionDetailsService.generateTransactionPdf(transactions);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transaction_details.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

}
