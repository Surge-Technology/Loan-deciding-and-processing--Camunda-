package com.camundaSaas.C8LoanProcess.worker;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
 
import com.camundaSaas.C8LoanProcess.Repository.LoanTransactionDetailsRepository;
import com.camundaSaas.C8LoanProcess.model.LoanTransactionDetails;
import com.camundaSaas.C8LoanProcess.service.EmailService;
import com.camundaSaas.C8LoanProcess.service.LoanTransactionDetailsService;
 
import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.client.api.worker.JobClient;
import io.camunda.zeebe.spring.client.annotation.ZeebeWorker;
 
@Service
@Component
@SpringBootApplication
public class PaymentWorker {
 
	private static final int MAX_RETRIES = 3;
 
	@Autowired
	EmailService emailService;
 
	@Autowired
	LoanTransactionDetailsService loanTransactionDetailsService;
 
	private RestTemplate restTemplate;
 
	@Autowired
	LoanTransactionDetailsRepository loanTransactionDetailsRepository;
 
	@ZeebeWorker(name = "Payment", type = "Payment")
	public void processPayment(final JobClient jobClient, final ActivatedJob job) {
		Map<String, Object> variables = job.getVariablesAsMap();
		String paymentStatus = (String) variables.get("paymentStatus");
		int retriesLeft = job.getRetries();
 
		try {
			System.out.println("Processing payment... Status: " + paymentStatus);
 
			if ("failure".equalsIgnoreCase(paymentStatus)) {
				throw new RuntimeException("Simulated Payment Failure");
			}
 
			System.out.println("Payment Successful");
			jobClient.newCompleteCommand(job.getKey()).send().join();
 
		} catch (Exception e) {
			if (retriesLeft > 1) {
				System.out.println("Payment failed, retrying... Attempts left: " + (retriesLeft - 1));
				jobClient.newFailCommand(job.getKey()).retries(retriesLeft - 1).errorMessage(e.getMessage()).send()
						.join();
			} else {
				System.out.println("Max retries reached. Sending to failure flow...");
				jobClient.newThrowErrorCommand(job.getKey()).errorCode("404").send().join();
			}
		}
	}
 
	@ZeebeWorker(name = "Notify payment successful - Borrower", type = "Notify payment successful - Borrower")
	public void paymentSuccessful(final JobClient jobClient, final ActivatedJob job) {
 
		sendSuccessNotification();
		jobClient.newCompleteCommand(job.getKey()).send().join();
	}
 
	private void sendSuccessNotification() {
 
		String to = "balamanchari@gmail.com";
		String from = "balamanchari@gmail.com";
		String body = "Your payment was processed successfully.";
		emailService.sendSimpleEmail(to, from, body);
 
	}
 
	@ZeebeWorker(name = "Notify payment failed - Banker", type = "Notify payment failed - Banker")
	public void paymentFailure(final JobClient jobClient, final ActivatedJob job) {
 
		sendFailureNotification();
		jobClient.newCompleteCommand(job.getKey()).send().join();
	}
 
	private void sendFailureNotification() {
 
		String to = "balamanchari@gmail.com";
		String from = "balamanchari@gmail.com";
		String body = "Your payment was processed successfully.";
		emailService.sendSimpleEmail(to, from, body);
 
	}
 
//	@ZeebeWorker(name = "Persist Transaction Information", type = "Persist Transaction Information")
//	public void persistTransaction(final JobClient jobClient, final ActivatedJob job) {
//		Map<String, Object> variables = job.getVariablesAsMap();
//
//		String url1 = "http://localhost:8080/loanTransaction/save";
//
//		HttpHeaders headers = new HttpHeaders();
//		headers.setContentType(MediaType.APPLICATION_JSON);
//
//		Map<String, String> requestBody = new HashMap<>();
//
//		HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
//
//		ResponseEntity<String> response1 = restTemplate.postForEntity(url1, request, String.class);
//
//		System.out.println("Response: " + response1.getBody());
//
//		jobClient.newCompleteCommand(job.getKey()).send().join();
//
//	}
 
//	@ZeebeWorker(name = "Persist Transaction Information", type = "Persist Transaction Information")
//	public void persistTransaction(final JobClient jobClient, final ActivatedJob job) {
//	    Map<String, Object> variables = job.getVariablesAsMap();
//
//	    try {
//	        LoanTransactionDetails transaction = new LoanTransactionDetails();
//	        transaction.setLoanId(Long.valueOf(variables.get("loanId").toString()));
//	        transaction.setDate(LocalDate.now());
//	        transaction.setTransactionStatus(variables.get("paymentStatus").toString());
//	        transaction.setLoanAmount(parseLong(variables.get("loanAmount")));  
//	        transaction.setTransactionAmount(parseLong(variables.get("transactionAmount")));  
//	        transaction.setBalanceAmount(parseLong(variables.get("balanceAmount")));   
//	        transaction.setPaymentType(variables.get("paymentType").toString());
//	        transaction.setEmail(variables.get("email").toString());
//
//	        loanTransactionDetailsRepository.save(transaction);
//
//
//	        jobClient.newCompleteCommand(job.getKey()).send().join();
//
//	    } catch (Exception e) {
//	        System.err.println("Error persisting transaction: " + e.getMessage());
//
//	        jobClient.newCompleteCommand(job.getKey()).send().join();
//	    }
//	}
//	private Long parseLong(Object value) {
//	    try {
//	        return Optional.ofNullable(value)
//	                .map(Object::toString)
//	                .map(Long::valueOf)
//	                .orElse(0L);
//	    } catch (NumberFormatException e) {
//	        System.err.println("Error parsing Long: " + e.getMessage());
//	        return 0L;
//	    }
//	}
	@ZeebeWorker(name = "Persist Transaction Information", type = "Persist Transaction Information")
	public void persistTransaction(final JobClient jobClient, final ActivatedJob job) {
		Map<String, Object> variables = job.getVariablesAsMap();
 
		// ✅ Log incoming variables for debugging
		System.out.println("Received Variables: " + variables);
 
		try {
			LoanTransactionDetails transaction = new LoanTransactionDetails();
 
			// ✅ Safely retrieve variables, handling possible null values
			transaction.setLoanId(parseLong(variables.get("loanId")));
			transaction.setDate(LocalDate.now()); // Use current date
			transaction.setTransactionStatus(safeString(variables.get("paymentStatus")));
			transaction.setLoanAmount(parseLong(variables.get("loanAmount")));
			transaction.setTransactionAmount(parseLong(variables.get("transactionAmount")));
			transaction.setBalanceAmount(parseLong(variables.get("balanceAmount")));
			transaction.setPaymentType(safeString(variables.get("paymentType")));
			transaction.setEmail(safeString(variables.get("email")));
 
			// ✅ Save transaction to the database
			loanTransactionDetailsRepository.save(transaction);
 
			System.out.println("Transaction successfully persisted: " + transaction);
 
			// ✅ Complete Zeebe job
			jobClient.newCompleteCommand(job.getKey()).send().join();
 
		} catch (Exception e) {
			System.err.println("Error persisting transaction: " + e.getMessage());
 
			jobClient.newFailCommand(job.getKey()).retries(job.getRetries() - 1).errorMessage(e.getMessage()).send()
					.join();
		}
	}
 
	// ✅ Safe method to handle null and empty values for Long
	private Long parseLong(Object value) {
		try {
			return Optional.ofNullable(value).map(Object::toString).map(Long::valueOf).orElse(0L); // Default to 0L if
																									// null
		} catch (NumberFormatException e) {
			System.err.println("Error parsing Long: " + e.getMessage());
			return 0L; // Return default value to prevent crash
		}
	}
 
	// ✅ Safe method to handle null Strings
	private String safeString(Object value) {
		return Optional.ofNullable(value).map(Object::toString).orElse("N/A"); // Default value
	}
 
}
