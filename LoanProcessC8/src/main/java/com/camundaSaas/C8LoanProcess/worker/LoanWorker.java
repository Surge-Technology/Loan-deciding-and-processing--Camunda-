package com.camundaSaas.C8LoanProcess.worker;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.camundaSaas.C8LoanProcess.model.RepaymentSchedule;
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

	@ZeebeWorker(name = "Persist Customer Information", type = "collection")
	public void handlePersistCustomerInformation(final JobClient client, final ActivatedJob job) {
		List<String> users = Arrays.asList("UnderWriter", "LegalApprover");

		Map<String, Object> variables = new HashMap<>();
		variables.put("assigneeList", users);
		client.newCompleteCommand(job.getKey()).variables(variables).send().join();
	}
	
	@ZeebeWorker(name = "ApprovalNotification", type = "ApprovalNotification")
	public void approvalNotification(final JobClient client, final ActivatedJob job) {
	    System.out.println("Approval Notification");
 
	    Map<String, Object> variableasmap = job.getVariablesAsMap();
 
	        String url1 = "http://localhost:8080/emailSenderApproval";
 
	        // Setting headers
	        HttpHeaders headers = new HttpHeaders();
	        headers.setContentType(MediaType.APPLICATION_JSON);
 
	        // If you need to send emailId, pass it as a request body
	        Map<String, String> requestBody = new HashMap<>();
	        requestBody.put("emailId", "balamanchari@gmail.com"); // Replace with actual emailId from variables
 
	        // Build request entity
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

//				int month=4;
//				Integer installmentNo=1;
//				Double closingPrincipal=40000.0;
//				for(int i=0; i<5 ; i++){
//
//					RepaymentSchedule repaymentSchedule=new RepaymentSchedule();
//					LocalDate date = LocalDate.of(2024, month, 11);
//					repaymentSchedule.setInstallmentNo(installmentNo);
//					repaymentSchedule.setInstallmentDate(date);
//					repaymentSchedule.setInstallmentAmount(10000.0);
//					repaymentSchedule.setPrincipal(500000.0);
//					repaymentSchedule.setInterest(500.0);
//					repaymentSchedule.setClosingPrincipal(closingPrincipal);
//					repaymentSchedule.setLoanAccountNumber(loanAccountNumber);
//
//					System.out.println("repaymentSchedule : "+repaymentSchedule);
//					String apiUrl1 = "http://localhost:8080/repaymentSchedule/save";
//					HttpHeaders headers1 = new HttpHeaders();
//					headers.setContentType(MediaType.APPLICATION_JSON);
//					HttpEntity<RepaymentSchedule> entity1 = new HttpEntity<>(repaymentSchedule, headers);
//
//					ResponseEntity<Map> mapResponseEntity = restTemplate.postForEntity(apiUrl1, entity1, Map.class);
//					Map body = mapResponseEntity.getBody();
//
//					month += 1;
//					installmentNo += 1;
//					closingPrincipal=closingPrincipal-10000.0;
//
//					if(body!=null){
//						System.out.println("RepaymentSchedule has been saved");
//					}
//				}

				int month = 4;
				Integer installmentNo = 1;
				Double loanAmount = 50000.0; // Total Loan Amount
				Double installmentAmount = 10000.0; // Fixed Installment Amount
				Double annualInterestRate = 11.45; // Annual Interest Rate
				Double monthlyInterestRate = annualInterestRate / (100 * 12); // Convert to Monthly Interest Rate
				Double closingPrincipal = loanAmount;

				for (int i = 0; i < 6; i++) {
					RepaymentSchedule repaymentSchedule = new RepaymentSchedule();

					// Set Installment Date
					LocalDate date = LocalDate.of(2024, month, 11);
					repaymentSchedule.setInstallmentNo(installmentNo);
					repaymentSchedule.setInstallmentDate(date);
					repaymentSchedule.setInstallmentAmount(installmentAmount);

					// Calculate Interest on Remaining Balance
					Double interest = closingPrincipal * monthlyInterestRate;
					repaymentSchedule.setInterest(interest);

					// Calculate Principal as Installment Amount - Interest
					Double principal = installmentAmount - interest;
					if (principal < 0) {
						principal = 0.0; // Avoid negative principal
					}
					repaymentSchedule.setPrincipal(principal);

					// Update Closing Principal
					closingPrincipal -= principal;
					if (closingPrincipal < 0) {
						closingPrincipal = 0.0; // Ensure no negative balance
					}
					repaymentSchedule.setClosingPrincipal(closingPrincipal);

					repaymentSchedule.setLoanAccountNumber(loanAccountNumber);

					System.out.println("RepaymentSchedule : " + repaymentSchedule);

					// API Call
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
