package com.camundaSaas.C8LoanProcess.service;


import com.camundaSaas.C8LoanProcess.model.LoanTransactionDetails;
import com.camundaSaas.C8LoanProcess.model.RepaymentSchedule;
import org.springframework.beans.factory.annotation.Autowired;
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

    public void sendSimpleEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("balamanchari@gmail.com");

        mailSender.send(message);
    }

    public void sendEmailWithPdfAttachment(String to, String subject, String body, List<RepaymentSchedule> schedules)
            throws MessagingException, IOException {

        // Generate PDF
        byte[] pdfBytes = repaymentScheduleService.generatePdf(schedules);

        // Create an email message
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true); // 'true' enables HTML content
        helper.setFrom("shaukatmakandar786@gmail.com");

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

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true); // 'true' enables HTML content
        helper.setFrom("shaukatmakandar786@gmail.com");

        // Attach the PDF
        helper.addAttachment("Repayment_Schedule.pdf", () -> new ByteArrayInputStream(pdfBytes));

        // Send the email
        mailSender.send(message);
    }

    public void sendPaymentConfirmationEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("shaukatmakandar786@gmail.com");

        mailSender.send(message);
        System.out.println("Confirmation mail has been sent...!");
    }

    public void sendAutoPayFailure(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("shaukatmakandar786@gmail.com");

        mailSender.send(message);
        System.out.println("AutoPay Failure mail has been sent...!");
    }

    public void sendTransactionEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);  // 'true' indicates HTML content

            mailSender.send(message);
            System.out.println("Email sent successfully to " + to);
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Failed to send email: " + e.getMessage());
        }
    }

}