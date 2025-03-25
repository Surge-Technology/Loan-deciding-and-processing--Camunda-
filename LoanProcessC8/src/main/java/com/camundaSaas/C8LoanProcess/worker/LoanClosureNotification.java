package com.camundaSaas.C8LoanProcess.worker;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.camundaSaas.C8LoanProcess.Repository.LoanApplicantRepository;
import com.camundaSaas.C8LoanProcess.model.LoanApplicantDetails;
import com.camundaSaas.C8LoanProcess.service.EmailService;

import io.camunda.zeebe.client.ZeebeClient;
import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.client.api.worker.JobClient;
import io.camunda.zeebe.spring.client.annotation.ZeebeWorker;

@Service
@SpringBootApplication
@Component
public class LoanClosureNotification {

    @Autowired
    private LoanApplicantRepository loanApplicantRepository;

    @Autowired
    private ZeebeClient zeebeClient;
    
    @Autowired
    private EmailService emailService;

    private static final String MANAGER_EMAIL = "shaukatmakandar786@gmail.com";

    @ZeebeWorker(name = "ClosureNotification", type = "ClosureNotification")
    public void checkAndSendEmail(final JobClient client, final ActivatedJob job) {
        List<LoanApplicantDetails> applicants = loanApplicantRepository.findByBalanceAmountAndLoanStatusNot(0L, "Closed");

        if (!applicants.isEmpty()) {
            System.out.println("Applicants Data+++++++++++" + applicants);

            String from = "shaukatmakandar786@gmail.com";
            
            // Use StringBuilder for appending dynamic content
            StringBuilder emailContent = new StringBuilder();
            emailContent.append("Need to start closure process for the following loan accounts:\n\n");
            
            // Loop through applicants and append loan account numbers to email body
            for (LoanApplicantDetails applicant : applicants) {
                emailContent.append("Loan Account Number: ").append(applicant.getLoanAccountNumber()).append("\n");
            }

            // Debug: print out the email content
            System.out.println("Mail Sending...");
            System.out.println(emailContent.toString());  // Print the email content to verify
            
            // Send the email
            emailService.sendSimpleEmail(from, MANAGER_EMAIL, emailContent.toString());
            System.out.println("Mail sent...");
        }

        // Complete the job
        zeebeClient.newCompleteCommand(job.getKey()).variables("").send().join();
    }
}
