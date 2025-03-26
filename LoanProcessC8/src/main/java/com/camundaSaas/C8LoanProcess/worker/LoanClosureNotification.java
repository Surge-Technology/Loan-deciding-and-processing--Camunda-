package com.camundaSaas.C8LoanProcess.worker;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    private static final String MANAGER_EMAIL = "balamanchari@gmail.com";

    @ZeebeWorker(name = "ClosureNotification", type = "ClosureNotification")
    public void checkAndSendEmail(final JobClient client, final ActivatedJob job) {
        List<LoanApplicantDetails> applicants = loanApplicantRepository.findByBalanceAmountAndLoanStatusNot(0L, "Closed");

        if (!applicants.isEmpty()) {
            System.out.println("Applicants Data+++++++++++" + applicants);

            String from = "";
            
            StringBuilder emailContent = new StringBuilder();
            emailContent.append("Need to start closure process for the following loan accounts:\n\n");
           
            for (LoanApplicantDetails applicant : applicants) {
                emailContent.append("Loan Account Number: ").append(applicant.getLoanAccountNumber()).append("\n");
            }

            System.out.println("Mail Sending...");
            System.out.println(emailContent.toString()); 
            
            
            emailService.sendSimpleEmail(from, MANAGER_EMAIL, emailContent.toString());
            System.out.println("Mail sent...");
        }

        zeebeClient.newCompleteCommand(job.getKey()).variables("").send().join();
    }
    
    @ZeebeWorker(name = "LoanClosure", type = "LoanClosure")
	public void warnBeforeLegalAction(final JobClient client, final ActivatedJob job) {
		System.out.println("Loan closure process started.....");

		Map<String, Object> updatedVariables = new HashMap<>();
		updatedVariables.put("LoanClosure", true);
		
		String from = "balamanchari@gmail.com";
		String body = "Loan closure process have been completed";
		
		emailService.sendSimpleEmail(from, MANAGER_EMAIL, body);

		client.newCompleteCommand(job.getKey()).variables(updatedVariables).send().join();
		System.out.println("Loan Closure Job Completed.");
	}
}
