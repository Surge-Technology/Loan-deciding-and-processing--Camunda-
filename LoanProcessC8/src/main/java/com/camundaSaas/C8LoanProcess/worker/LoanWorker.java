package com.camundaSaas.C8LoanProcess.worker;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.camundaSaas.C8LoanProcess.model.RepaymentSchedule;
import com.camundaSaas.C8LoanProcess.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import io.camunda.zeebe.client.ZeebeClient;
import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.client.api.worker.JobClient;
import io.camunda.zeebe.spring.client.annotation.ZeebeWorker;

@SpringBootApplication
public class LoanWorker {

	@Autowired
	ZeebeClient zeebeClient;
	
	RestTemplate restTemplate= new RestTemplate();
	
	@Autowired
	EmailService emailService;
	
	 

	@ZeebeWorker(name = "Persist Customer Information", type = "collection")
	public void handlePersistCustomerInformation(final JobClient client, final ActivatedJob job) {
		List<String> users = Arrays.asList("UnderWriter", "LegalApprover");

		Map<String, Object> variables = new HashMap<>();
		variables.put("assigneeList", users);
		client.newCompleteCommand(job.getKey()).variables(variables).send().join();
	}
	
	
	@ZeebeWorker(name = "NotificationForUser", type = "NotificationForUser")
	public void NotificationForUser(final JobClient client, final ActivatedJob job) {


		Map<String, Object> variables = new HashMap<>();
		variables.get("assigneeList");
		
		client.newCompleteCommand(job.getKey()).variables(variables).send().join();
	}

	@ZeebeWorker(name = "ApprovalNotification", type = "ApprovalNotification")
	public void approvalNotification(final JobClient client, final ActivatedJob job) {
	    System.out.println("Approval Notification");
 
	    Map<String, Object> variableasmap = job.getVariablesAsMap();
 
	        String url1 = "http://localhost:8080/emailSenderApproval";
 
	        HttpHeaders headers = new HttpHeaders();
	        headers.setContentType(MediaType.APPLICATION_JSON);
 
	        Map<String, String> requestBody = new HashMap<>();
	       // requestBody.put("emailId", "balamanchari@gmail.com"); 
	        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
 
	        ResponseEntity<String> response1 = restTemplate.postForEntity(url1, request, String.class);
 
	        System.out.println("Response: " + response1.getBody());
	
	    zeebeClient.newCompleteCommand(job.getKey()).variables("").send().join();
	}
	
	@ZeebeWorker(name = "Reject Notification", type = "Reject Notification")
	public void rejectNotification(final JobClient client, final ActivatedJob job) {
		System.out.println("Reject Notification");
 
	    Map<String, Object> variableasmap = job.getVariablesAsMap();
 
	        String url1 = "http://localhost:8080/emailSenderRejection";
 
	        HttpHeaders headers = new HttpHeaders();
	        headers.setContentType(MediaType.APPLICATION_JSON);
 
	        Map<String, String> requestBody = new HashMap<>();
	     //   requestBody.put("emailId", "balamanchari@example.com");
 
	        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
 
	        ResponseEntity<String> response1 = restTemplate.postForEntity(url1, request, String.class);
 
	        System.out.println("Response: " + response1.getBody());
	
	    zeebeClient.newCompleteCommand(job.getKey()).variables("").send().join();
	}
 
	@ZeebeWorker(name = "Clarification Notification", type = "Clarification Notification")
	public void shipParcel(final JobClient client, final ActivatedJob job) {
	    Map<String, Object> variableasmap = job.getVariablesAsMap();
 System.out.println("clarification worker");
        String url1 = "http://localhost:8080/emailSenderClarification";
 
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
 
        Map<String, String> requestBody = new HashMap<>();
     //   requestBody.put("emailId", "balamanchari@example.com");
 
        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
 
        ResponseEntity<String> response1 = restTemplate.postForEntity(url1, request, String.class);
 
        System.out.println("Response: " + response1.getBody());
 
		zeebeClient.newCompleteCommand(job.getKey()).variables("").send().join();
	}
	
	@ZeebeWorker(name = "loan Status Update", type = "loan Status Update")
	public void LoanStatusUpdate(final JobClient client, final ActivatedJob job) {
	    Map<String, Object> variableasmap = job.getVariablesAsMap();
	    zeebeClient.newCompleteCommand(job.getKey()).variables("").send().join();
	}
	@ZeebeWorker(name = "Loan Status Update", type = "Loan Status Update")
	public void LoanStatusUpdateDisbursement(final JobClient client, final ActivatedJob job) {
	    Map<String, Object> variableasmap = job.getVariablesAsMap();
	    zeebeClient.newCompleteCommand(job.getKey()).variables("").send().join();
	}
	
	
	
	@ZeebeWorker(name = "LoanTermApprovalNotification", type = "LoanTermApprovalNotification")
	public void LoanTermApprovalNotification(final JobClient client, final ActivatedJob job) {
	    Map<String, Object> variableasmap = job.getVariablesAsMap();
	    String from = "shaukatmakandar786@gmail.com";
	    String to = "shaukatmakandar786@gmail.com";
	    String body = "Loan Term Approval Notification";
	    emailService.sendSimpleEmail(from, to, body);
	    zeebeClient.newCompleteCommand(job.getKey()).variables("").send().join();
	}
	
	
	
	@ZeebeWorker(name = "Persist Loan Details", type = "Persist Loan Details")
	public void calculateTenure(final JobClient client, final ActivatedJob job) {
	        try {
	            Map<String, Object> variables = job.getVariablesAsMap();
	          
	            String apiUrl = "http://localhost:8080/calculateTenureInterestSaveData";
	            HttpHeaders headers = new HttpHeaders();
	            headers.setContentType(MediaType.APPLICATION_JSON);
	            HttpEntity<String> entity = new HttpEntity<>(headers);
	            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);
	            Map<String, Object> responseBody = response.getBody();
				System.out.println("Loan has been saved...!");
				String loanAccountNumber = responseBody.get("loanAccountNumber").toString();
				
//				response.put("loanId", savedLoan.getLoanId());
//				response.put("loanAmount", savedLoan.getLoanAmount());
//				response.put("tenure", savedLoan.getTenure());
//				response.put("interestRate", savedLoan.getInterest());
//				response.put("uanNumber", uanNumber);
//				response.put("loanStatus", loanStatus);
//				response.put("loanAccountNumber", loanAccountNumber);
//				response.put("billDate", localDate);
				
				int month = (int) responseBody.get("tenure");
				Integer installmentNo = (Integer) responseBody.get("tenure");
				Double loanAmount = (Double) responseBody.get("loanAmount");
				Double annualInterestRate = (Double) responseBody.get("interestRate");

				Double monthlyInterestRate = annualInterestRate / (100 * 12);
				Double installmentAmount;
				if (monthlyInterestRate > 0) {
				    installmentAmount = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, month)) / 
				                        (Math.pow(1 + monthlyInterestRate, month) - 1);
				} else {
				    installmentAmount = loanAmount / month;
				}
				Double closingPrincipal = loanAmount;
				for (int i = 1; i <= installmentNo; i++) {
				    Double interestComponent = closingPrincipal * monthlyInterestRate;
				    Double principalComponent = installmentAmount - interestComponent;
				    closingPrincipal -= principalComponent;
				}
				System.out.println("Installment Amount: " + installmentAmount);
				System.out.println("Final Closing Principal: " + closingPrincipal);


				for (int i = 0; i < 6; i++) {
					RepaymentSchedule repaymentSchedule = new RepaymentSchedule();

					LocalDate date = LocalDate.of(2024, month, 11);
					repaymentSchedule.setInstallmentNo(installmentNo);
					repaymentSchedule.setInstallmentDate(date);
					repaymentSchedule.setInstallmentAmount(installmentAmount);

					// Calculate Interest on Remaining Balance (rounded to 2 decimal places)
					Double interest = Math.round(closingPrincipal * monthlyInterestRate * 100.0) / 100.0;
					repaymentSchedule.setInterest(interest);

					Double principal = installmentAmount - interest;
					principal = Math.round(principal * 100.0) / 100.0;

					if (principal > closingPrincipal) {
						principal = closingPrincipal;
						interest = installmentAmount - principal; 
					}

					repaymentSchedule.setPrincipal(principal);

					closingPrincipal -= principal;
					closingPrincipal = Math.round(closingPrincipal * 100.0) / 100.0;

					repaymentSchedule.setClosingPrincipal(closingPrincipal);

					repaymentSchedule.setLoanAccountNumber(loanAccountNumber);

					System.out.println("RepaymentSchedule : " + repaymentSchedule);

					String apiUrl1 = "http://localhost:8080/repaymentSchedule/save";
					HttpHeaders headers1 = new HttpHeaders();
					headers1.setContentType(MediaType.APPLICATION_JSON);
					HttpEntity<RepaymentSchedule> entity1 = new HttpEntity<>(repaymentSchedule, headers1);

					ResponseEntity<Map> mapResponseEntity = restTemplate.postForEntity(apiUrl1, entity1, Map.class);
					Map body = mapResponseEntity.getBody();

					// Increment for Next Installment
					month += 1;
					installmentNo += 1;

					if (body != null) {
						System.out.println("RepaymentSchedule has been saved");
					}
				}


				if (responseBody != null) {
	                client.newCompleteCommand(job.getKey())
	                        .variables(responseBody)
	                        .send()
	                        .join();
	            } else {
	                client.newCompleteCommand(job.getKey())
	                        .variables(Map.of("error", "No response from API"))
	                        .send()
	                        .join();
	            }
 
	        } catch (Exception e) {
	            e.printStackTrace();
	            client.newFailCommand(job.getKey())
	                    .retries(job.getRetries() - 1)
	                    .errorMessage("Error in Loan Status Update Worker: " + e.getMessage())
	                    .send()
	                    .join();
	        }
	    }
}
