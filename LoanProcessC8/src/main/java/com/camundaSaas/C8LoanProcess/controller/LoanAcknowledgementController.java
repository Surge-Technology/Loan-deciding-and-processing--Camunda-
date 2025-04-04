package com.camundaSaas.C8LoanProcess.controller;

import com.camundaSaas.C8LoanProcess.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/loan")
public class LoanAcknowledgementController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/decision/status/{status}")
    public ResponseEntity<String> sendLoanDecision(@PathVariable String status) {
        emailService.sendLoanDecisionEmail(status);
        return ResponseEntity.ok("Loan decision email sent successfully.");
    }

    @PostMapping("/modification-accepted")
    public ResponseEntity<String> sendModificationAccepted() {
        emailService.sendModificationAcceptedEmail();
        return ResponseEntity.ok("Modification acceptance email sent successfully.");
    }

    @PostMapping("/final-acceptance")
    public ResponseEntity<String> sendFinalLoanAcceptance() {
        emailService.sendFinalLoanAcceptanceEmail();
        return ResponseEntity.ok("Final loan acceptance email sent successfully.");
    }

}
