package com.camundaSaas.C8LoanProcess.controller;

import com.camundaSaas.C8LoanProcess.model.LoanTransactionDetails;
import com.camundaSaas.C8LoanProcess.service.EmailService;
import com.camundaSaas.C8LoanProcess.service.LoanTransactionDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
public class LoanTransactionDetailsController {

    @Autowired
    private LoanTransactionDetailsService loanTransactionDetailsService;

    @Autowired
    private EmailService emailService;

    @CrossOrigin
    @PostMapping("/loanTransaction/save")
    public ResponseEntity<LoanTransactionDetails> saveTransaction(@RequestBody LoanTransactionDetails loanTransactionDetails) {
        LoanTransactionDetails savedTransaction = loanTransactionDetailsService.saveLoanTransaction(loanTransactionDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTransaction);
    }

    @CrossOrigin
    @GetMapping("/loanTransaction/allTransactions")
    public ResponseEntity<List<LoanTransactionDetails>> getAllTransactions() {
        List<LoanTransactionDetails> transactions = loanTransactionDetailsService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    @CrossOrigin
    @GetMapping("/loanTransaction/loanAccountNumber/{id}")
    public ResponseEntity<List<LoanTransactionDetails>> getTransactionByLoanAccountNumber(@PathVariable String id) {
        List<LoanTransactionDetails> transaction = loanTransactionDetailsService.getTransactionByAccountLoanNumber(id);
        return ResponseEntity.ok(transaction);
    }

    @CrossOrigin
    @GetMapping("/loanTransaction/email/{email}")
    public ResponseEntity<List<LoanTransactionDetails>> getTransactionByEmail(@PathVariable String email) {
        List<LoanTransactionDetails> transaction = loanTransactionDetailsService.getTransactionByEmail(email);
        return ResponseEntity.ok(transaction);
    }

    @CrossOrigin
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
    @CrossOrigin
    @GetMapping("/loanTransaction/sendTransactionConfirmationEmail/{loanAccountNumber}")
    public String sendTransactionConfirmationEmail(@PathVariable String loanAccountNumber) {
        List<LoanTransactionDetails> transactions =
                loanTransactionDetailsService.getTransactionByAccountLoanNumber(loanAccountNumber);

        if (transactions.isEmpty()) {
            return "No transaction details found for the given loan account number.";
        }

        String to = "makandarshaukat786@gmail.com";
        String subject = "Transaction Confirmation - Loan Account: " + loanAccountNumber;
        String downloadLink = "http://localhost:8080/loanTransaction/download/" + loanAccountNumber;

        String body = """
            <html>
            <body>
                <p>Dear Customer,</p>
                <p>We are pleased to inform you that your transaction has been successfully processed.</p>
                <p>For your reference, you can download the transaction details by clicking the link below:</p>
                <p>
                    <a href="%s" style="color: #4CAF50; font-weight: bold; text-decoration: none;">
                        ➤ Download Transaction Details (PDF)
                    </a>
                </p>
                <p>If you have any questions or concerns, please feel free to reach out to us.</p>
                <p>Best regards,</p>
                <p>Loan Processing Team<br>
                   Surge IT Technology<br>
                   📞 7769979532</p>
            </body>
            </html>
            """.formatted(downloadLink);

        emailService.sendTransactionEmail(to, subject, body);
        return "Transaction confirmation email sent successfully.";
    }

    @CrossOrigin
    @GetMapping("/loanTransaction/loanId/{id}")
    public ResponseEntity<LoanTransactionDetails> getTransactionByLoanId(@PathVariable String id) {
        LoanTransactionDetails transaction = loanTransactionDetailsService.getTransactionByLoanId(Long.valueOf(id));
        return ResponseEntity.ok(transaction);
    }


    @CrossOrigin
    @GetMapping("/loanTransaction/download/loanId/{loanId}")
    public ResponseEntity<byte[]> downloadTransactionByLoanId(@PathVariable String loanId) {
        LoanTransactionDetails transaction = loanTransactionDetailsService.getTransactionByLoanId(Long.valueOf(loanId));
        List<LoanTransactionDetails> loanTransactionDetails = Arrays.asList(transaction);

        byte[] pdfBytes = loanTransactionDetailsService.generateTransactionPdf(loanTransactionDetails);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transaction_details.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
