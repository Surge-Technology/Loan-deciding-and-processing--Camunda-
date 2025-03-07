package com.camundaSaas.C8LoanProcess.service;


import com.camundaSaas.C8LoanProcess.Repository.LoanDetailsRepository;
import com.camundaSaas.C8LoanProcess.model.Loan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
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
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @PostConstruct
    public void scheduleLoanEmails() {
        scheduleTask();
        schedulePaymentReminderTask();
    }

    private void scheduleTask() {
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
            }

        }, delay, TimeUnit.DAYS.toMillis(1), TimeUnit.MILLISECONDS);
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

}
