package com.camundaSaas.C8LoanProcess.worker;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.camundaSaas.C8LoanProcess.Repository.LoanTransactionDetailsRepository;
import com.camundaSaas.C8LoanProcess.model.LoanTransactionDetails;
import com.camundaSaas.C8LoanProcess.service.EmailService;

import io.camunda.zeebe.client.ZeebeClient;
import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.client.api.worker.JobClient;
import io.camunda.zeebe.spring.client.annotation.ZeebeWorker;

@Service
@Component
@SpringBootApplication
public class Worker {

	@Autowired
	ZeebeClient zeebeClient;

	@Autowired
	LoanTransactionDetailsRepository loanTransactionDetailsRepository;
	
	@Autowired
	EmailService emailService;
	
	
	
	private String to = "camerongre1@gmail.com";

	@ZeebeWorker(name = "Start Field Visit", type = "sendMessage")
	public void sendMessage(final JobClient client, final ActivatedJob job) {
		try {
			zeebeClient.newPublishMessageCommand().messageName("processContinuationMessage").correlationKey("").send()
					.join();

			client.newCompleteCommand(job.getKey()).send().join();
		} catch (Exception e) {
			System.err.println("Error sending message: " + e.getMessage());
		}
	}

	@ZeebeWorker(name = "terminate", type = "terminate")
	public void terminate(final JobClient client, final ActivatedJob job) {
		try {
			zeebeClient.newPublishMessageCommand().messageName("terminate").correlationKey("1234").send().join();

			client.newCompleteCommand(job.getKey()).send().join();
		} catch (Exception e) {
			System.err.println("Error sending message: " + e.getMessage());
		}
	}

	@ZeebeWorker(name = "NPA Process", type = "NPA Process")
	public void NPAProcess(final JobClient client, final ActivatedJob job) {
		try {
			
			String subject = "Urgent: NPA Process Initiation for Your Loan Account";
            String body = "Dear Customer,\n\n"
                        + "We would like to inform you that your loan account has been classified as a **Non-Performing Asset (NPA)** due to missed payments. "
                        + "Please make an immediate payment to avoid legal actions.\n\n"
                        + "For assistance, contact our customer service team.\n\n"
                        + "Best Regards,\nLoan Recovery Team";
            emailService.sendSimpleEmail(to, subject, body);
			
			zeebeClient.newPublishMessageCommand().messageName("NPA Process").correlationKey("").send().join();

			client.newCompleteCommand(job.getKey()).send().join();
		} catch (Exception e) {
			System.err.println("Error sending message: " + e.getMessage());
		}
	}
//Legal notice
	
	@ZeebeWorker(name = "Legal notice", type = "Legal notice")
	public void legalNotice(final JobClient client, final ActivatedJob job) {
		try {
			
			 String subject = "Legal Notice: Immediate Attention Required";
	            String body = "Dear Customer,\n\n"
	                        + "This is a formal notice regarding the overdue payments on your loan account. "
	                        + "Failure to respond may result in legal proceedings.\n\n"
	                        + "Please contact our legal team immediately to resolve this matter.\n\n"
	                        + "Sincerely,\nLegal Department";
	            
	            emailService.sendSimpleEmail(to, subject, body);
	            
			zeebeClient.newPublishMessageCommand().messageName("Legal notice").correlationKey("").send().join();

			client.newCompleteCommand(job.getKey()).send().join();
		} catch (Exception e) {
			System.err.println("Error sending message: " + e.getMessage());
		}
	}
	
	
	@ZeebeWorker(name = "Is loan paid", type = "CheckStatus")
	public void checkLoanPaymentStatus(final JobClient client, final ActivatedJob job) {
		System.out.println("Entered CheckStatus worker...");

		try {
			System.out.println("Received Job Variables: " + job.getVariables());

			Map<String, Object> variables = job.getVariablesAsMap();
			String loanAccountNumber = (String) variables.get("loanAccountNumber");

			Optional<List<LoanTransactionDetails>> loanTransactionOpt = loanTransactionDetailsRepository
					.findByLoanAccountNumber(loanAccountNumber).stream().findFirst();

			System.out.println("Fetched Loan Transaction Details: " + loanTransactionOpt);

			String status = "not paid";
			if (loanTransactionOpt.isPresent()) {
				List<LoanTransactionDetails> loanTransaction = loanTransactionOpt.get();
				Long balanceAmount = loanTransaction.get(0).getBalanceAmount();

				if (balanceAmount != null && balanceAmount == 0) {
					status = "paid";
				}
			}

			Map<String, Object> updatedVariables = new HashMap<>();
			updatedVariables.put("status", status);
			client.newCompleteCommand(job.getKey()).variables(updatedVariables).send().join();

			System.out.println("Loan Payment Status Updated: " + status);
		} catch (Exception e) {
			System.err.println("Error processing job: " + e.getMessage());
		}
	}

	@ZeebeWorker(name = "SendReminder", type = "SendReminder")
	public void sendReminder(final JobClient client, final ActivatedJob job) {

		System.out.println("Processing SendReminder Job...");

		Map<String, Object> variables = job.getVariablesAsMap();
	
		System.out.println("Sending payment reminder to: ");
		
		
		 String subject = "Friendly Reminder: Upcoming Loan Payment Due";
	        String body = "Dear Customer,\n\n"
	                    + "This is a reminder that your next loan payment is due soon. "
	                    + "Please ensure timely payment to avoid penalties.\n\n"
	                    + "Thank you for your cooperation.\n\n"
	                    + "Best Regards,\nLoan Management Team";
	        
	        emailService.sendSimpleEmail(to, subject, body);

		Map<String, Object> updatedVariables = new HashMap<>();
		updatedVariables.put("reminderSent", true);

		client.newCompleteCommand(job.getKey()).variables(updatedVariables).send().join();

		System.out.println("Reminder sent successfully");

	}

	@ZeebeWorker(name = "AutoDebit", type = "AutoDebit")
	public void processAutoDebit(final JobClient client, final ActivatedJob job) {
		System.out.println("Entered CheckStatus worker...");

		try {
			System.out.println("Received Job Variables: " + job.getVariables());

			Map<String, Object> variables = job.getVariablesAsMap();
			String loanAccountNumber = (String) variables.get("loanAccountNumber");

			Optional<List<LoanTransactionDetails>> loanTransactionOpt = loanTransactionDetailsRepository
					.findByLoanAccountNumber(loanAccountNumber).stream().findFirst();

			System.out.println("Fetched Loan Transaction Details: " + loanTransactionOpt);

			String autoDebit = "notPaid";
			if (loanTransactionOpt.isPresent()) {
				List<LoanTransactionDetails> loanTransaction = loanTransactionOpt.get();
				Long balanceAmount = loanTransaction.get(0).getBalanceAmount();

				if (balanceAmount != null && balanceAmount == 0) {
					autoDebit = "paid";
				}
			}

			Map<String, Object> updatedVariables = new HashMap<>();
			updatedVariables.put("autoDebit", autoDebit);
			client.newCompleteCommand(job.getKey()).variables(updatedVariables).send().join();

			System.out.println("Auto-Debit Process Completed ");
		} catch (Exception e) {
			System.err.println("Error processing job: " + e.getMessage());
		}
		
	}

	@ZeebeWorker(name = "Persist Transaction Details", type = "Persist Transaction Details")
	public void persistTransaction(final JobClient client, final ActivatedJob job) {
		System.out.println("Processing PersistTransactionDetails Job...");

		Map<String, Object> variables = job.getVariablesAsMap();
		String loanAccountNumber = (String) variables.get("loanAccountNumber");

		LoanTransactionDetails transaction = new LoanTransactionDetails();
		transaction.setLoanAccountNumber(loanAccountNumber);

		loanTransactionDetailsRepository.save(transaction);
		System.out.println("Transaction persisted successfully: " + transaction);

		Map<String, Object> updatedVariables = new HashMap<>();
		updatedVariables.put("transactionSaved", true);

		client.newCompleteCommand(job.getKey()).variables(updatedVariables).send().join();

		System.out.println("PersistTransactionDetails Job Completed Successfully.");
	}

	@ZeebeWorker(name = "sendFormalNotice", type = "sendFormalNotice")
	public void sendFormalNotice(final JobClient client, final ActivatedJob job) {
		System.out.println("Processing SendFormalNotice Job...");

	
		Map<String, Object> updatedVariables = new HashMap<>();
		
	    String subject = "⚠ Urgent: Formal Notice Regarding Your Overdue Loan";
	    String body = "Dear Valued Customer,\n\n"
	                + "This is a **formal notice** regarding your overdue loan payment. Despite previous reminders, the payment remains unpaid.\n\n"
	                + "To avoid additional penalties or **legal escalation**, please clear your dues **immediately**.\n\n"
	                + "If you require assistance, contact our support team at [Support Email/Phone].\n\n"
	                + "**Payment Deadline:** [Insert Due Date]\n\n"
	                + "We strongly urge you to resolve this matter at the earliest.\n\n"
	                + "Sincerely,\nLegal Affairs Team\n[Your Company Name]";
	    
	    emailService.sendSimpleEmail(to, subject, body);
	    
		updatedVariables.put("formalNoticeSent", true);

		client.newCompleteCommand(job.getKey()).variables(updatedVariables).send().join();
		System.out.println("SendFormalNotice Job Completed.");
	}
	@ZeebeWorker(name = "Inform Credit Rating Agency", type = "Inform Credit Rating Agency")
	public void informCreditAgency(final JobClient client, final ActivatedJob job) {
		System.out.println("Processing InformCreditRatingAgency Job...");

		Map<String, Object> variables = job.getVariablesAsMap();
		
		 String subject = "Credit Bureau Notification: Loan Default Status";
		    String body = "Dear Customer,\n\n"
		                + "We regret to inform you that your loan default status has been reported to the Credit Bureau. "
		                + "This may impact your credit score and future financial opportunities.\n\n"
		                + "To resolve this, please contact our support team immediately.\n\n"
		                + "Sincerely,\nCredit Compliance Team";
		    
		    emailService.sendSimpleEmail(to, subject, body);
		
		client.newCompleteCommand(job.getKey()).variables("").send().join();
		System.out.println("InformCreditRatingAgency Job Completed.");
	}

	@ZeebeWorker(name = "Offer Alternative Repayment Plans", type = "Offer Alternative Repayment Plans")
	public void offerRepaymentPlans(final JobClient client, final ActivatedJob job) {
		System.out.println("Processing OfferAlternativeRepaymentPlans Job...");

		Map<String, Object> updatedVariables = new HashMap<>();
		
		 String subject = "Exclusive Offer: Flexible Loan Repayment Plans Available";
		    String body = "Dear Customer,\n\n"
		                + "We understand financial difficulties can arise. We are offering a **flexible repayment plan** to help you manage your loan payments.\n\n"
		                + "To explore these options, please contact us at your earliest convenience.\n\n"
		                + "Best Regards,\nCustomer Support Team";
		    

		    emailService.sendSimpleEmail(to, subject, body);
		updatedVariables.put("alternativePlanOffered", true);

		client.newCompleteCommand(job.getKey()).variables(updatedVariables).send().join();
		System.out.println("OfferAlternativeRepaymentPlans Job Completed.");
	}

	@ZeebeWorker(name = "Warn Borrower Before Legal Escalations", type = "Warn Borrower Before Legal Escalations")
	public void warnBeforeLegalAction(final JobClient client, final ActivatedJob job) {
		System.out.println("Processing WarnBorrowerBeforeLegalEscalations Job...");

		Map<String, Object> updatedVariables = new HashMap<>();
		
		 String subject = "Final Warning: Immediate Payment Required";
	        String body = "Dear Customer,\n\n"
	                    + "We regret to inform you that your loan remains unpaid. This is your final warning before legal action is taken.\n\n"
	                    + "Kindly make the necessary payment immediately to avoid further consequences.\n\n"
	                    + "Sincerely,\nLegal Compliance Team";
	        
	        emailService.sendSimpleEmail(to, subject, body);
		updatedVariables.put("warningSent", true);

		client.newCompleteCommand(job.getKey()).variables(updatedVariables).send().join();
		System.out.println("WarnBorrowerBeforeLegalEscalations Job Completed.");
	}
	
	
	@ZeebeWorker(name = "IssuingLegalNotice", type = "IssuingLegalNotice")
	public void issuingLegalNotice(final JobClient client, final ActivatedJob job) {
	    System.out.println("Processing IssuingLegalNotice Job...");

	    Map<String, Object> updatedVariables = new HashMap<>();
	    
	    
	    String subject = "Final Legal Notice: Immediate Payment Required";
	    String body = "Dear Customer,\n\n"
	                + "Despite multiple reminders, we have not received your payment. This serves as a **final legal notice** before case filing.\n\n"
	                + "To avoid further legal action, please make the necessary payment or contact us urgently.\n\n"
	                + "Sincerely,\nLegal Department";
	    

	    emailService.sendSimpleEmail(to, subject, body);
	    updatedVariables.put("legalNoticeIssued", true);

	    client.newCompleteCommand(job.getKey()).variables(updatedVariables).send().join();
	    System.out.println("IssuingLegalNotice Job Completed.");
	}
	@ZeebeWorker(name = "LegalConsequenceMessage", type = "LegalConsequenceMessage")
	public void legalConsequenceMessage(final JobClient client, final ActivatedJob job) {
	    System.out.println("Processing LegalConsequenceMessage Job...");

	    Map<String, Object> updatedVariables = new HashMap<>();
	    String subject = "Important: Legal Actions May Be Taken Against Your Account";
	    String body = "Dear Customer,\n\n"
	                + "Failure to clear outstanding payments may result in **legal action**, including but not limited to court proceedings.\n\n"
	                + "We urge you to take immediate steps to resolve this matter. Contact our legal team for further assistance.\n\n"
	                + "Sincerely,\nLegal Compliance Team";
	    
	    emailService.sendSimpleEmail(to, subject, body);
	    updatedVariables.put("legalConsequenceNotified", true);

	    client.newCompleteCommand(job.getKey()).variables(updatedVariables).send().join();
	    System.out.println("LegalConsequenceMessage Job Completed.");
	}

	@ZeebeWorker(name = "LastWarning", type = "LastWarning")
	public void lastWarning(final JobClient client, final ActivatedJob job) {
	    System.out.println("Processing LastWarning Job...");

	    Map<String, Object> updatedVariables = new HashMap<>();
	    updatedVariables.put("lastWarningSent", true);

	    client.newCompleteCommand(job.getKey()).variables(updatedVariables).send().join();
	    System.out.println("LastWarning Job Completed.");
	}
	
	@ZeebeWorker(name = "CaseFiling", type = "CaseFiling")
	public void caseFiling(final JobClient client, final ActivatedJob job) {
	    System.out.println("Processing CaseFiling Job...");

	    Map<String, Object> updatedVariables = new HashMap<>();
	    updatedVariables.put("caseFiled", true);

	    client.newCompleteCommand(job.getKey()).variables(updatedVariables).send().join();
	    System.out.println("CaseFiling Job Completed.");
	}



}
