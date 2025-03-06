package com.camundaSaas.C8LoanProcess.controller;

import com.camundaSaas.C8LoanProcess.model.RepaymentSchedule;
import com.camundaSaas.C8LoanProcess.service.EmailService;
import com.camundaSaas.C8LoanProcess.service.RepaymentScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.io.IOException;
import java.util.List;

@RestController
public class RepaymentScheduleController {

    @Autowired
    private RepaymentScheduleService repaymentScheduleService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/repaymentSchedule/save")
    public ResponseEntity<RepaymentSchedule> save(@RequestBody RepaymentSchedule repaymentSchedule){

        RepaymentSchedule repaymentScheduleCreated = repaymentScheduleService.saveRepaymentSchedule(repaymentSchedule);
        return ResponseEntity.status(HttpStatus.OK).body(repaymentScheduleCreated);
    }

    @GetMapping("/repaymentSchedule/loanAccountNumber/{loanAccountNumber}")
    public ResponseEntity<List<RepaymentSchedule>> getRepaymentScheduleByLoanAccountNumber(@PathVariable String loanAccountNumber) {
        List<RepaymentSchedule> schedules = repaymentScheduleService.getRepaymentScheduleByLoanAccountNumber(loanAccountNumber);

        if (schedules.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(schedules, HttpStatus.OK);
    }
    @GetMapping("/repaymentSchedule/download/{loanAccountNumber}")
    public ResponseEntity<byte[]> downloadRepaymentSchedule(@PathVariable String loanAccountNumber) {
        List<RepaymentSchedule> schedules = repaymentScheduleService.getRepaymentScheduleByLoanAccountNumber(loanAccountNumber);

        if (schedules.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        byte[] pdfBytes = repaymentScheduleService.generatePdf(schedules);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=repayment_schedule.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/repaymentSchedule/sendEmailWithAttachment/{loanAccountNumber}")
    public String sendEmailWithPdf(@PathVariable String loanAccountNumber) {
        String to = "makandarshaukat786@gmail.com";
        String subject = "Repayment Schedule for Your Loan – Important Information";
        String body = "Dear Customer,<br><br>\n" +
                "\n" +
                "We hope this email finds you well. We are sharing the repayment schedule for your loan as part of the ongoing loan process.<br><br>\n" +
                "\n" +
                "Below are the details of your repayment schedule, including installment amounts, due dates, and outstanding principal. Please review the attached document for a detailed breakdown of your repayment obligations.<br><br>\n" +
                "\n" +
                "To ensure a smooth loan process, kindly review the schedule and let us know if you have any questions or require any clarifications.<br><br>\n" +
                "\n" +
                "You can also upload any required documents or additional information at the following link:  \n" +
                "\n" +
                "For further assistance, please feel free to contact our support team.<br><br>\n" +
                "\n" +
                "Thank you for choosing us for your financial needs.<br><br>\n" +
                "\n" +
                "Best regards,<br>  \n" +
                "Loan Processing Team<br>  \n" +
                "Surge IT Technology<br>  \n" +
                "7769979532\n";

        // Fetch repayment schedule data
        List<RepaymentSchedule> schedules = repaymentScheduleService.getRepaymentScheduleByLoanAccountNumber(loanAccountNumber);

        if (schedules.isEmpty()) {
            return "No repayment schedule found for the given loan account number.";
        }

        try {
            emailService.sendEmailWithPdfAttachment(to, subject, body, schedules);
            return "Email with PDF sent successfully.";
        } catch (MessagingException | IOException e) {
            e.printStackTrace();
            return "Error sending email: " + e.getMessage();
        }
    }

}
