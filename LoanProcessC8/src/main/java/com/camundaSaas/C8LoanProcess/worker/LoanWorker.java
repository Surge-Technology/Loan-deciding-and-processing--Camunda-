package com.camundaSaas.C8LoanProcess.worker;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.camundaSaas.C8LoanProcess.Repository.RepaymentScheduleRepository;
import com.camundaSaas.C8LoanProcess.model.LoanApplicantDetails;
import com.camundaSaas.C8LoanProcess.service.LoanApplicantService;
import com.camundaSaas.C8LoanProcess.service.LoanDetailsService;
import com.camundaSaas.C8LoanProcess.service.RepaymentScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.camundaSaas.C8LoanProcess.Repository.LoanDetailsRepository;
import com.camundaSaas.C8LoanProcess.Repository.LoanModificationRepository;
import com.camundaSaas.C8LoanProcess.model.Loan;
import com.camundaSaas.C8LoanProcess.model.LoanModification;
import com.camundaSaas.C8LoanProcess.model.RepaymentSchedule;
import com.camundaSaas.C8LoanProcess.service.EmailService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.camunda.zeebe.client.ZeebeClient;
import io.camunda.zeebe.client.api.response.ActivatedJob;
import io.camunda.zeebe.client.api.worker.JobClient;
import io.camunda.zeebe.spring.client.annotation.ZeebeWorker;

import javax.mail.MessagingException;

@SpringBootApplication
public class LoanWorker {

	@Autowired
	ZeebeClient zeebeClient;

	RestTemplate restTemplate = new RestTemplate();

	@Autowired
	EmailService emailService;

	@Autowired
	LoanDetailsRepository loanDetailsRepository;

	@Autowired
	LoanModificationRepository loanModificationRepository;

	@Autowired
	private RepaymentScheduleRepository repaymentScheduleRepository;
	@Autowired
	private RepaymentScheduleService repaymentScheduleService;
	@Autowired
	private LoanApplicantService loanApplicantService;
	
	@Autowired
	private LoanDetailsService loanDetailsService;

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
		// requestBody.put("emailId", "balamanchari@example.com");

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
		// requestBody.put("emailId", "balamanchari@example.com");

		HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

		ResponseEntity<String> response1 = restTemplate.postForEntity(url1, request, String.class);

		System.out.println("Response: " + response1.getBody());

		zeebeClient.newCompleteCommand(job.getKey()).variables("").send().join();
	}

	@ZeebeWorker(name = "loan Status Update", type = "loan Status Update")
	public void LoanStatusUpdate(final JobClient client, final ActivatedJob job) {
//		Map<String, Object> variableasmap = job.getVariablesAsMap();
//		zeebeClient.newCompleteCommand(job.getKey()).variables("").send().join();

		try {
			Map<String, Object> variables = job.getVariablesAsMap();

			String apiUrl = "http://localhost:8080/calculateTenureInterestSaveData";
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			HttpEntity<String> entity = new HttpEntity<>(headers);
			ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);
			Map<String, Object> responseBody = response.getBody();
			System.out.println("Loan has been saved...!");
//			String loanAccountNumber = responseBody.get("loanAccountNumber").toString();

//				response.put("loanId", savedLoan.getLoanId());
//				response.put("loanAmount", savedLoan.getLoanAmount());
//				response.put("tenure", savedLoan.getTenure());
//				response.put("interestRate", savedLoan.getInterest());
//				response.put("uanNumber", uanNumber);
//				response.put("loanStatus", loanStatus);
//				response.put("loanAccountNumber", loanAccountNumber);
//				response.put("billDate", localDate);

//			int month = (int) responseBody.get("tenure");
//			Integer installmentNo = 1;
//			Double loanAmount = (Double) responseBody.get("loanAmount");
//			Double annualInterestRate = (Double) responseBody.get("interestRate");
//
//			Double monthlyInterestRate = annualInterestRate / (100 * 12);
//			Double installmentAmount;
//			if (monthlyInterestRate > 0) {
//				installmentAmount = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, month))
//						/ (Math.pow(1 + monthlyInterestRate, month) - 1);
//			} else {
//				installmentAmount = loanAmount / month;
//			}
//			Double closingPrincipal = loanAmount;
//			for (int i = 1; i <= month; i++) {
//				Double interestComponent = closingPrincipal * monthlyInterestRate;
//				Double principalComponent = installmentAmount - interestComponent;
//				closingPrincipal -= principalComponent;
//			}
//			System.out.println("Installment Amount: " + installmentAmount);
//			System.out.println("Final Closing Principal: " + closingPrincipal);
//
//			for (int i = 0; i < month; i++) {
//				RepaymentSchedule repaymentSchedule = new RepaymentSchedule();
//
//				LocalDate date = LocalDate.of(2024, month, 11);
//				repaymentSchedule.setInstallmentNo(installmentNo);
//				repaymentSchedule.setInstallmentDate(date);
//				repaymentSchedule.setInstallmentAmount(installmentAmount);
//
//				Double interest = Math.round(closingPrincipal * monthlyInterestRate * 100.0) / 100.0;
//				repaymentSchedule.setInterest(interest);
//
//				Double principal = installmentAmount - interest;
//				principal = Math.round(principal * 100.0) / 100.0;
//
//				if (principal > closingPrincipal) {
//					principal = closingPrincipal;
//					interest = installmentAmount - principal;
//				}
//
//				repaymentSchedule.setPrincipal(principal);
//
//				closingPrincipal -= principal;
//				closingPrincipal = Math.round(closingPrincipal * 100.0) / 100.0;
//
//				repaymentSchedule.setClosingPrincipal(closingPrincipal);
//
//				repaymentSchedule.setLoanAccountNumber(loanAccountNumber);
//
//				System.out.println("RepaymentSchedule : " + repaymentSchedule);
//
//				String apiUrl1 = "http://localhost:8080/repaymentSchedule/save";
//				HttpHeaders headers1 = new HttpHeaders();
//				headers1.setContentType(MediaType.APPLICATION_JSON);
//				HttpEntity<RepaymentSchedule> entity1 = new HttpEntity<>(repaymentSchedule, headers1);
//
//				ResponseEntity<Map> mapResponseEntity = restTemplate.postForEntity(apiUrl1, entity1, Map.class);
//				Map body = mapResponseEntity.getBody();
//
//				// Increment for Next Installment
//				month += 1;
//				installmentNo += 1;
//
//				if (body != null) {
//					System.out.println("RepaymentSchedule has been saved");
//				}
//			}


			int tenureMonths = (int) responseBody.get("tenure");
			double loanAmount = Double.parseDouble(responseBody.get("loanAmount").toString());
			double annualInterestRate = Double.parseDouble(responseBody.get("interestRate").toString());

			String loanAccountNumber = (String) responseBody.get("loanAccountNumber");

// Calculate monthly interest rate
			double monthlyInterestRate = annualInterestRate / (12 * 100);

// Calculate EMI using amortization formula
			double emi;
			if (monthlyInterestRate > 0) {
				emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) /
						(Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
			} else {
				emi = loanAmount / tenureMonths;
			}
			emi = Math.round(emi * 100.0) / 100.0;

			double closingPrincipal = loanAmount;
			LocalDate startDate = LocalDate.of(2024, 4, 11); // Loan start date

			for (int i = 0; i < tenureMonths; i++) {
				RepaymentSchedule schedule = new RepaymentSchedule();

				// Interest for this month
				double interest = Math.round(closingPrincipal * monthlyInterestRate * 100.0) / 100.0;

				// Principal component
				double principal = emi - interest;
				principal = Math.round(principal * 100.0) / 100.0;

				// Handle last installment to avoid negative closing principal
				if (principal > closingPrincipal) {
					principal = closingPrincipal;
					interest = emi - principal;
				}

				// Set schedule fields
				schedule.setInstallmentNo(i + 1);
				schedule.setInstallmentDate(startDate.plusMonths(i));
				schedule.setInstallmentAmount(emi);
				schedule.setInterest(interest);
				schedule.setPrincipal(principal);
				closingPrincipal = Math.round((closingPrincipal - principal) * 100.0) / 100.0;
				schedule.setClosingPrincipal(closingPrincipal);
				schedule.setLoanAccountNumber(loanAccountNumber);

				// Print or save the schedule
				System.out.println(schedule);

				// Save via API
				HttpHeaders headerss = new HttpHeaders();
				headerss.setContentType(MediaType.APPLICATION_JSON);
				HttpEntity<RepaymentSchedule> request = new HttpEntity<>(schedule, headerss);
				restTemplate.postForEntity("http://localhost:8080/repaymentSchedule/save", request, Void.class);
			}

			List<RepaymentSchedule> schedules = repaymentScheduleService.getRepaymentScheduleByLoanAccountNumber(loanAccountNumber);
			LoanApplicantDetails loanApplicantDetails = loanApplicantService.getapplicantData(loanAccountNumber);

			byte[] bytes = loanDetailsService.generatePdf(schedules, loanApplicantDetails);

			String to = "makandarshaukat786@gmail.com";
			String subject = "Repayment Schedule for Your Loan – Important Information";
			String body = "Dear Customer,<br><br>\n" +
					"\n" +
					"We hope this email finds you well. We are sharing the repayment schedule for your loan as part of the ongoing loan process.<br><br>\n" +
					"\n" +
					"Below are the details of your repayment schedule, including installment amounts, due dates, and outstanding principal. Please review the attached document for a detailed breakdown of your repayment obligations.<br><br>\n" +
					"\n" +
					"To ensure a smooth loan process, kindly review the schedule and let us know if you have any questions or require any clarifications.<br><br>\n" +
					"\n" +
					"You can also upload any required documents or additional information at the following link:  \n" +
					"\n" +
					"For further assistance, please feel free to contact our support team.<br><br>\n" +
					"\n" +
					"Thank you for choosing us for your financial needs.<br><br>\n" +
					"\n" +
					"Best regards,<br>  \n" +
					"Loan Processing Team<br>  \n" +
					"Surge IT Technology<br>  \n" +
					"7769979532\n";

			try {
				emailService.sendEmailWithRepaymentPdfAttachment(to, subject, body, schedules, bytes);

			} catch (MessagingException | IOException e) {
				e.printStackTrace();

			}

			String subject1 = "Loan Approval Confirmation";
			String body1 = "Congratulations! Your application has been deemed eligible for a loan. "
					+ "We have attached the disbursement details in the form. Once you acknowledge, we can proceed with account generation."
					+ "http://localhost:3003/#/LoanAmountDetails";
			System.out.println(body);
			emailService.sendSimpleEmail(to, subject, body);

			if (responseBody != null) {
				client.newCompleteCommand(job.getKey()).variables(responseBody).send().join();
			} else {
				client.newCompleteCommand(job.getKey()).variables(Map.of("error", "No response from API")).send()
						.join();
			}

		} catch (Exception e) {
			e.printStackTrace();
			client.newFailCommand(job.getKey()).retries(job.getRetries() - 1)
					.errorMessage("Error in Loan Status Update Worker: " + e.getMessage()).send().join();
		}

	}

	@ZeebeWorker(name = "Loan Status Update", type = "Loan Status Update")
	public void LoanStatusUpdateDisbursement(final JobClient client, final ActivatedJob job) {
		Map<String, Object> variableasmap = job.getVariablesAsMap();
		zeebeClient.newCompleteCommand(job.getKey()).variables("").send().join();
	}

	@Transactional
	@ZeebeWorker(name = "LoanTermApprovalNotification", type = "LoanTermApprovalNotification")
	public void LoanTermApprovalNotification(final JobClient client, final ActivatedJob job) {
		try {
			Map<String, Object> variables = job.getVariablesAsMap();
			ObjectMapper objectMapper = new ObjectMapper();

			JsonNode newDataNode = objectMapper.convertValue(variables.get("NewData"), JsonNode.class);
			String loanAccountNumber = newDataNode.path("loanAccountNumber").asText();

			Optional<Loan> optionalLoan = loanDetailsRepository.findByLoanAccountNumber(loanAccountNumber);

			if (optionalLoan.isPresent()) {
				Loan loan = optionalLoan.get();

				loan.setLoanAmount(newDataNode.path("loanAmount").asText());
				loan.setTenure(newDataNode.path("tenure").asInt());
				loan.setInterest(newDataNode.path("interestRate").asDouble());
				loan.setLoanStatus("Approved");
				loan.setBillDate(LocalDate.now());

				Loan updatedLoan = loanDetailsRepository.save(loan);

				repaymentScheduleRepository.deleteAllByLoanAccountNumber(loanAccountNumber);


//				int month = updatedLoan.getTenure();
//				Integer installmentNo = updatedLoan.getTenure();
//				Double loanAmount = Double.parseDouble(updatedLoan.getLoanAmount());
//				Double annualInterestRate = updatedLoan.getInterest();
//
//				Double monthlyInterestRate = annualInterestRate / (100 * 12);
//				Double installmentAmount;
//				if (monthlyInterestRate > 0) {
//					installmentAmount = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, month))
//							/ (Math.pow(1 + monthlyInterestRate, month) - 1);
//				} else {
//					installmentAmount = loanAmount / month;
//				}
//				Double closingPrincipal = loanAmount;
//				for (int i = 1; i <= installmentNo; i++) {
//					Double interestComponent = closingPrincipal * monthlyInterestRate;
//					Double principalComponent = installmentAmount - interestComponent;
//					closingPrincipal -= principalComponent;
//				}
//				System.out.println("Installment Amount: " + installmentAmount);
//				System.out.println("Final Closing Principal: " + closingPrincipal);
//
//				for (int i = 0; i < month; i++) {
//					RepaymentSchedule repaymentSchedule = new RepaymentSchedule();
//
//					LocalDate date = LocalDate.of(2024, month, 11);
//					repaymentSchedule.setInstallmentNo(installmentNo);
//					repaymentSchedule.setInstallmentDate(date);
//					repaymentSchedule.setInstallmentAmount(installmentAmount);
//
//					Double interest = Math.round(closingPrincipal * monthlyInterestRate * 100.0) / 100.0;
//					repaymentSchedule.setInterest(interest);
//
//					Double principal = installmentAmount - interest;
//					principal = Math.round(principal * 100.0) / 100.0;
//
//					if (principal > closingPrincipal) {
//						principal = closingPrincipal;
//						interest = installmentAmount - principal;
//					}
//
//					repaymentSchedule.setPrincipal(principal);
//
//					closingPrincipal -= principal;
//					closingPrincipal = Math.round(closingPrincipal * 100.0) / 100.0;
//
//					repaymentSchedule.setClosingPrincipal(closingPrincipal);
//
//					repaymentSchedule.setLoanAccountNumber(loanAccountNumber);
//
//					System.out.println("RepaymentSchedule : " + repaymentSchedule);
//
//					String apiUrl1 = "http://localhost:8080/repaymentSchedule/save";
//					HttpHeaders headers1 = new HttpHeaders();
//					headers1.setContentType(MediaType.APPLICATION_JSON);
//					HttpEntity<RepaymentSchedule> entity1 = new HttpEntity<>(repaymentSchedule, headers1);
//
//					ResponseEntity<Map> mapResponseEntity = restTemplate.postForEntity(apiUrl1, entity1, Map.class);
//					Map body = mapResponseEntity.getBody();
//
//					// Increment for Next Installment
//					month += 1;
//					installmentNo += 1;
//
//					if (body != null) {
//						System.out.println("RepaymentSchedule has been saved");
//					}
//				}


				int tenureMonths = updatedLoan.getTenure();
				Double loanAmount = Double.parseDouble(updatedLoan.getLoanAmount());
				Double annualInterestRate = updatedLoan.getInterest();
				Integer installmentNo = 1;




//				int tenureMonths = (int) responseBody.get("tenure");
//				double loanAmount = Double.parseDouble(responseBody.get("loanAmount").toString());
//				double annualInterestRate = Double.parseDouble(responseBody.get("interestRate").toString());
//
//				String loanAccountNumber = (String) responseBody.get("loanAccountNumber");

// Calculate monthly interest rate
				double monthlyInterestRate = annualInterestRate / (12 * 100);

// Calculate EMI using amortization formula
				double emi;
				if (monthlyInterestRate > 0) {
					emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) /
							(Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
				} else {
					emi = loanAmount / tenureMonths;
				}
				emi = Math.round(emi * 100.0) / 100.0;

				double closingPrincipal = loanAmount;
				LocalDate startDate = LocalDate.of(2024, 4, 11); // Loan start date

				for (int i = 0; i < tenureMonths; i++) {
					RepaymentSchedule schedule = new RepaymentSchedule();

					// Interest for this month
					double interest = Math.round(closingPrincipal * monthlyInterestRate * 100.0) / 100.0;

					// Principal component
					double principal = emi - interest;
					principal = Math.round(principal * 100.0) / 100.0;

					// Handle last installment to avoid negative closing principal
					if (principal > closingPrincipal) {
						principal = closingPrincipal;
						interest = emi - principal;
					}

					// Set schedule fields
					schedule.setInstallmentNo(i + 1);
					schedule.setInstallmentDate(startDate.plusMonths(i));
					schedule.setInstallmentAmount(emi);
					schedule.setInterest(interest);
					schedule.setPrincipal(principal);
					closingPrincipal = Math.round((closingPrincipal - principal) * 100.0) / 100.0;
					schedule.setClosingPrincipal(closingPrincipal);
					schedule.setLoanAccountNumber(loanAccountNumber);

					// Print or save the schedule
					System.out.println(schedule);

					// Save via API
					HttpHeaders headers = new HttpHeaders();
					headers.setContentType(MediaType.APPLICATION_JSON);
					HttpEntity<RepaymentSchedule> request = new HttpEntity<>(schedule, headers);
					restTemplate.postForEntity("http://localhost:8080/repaymentSchedule/save", request, Void.class);
				}

				List<RepaymentSchedule> schedules = repaymentScheduleService.getRepaymentScheduleByLoanAccountNumber(loanAccountNumber);
				LoanApplicantDetails loanApplicantDetails = loanApplicantService.getapplicantData(loanAccountNumber);

				byte[] bytes = loanDetailsService.generatePdf(schedules, loanApplicantDetails);

				String updatedPayloadJson = objectMapper.writeValueAsString(variables);
				LoanModification modification = new LoanModification();
				modification.setLoanAccountNumber(loanAccountNumber);
				modification.setPayloadJson(updatedPayloadJson);
				loanModificationRepository.save(modification);

				emailService.sendModificationAcceptedEmail();

				String to = "camerongre1@gmail.com";
				String subject = "Repayment Schedule for Your Loan – Important Information";
				String body = "Dear Customer,<br><br>\n" +
						"\n" +
						"We hope this email finds you well. We are sharing the repayment schedule for your loan as part of the ongoing loan process.<br><br>\n" +
						"\n" +
						"Below are the details of your repayment schedule, including installment amounts, due dates, and outstanding principal. Please review the attached document for a detailed breakdown of your repayment obligations.<br><br>\n" +
						"\n" +
						"To ensure a smooth loan process, kindly review the schedule and let us know if you have any questions or require any clarifications.<br><br>\n" +
						"\n" +
						"You can also upload any required documents or additional information at the following link:  \n" +
						"\n" +
						"For further assistance, please feel free to contact our support team.<br><br>\n" +
						"\n" +
						"Thank you for choosing us for your financial needs.<br><br>\n" +
						"\n" +
						"Best regards,<br>  \n" +
						"Loan Processing Team<br>  \n" +
						"Surge IT Technology<br>  \n" +
						"7769979532\n";

				try {
					emailService.sendEmailWithRepaymentPdfAttachment(to, subject, body, schedules, bytes);

				} catch (MessagingException | IOException e) {
					e.printStackTrace();

				}

				client.newCompleteCommand(job.getKey()).send().join();

			} else {
				throw new RuntimeException("Loan not found with loanAccountNumber: " + loanAccountNumber);
			}

		} catch (Exception e) {
			e.printStackTrace();
			client.newFailCommand(job.getKey()).retries(job.getRetries() - 1)
					.errorMessage("Error updating loan: " + e.getMessage()).send().join();
		}
	}

	@ZeebeWorker(name = "Send Acknowledgement Email", type = "AcknowledgementEmail")
	public void sendAcknowledgementEmail(final JobClient client, final ActivatedJob activatedJob){

		Map<String, Object> variables = activatedJob.getVariablesAsMap();
		String customer = variables.get("customer").toString();
		emailService.sendLoanDecisionEmail(customer);

		client.newCompleteCommand(activatedJob.getKey()).variables(variables).send()
				.join();
	}

	@ZeebeWorker(name = "Send Final Acceptance Email", type = "FinalAcceptanceEmail")
	public void sendFinalAcceptanceEmail(final JobClient client, final ActivatedJob activatedJob){

		emailService.sendFinalLoanAcceptanceEmail();
		client.newCompleteCommand(activatedJob.getKey()).send()
				.join();
	}

//	@ZeebeWorker(name = "Persist Loan Details", type = "Persist Loan Details")
//	public void calculateTenure(final JobClient client, final ActivatedJob job) {
//		try {
//			Map<String, Object> variables = job.getVariablesAsMap();
//
//			String apiUrl = "http://localhost:8080/calculateTenureInterestSaveData";
//			HttpHeaders headers = new HttpHeaders();
//			headers.setContentType(MediaType.APPLICATION_JSON);
//			HttpEntity<String> entity = new HttpEntity<>(headers);
//			ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);
//			Map<String, Object> responseBody = response.getBody();
//			System.out.println("Loan has been saved...!");
//			String loanAccountNumber = responseBody.get("loanAccountNumber").toString();
//
////				response.put("loanId", savedLoan.getLoanId());
////				response.put("loanAmount", savedLoan.getLoanAmount());
////				response.put("tenure", savedLoan.getTenure());
////				response.put("interestRate", savedLoan.getInterest());
////				response.put("uanNumber", uanNumber);
////				response.put("loanStatus", loanStatus);
////				response.put("loanAccountNumber", loanAccountNumber);
////				response.put("billDate", localDate);
//
//			int month = (int) responseBody.get("tenure");
//			Integer installmentNo = (Integer) responseBody.get("tenure");
//			Double loanAmount = (Double) responseBody.get("loanAmount");
//			Double annualInterestRate = (Double) responseBody.get("interestRate");
//
//			Double monthlyInterestRate = annualInterestRate / (100 * 12);
//			Double installmentAmount;
//			if (monthlyInterestRate > 0) {
//				installmentAmount = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, month))
//						/ (Math.pow(1 + monthlyInterestRate, month) - 1);
//			} else {
//				installmentAmount = loanAmount / month;
//			}
//			Double closingPrincipal = loanAmount;
//			for (int i = 1; i <= installmentNo; i++) {
//				Double interestComponent = closingPrincipal * monthlyInterestRate;
//				Double principalComponent = installmentAmount - interestComponent;
//				closingPrincipal -= principalComponent;
//			}
//			System.out.println("Installment Amount: " + installmentAmount);
//			System.out.println("Final Closing Principal: " + closingPrincipal);
//
//			for (int i = 0; i < month; i++) {
//				RepaymentSchedule repaymentSchedule = new RepaymentSchedule();
//
//				LocalDate date = LocalDate.of(2024, month, 11);
//				repaymentSchedule.setInstallmentNo(installmentNo);
//				repaymentSchedule.setInstallmentDate(date);
//				repaymentSchedule.setInstallmentAmount(installmentAmount);
//
//				Double interest = Math.round(closingPrincipal * monthlyInterestRate * 100.0) / 100.0;
//				repaymentSchedule.setInterest(interest);
//
//				Double principal = installmentAmount - interest;
//				principal = Math.round(principal * 100.0) / 100.0;
//
//				if (principal > closingPrincipal) {
//					principal = closingPrincipal;
//					interest = installmentAmount - principal;
//				}
//
//				repaymentSchedule.setPrincipal(principal);
//
//				closingPrincipal -= principal;
//				closingPrincipal = Math.round(closingPrincipal * 100.0) / 100.0;
//
//				repaymentSchedule.setClosingPrincipal(closingPrincipal);
//
//				repaymentSchedule.setLoanAccountNumber(loanAccountNumber);
//
//				System.out.println("RepaymentSchedule : " + repaymentSchedule);
//
//				String apiUrl1 = "http://localhost:8080/repaymentSchedule/save";
//				HttpHeaders headers1 = new HttpHeaders();
//				headers1.setContentType(MediaType.APPLICATION_JSON);
//				HttpEntity<RepaymentSchedule> entity1 = new HttpEntity<>(repaymentSchedule, headers1);
//
//				ResponseEntity<Map> mapResponseEntity = restTemplate.postForEntity(apiUrl1, entity1, Map.class);
//				Map body = mapResponseEntity.getBody();
//
//				// Increment for Next Installment
//				month += 1;
//				installmentNo += 1;
//
//				if (body != null) {
//					System.out.println("RepaymentSchedule has been saved");
//				}
//			}
//
//			if (responseBody != null) {
//				client.newCompleteCommand(job.getKey()).variables(responseBody).send().join();
//			} else {
//				client.newCompleteCommand(job.getKey()).variables(Map.of("error", "No response from API")).send()
//						.join();
//			}
//
//		} catch (Exception e) {
//			e.printStackTrace();
//			client.newFailCommand(job.getKey()).retries(job.getRetries() - 1)
//					.errorMessage("Error in Loan Status Update Worker: " + e.getMessage()).send().join();
//		}
//	}

}
