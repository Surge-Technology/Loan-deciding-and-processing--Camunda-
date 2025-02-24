package com.camundaSaas.C8LoanProcess.worker;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
