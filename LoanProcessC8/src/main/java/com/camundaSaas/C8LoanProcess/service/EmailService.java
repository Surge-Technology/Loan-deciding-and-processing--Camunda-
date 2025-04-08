package com.camundaSaas.C8LoanProcess.service;


import com.camundaSaas.C8LoanProcess.model.LoanTransactionDetails;
import com.camundaSaas.C8LoanProcess.model.RepaymentSchedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private RepaymentScheduleService repaymentScheduleService;

    @Autowired
    private LoanTransactionDetailsService transactionDetailsService;

    @Value("${customer.email}")
    private String customerEmail;

    @Value("${bank.email}")
    private String fromEmail;

    public void sendSimpleEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(customerEmail);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom(fromEmail);

        mailSender.send(message);
    }

    public void sendEmailWithPdfAttachment(String to, String subject, String body, List<RepaymentSchedule> schedules)
            throws MessagingException, IOException {

        // Generate PDF
        byte[] pdfBytes = repaymentScheduleService.generatePdf(schedules);

        // Create an email message
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(customerEmail);
        helper.setSubject(subject);
        helper.setText(body, true); // 'true' enables HTML content
        helper.setFrom(fromEmail);

        // Attach the PDF
        helper.addAttachment("Repayment_Schedule.pdf", () -> new ByteArrayInputStream(pdfBytes));

        // Send the email
        mailSender.send(message);
    }

    public void sendEmailWithRepaymentPdfAttachment(String to, String subject, String body, List<RepaymentSchedule> schedules, byte[] pdfBytes)
            throws MessagingException, IOException {


        // Create an email message
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(customerEmail);
        helper.setSubject(subject);
        helper.setText(body, true); // 'true' enables HTML content
        helper.setFrom(fromEmail);

        // Attach the PDF
        helper.addAttachment("Repayment_Schedule.pdf", () -> new ByteArrayInputStream(pdfBytes));

        // Send the email
        mailSender.send(message);
    }

    public void sendLoanClosureEmailWithAttachment(String to, String subject, String body, List<LoanTransactionDetails> loanTransactionDetails)
            throws MessagingException, IOException {

        // Generate PDF
        byte[] pdfBytes = transactionDetailsService.generateTransactionPdf(loanTransactionDetails);

        // Create an email message
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(customerEmail);
        helper.setSubject(subject);
        helper.setText(body, true); // 'true' enables HTML content
        helper.setFrom(fromEmail);

        // Attach the PDF
        helper.addAttachment("Repayment_Schedule.pdf", () -> new ByteArrayInputStream(pdfBytes));

        // Send the email
        mailSender.send(message);
    }

    public void sendPaymentConfirmationEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(customerEmail);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom(fromEmail);

        mailSender.send(message);
        System.out.println("Confirmation mail has been sent...!");
    }

    public void sendAutoPayFailure(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(customerEmail);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom(fromEmail);

        mailSender.send(message);
        System.out.println("AutoPay Failure mail has been sent...!");
    }

    public void sendTransactionEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(customerEmail);
            helper.setSubject(subject);
            helper.setText(body, true);  // 'true' indicates HTML content

            mailSender.send(message);
            System.out.println("Email sent successfully to " + to);
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendLoanDecisionEmail(String status) {
        String subject = "Loan Decision Notification - " + status;

        String decisionMessage;

        switch (status.toUpperCase()) {
            case "APPROVED":
                decisionMessage = "The borrower's loan has been approved.";
                break;
            case "REJECTED":
                decisionMessage = "The borrower's loan has been rejected.";
                break;
            case "MODIFY":
                decisionMessage = "The borrower is requesting modifications to the loan terms.";
                break;
            default:
                decisionMessage = "Unknown loan status. Please check the details.";
        }

        String body = "Dear Banker,\n\n"
                + decisionMessage + "\n\n"
                + "Please review the details and take the necessary action.\n\n"
                + "Best Regards,\nLoan Management Team";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(fromEmail);  // Replace with actual banker email
        message.setSubject(subject);
        message.setText(body);
        message.setFrom(customerEmail);  // Replace with your sender email

        mailSender.send(message);
        System.out.println("Loan decision email sent to banker.");
    }

    public void sendModificationAcceptedEmail() {
        String subject = "Loan Modification Accepted - Review and Accept";

        String body = "Dear Borrower,\n\n"
                + "Your requested modifications to the loan terms have been accepted by the manager.\n\n"
                + "Please review the updated terms and proceed with acceptance at your earliest convenience.\n\n"
                + "Best Regards,\nLoan Management Team";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(customerEmail);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom(fromEmail);  // Replace with your sender email

        mailSender.send(message);
        System.out.println("Loan modification acceptance email sent to borrower.");
    }

    public void sendFinalLoanAcceptanceEmail() {
        String subject = "Final Loan Acceptance Notification";

        String body = "Dear Banker,\n\n"
                + "The borrower has reviewed the final loan terms and conditions and has accepted them.\n\n"
                + "Please proceed with the next steps in the loan process.\n\n"
                + "Best Regards,\nLoan Management Team";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(fromEmail);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom(fromEmail);  // Replace with your sender email

        mailSender.send(message);
        System.out.println("Final loan acceptance email sent to banker.");
    }

}