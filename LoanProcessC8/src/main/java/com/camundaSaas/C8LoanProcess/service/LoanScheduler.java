package com.camundaSaas.C8LoanProcess.service;


import com.camundaSaas.C8LoanProcess.Repository.LoanDetailsRepository;
import com.camundaSaas.C8LoanProcess.Repository.LoanTransactionDetailsRepository;
import com.camundaSaas.C8LoanProcess.model.Loan;
import com.camundaSaas.C8LoanProcess.model.LoanTransactionDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class LoanScheduler {

    @Autowired
    private EmailService emailService;

    @Autowired
    private LoanDetailsRepository loanDetailsRepository;
    @Value("${loan.email.scheduled.hour}")
    private int scheduledHour;

    @Value("${loan.email.scheduled.minute}")
    private int scheduledMinutes;

    @Value("${autoPayFailure}")
    private boolean isAutoPayFail;

    @Autowired
    private LoanTransactionDetailsRepository loanTransactionDetailsRepository;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @PostConstruct
    public void scheduleLoanEmails() {
        schedulePaymentReminderTask();
    }

    @Scheduled(cron = "${scheduler.loan.process.cron}")
    @Transactional
    public void paymentScheduler() {

        System.out.println("Scheduled task executed at: " + LocalDateTime.now());
        LocalDate today = LocalDate.now();
        List<Loan> loansDueToday = loanDetailsRepository.findByBillDate(today);
        if(isAutoPayFail){

            for (Loan loan : loansDueToday) {

                String to = "makandarshaukat786@gmail.com";
                String subject = "AutoPay Failure Notification - Payment Bounced";
                String body = "Dear Customer,\n\n"
                        + "We regret to inform you that your recent loan payment attempt via AutoPay has failed due to Insufficient Balance.\n\n"
                        + "Payment Details:\n"
                        // + "- Amount Attempted: " + amountAttempted + "\n"   // Uncomment and use dynamic values if available
                        // + "- Payment Date: " + paymentDate + "\n"
                        + "- Loan Account Number: " + loan.getLoanAccountNumber() + "\n\n"
                        + "To avoid any penalties or service disruptions, we kindly request you to make the payment manually at your earliest convenience.\n\n"
                        + "You can review your loan details and make a payment by visiting the following link: http://localhost:3003/#/file\n\n"
                        + "If you believe this is an error, please contact our support team immediately.\n\n"
                        + "Best Regards,\nLoan Management Team";

                emailService.sendAutoPayFailure(to, subject, body);

                String uanId= "UAN"+ UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
                LoanTransactionDetails transaction = new LoanTransactionDetails();

                transaction.setDate(LocalDate.now()); // Use current date
                transaction.setTransactionStatus("failure");
                transaction.setLoanAmount(Long.valueOf(loan.getLoanAmount()));
                transaction.setTransactionAmount(10000L);
                transaction.setBalanceAmount(Long.parseLong(loan.getLoanAmount()));
                transaction.setPaymentType("bank_transfer");
                transaction.setEmail("makandarshaukat786@gmail.com");
                transaction.setPaymentMethod("Auto Pay");
                transaction.setLoanAccountNumber(loan.getLoanAccountNumber());
                transaction.setUanId(uanId);

                loanTransactionDetailsRepository.save(transaction);
            }
        }
        else{

            for (Loan loan : loansDueToday) {

                String to = "makandarshaukat786@gmail.com";
                String subject = "Loan Payment Confirmation";
                String body = "Dear Customer,\n\n"
                        + "We are pleased to inform you that your loan payment has been successfully received.\n\n"
                        + "Payment Details:\n"
                        // + "- Amount Paid: " + amountPaid + "\n"   // Uncomment and use dynamic values if available
                        // + "- Payment Date: " + paymentDate + "\n"
                        + "- Loan Account Number: " + loan.getLoanAccountNumber() + "\n\n"
                        + "Thank you for your timely payment.\n\n"
                        + "Please check all information by visiting the following link:http://localhost:3003/#/file\n\n"
                        + "Best Regards,\nLoan Management Team";

                emailService.sendPaymentConfirmationEmail(to, subject, body);

                String uanId= "UAN"+ UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
                LoanTransactionDetails transaction = new LoanTransactionDetails();

                transaction.setDate(LocalDate.now()); // Use current date
                transaction.setTransactionStatus("success");
                transaction.setLoanAmount(Long.valueOf(loan.getLoanAmount()));
                transaction.setTransactionAmount(10000L);
                transaction.setBalanceAmount(Long.parseLong(loan.getLoanAmount()) - 10000L);
                transaction.setPaymentType("bank_transfer");
                transaction.setEmail("makandarshaukat786@gmail.com");
                transaction.setPaymentMethod("Auto Pay");
                transaction.setLoanAccountNumber(loan.getLoanAccountNumber());
                transaction.setUanId(uanId);

                loanTransactionDetailsRepository.save(transaction);
            }
        }
    }

    private void schedulePaymentReminderTask() {
        LocalDateTime now = LocalDateTime.now().minusDays(3);
        LocalDateTime nextRun = now.withHour(scheduledHour).withMinute(scheduledMinutes).withSecond(0);

        if (now.isAfter(nextRun)) {
            // If current time has passed, schedule for next day
            nextRun = nextRun.plusDays(1);
        }

        long delay = Duration.between(now, nextRun).toMillis();

        scheduler.scheduleAtFixedRate(() -> {

            LocalDate today = LocalDate.now().plusDays(3);
            List<Loan> loansDueSoon = loanDetailsRepository.findByBillDate(today);

            for (Loan loan : loansDueSoon) {
                String to = "makandarshaukat786@gmail.com"; // Fetch actual customer email
                String subject = "Upcoming Loan Payment Reminder";
                String body = "Dear Customer,\n\n"
                        + "This is a reminder that your loan payment is due on **" + loan.getBillDate() + "**.\n\n"
                        + "Payment Details:\n"
                        + "- Loan Account Number: " + loan.getLoanAccountNumber() + "\n"
                        + "- Due Date: " + loan.getBillDate() + "\n\n"
                        + "To avoid late fees, please complete your payment before the due date.\n\n";

                emailService.sendPaymentConfirmationEmail(to, subject, body);
            }

        }, delay, TimeUnit.DAYS.toMillis(1), TimeUnit.MILLISECONDS);
    }

    private void scheduleTaskForAutoPayFailure() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextRun = now.withHour(scheduledHour).withMinute(scheduledMinutes).withSecond(0);

        if (now.isAfter(nextRun)) {
            // If current time is already past the scheduled hour, schedule for next day
            nextRun = nextRun.plusDays(1);
        }

        long delay = Duration.between(now, nextRun).toMillis();

        scheduler.scheduleAtFixedRate(() -> {

            LocalDate today = LocalDate.now();
            List<Loan> loansDueToday = loanDetailsRepository.findByBillDate(today);

            for (Loan loan : loansDueToday) {

                String to = "makandarshaukat786@gmail.com";
                String subject = "AutoPay Failure Notification - Payment Bounced";
                String body = "Dear Customer,\n\n"
                        + "We regret to inform you that your recent loan payment attempt via AutoPay has failed due to a bounced transaction.\n\n"
                        + "Payment Details:\n"
                        // + "- Amount Attempted: " + amountAttempted + "\n"   // Uncomment and use dynamic values if available
                        // + "- Payment Date: " + paymentDate + "\n"
                        + "- Loan Account Number: " + loan.getLoanAccountNumber() + "\n\n"
                        + "To avoid any penalties or service disruptions, we kindly request you to make the payment manually at your earliest convenience.\n\n"
                        + "You can review your loan details and make a payment by visiting the following link: http://localhost:3003/#/file\n\n"
                        + "If you believe this is an error, please contact our support team immediately.\n\n"
                        + "Best Regards,\nLoan Management Team";

                emailService.sendAutoPayFailure(to, subject, body);
            }

        }, delay, TimeUnit.DAYS.toMillis(1), TimeUnit.MILLISECONDS);
    }

}
