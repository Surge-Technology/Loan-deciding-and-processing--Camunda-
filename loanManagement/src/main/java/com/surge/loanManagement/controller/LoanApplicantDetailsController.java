package com.surge.loanManagement.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.xmlbeans.impl.xb.xsdschema.Public;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.ProcessEngines;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.TextAlignment;
import com.surge.loanManagement.AppConfig;
import com.surge.loanManagement.DTO.TaskDTO;
import com.surge.loanManagement.model.Loan;
import com.surge.loanManagement.model.LoanApplicantDetails;
import com.surge.loanManagement.model.LoantransactionDetails;
import com.surge.loanManagement.repository.LoanApplicantDetailsRepository;
import com.surge.loanManagement.repository.LoantransactionDetailsRep;
import com.surge.loanManagement.service.DocumentService;
import com.surge.loanManagement.service.EmailService;
import com.surge.loanManagement.service.LoanApplicantService;
import com.surge.loanManagement.service.LoanDetailsService;

import jakarta.transaction.Transactional;

@RestController
public class LoanApplicantDetailsController {
	
	@Autowired
	 LoantransactionDetailsRep rep;
//	@Autowired
//	private LoantransactionDetailsRep loantransactionDetailsRep;
// 
	@Autowired
	ProcessEngine processEngine;

	@Autowired
	TaskService taskService;

	@Autowired
	LoanApplicantDetailsRepository loanApplicantDetailsRepository;

	@Autowired
	LoanApplicantService loanApplicantService;

	@Autowired
	DocumentService documentService;

	@Autowired
	RuntimeService runtimeService;

	@Autowired
	ObjectMapper objectMapper;

	
	
	@Autowired
	EmailService emailService;

	@Autowired
	LoanDetailsService loanDetailsService;

	private String balance;
	private String loanType;
	private String clarificationDetails = "";
	Map<String, Object> responseMap = new HashMap<>();
	//private String processInstanceId;
	private String userId;
	private String emailId;
	private String taskId;
	private JsonNode rootNode;
	private String loanAccountNumber;
	private Map<String, Object> response;
	private static final Map<String, Map<String, Object>> loanApplications = new HashMap<>();
	private final Map<String, Object> loanResponseMap = new HashMap<>();
	private String emailIdData;
	private String loanStatus;
	private Long loanAmount;
	private String applicantName;
	
//	@GetMapping("/getAllTransaction")
//	public void getAllTransaction() {
//		List<LoantransactionDetails> loantransactionDetails = rep.findAll();
//		System.out.println(loantransactionDetails);
//	}
//	
	
	@Autowired
	AppConfig appConfig;
	
 
	
	@CrossOrigin
	@GetMapping("/getAllTransaction")
	public List<Map<String, Object>> getAllTransaction() {
	    List<LoantransactionDetails> loantransactionDetails = rep.findAll();
	    List<Map<String, Object>> transactionList = new ArrayList<>();

	    for (LoantransactionDetails details : loantransactionDetails) {
	        Map<String, Object> map = new HashMap<>();
	        map.put("accountNumber", details.getLoanAccountNumber());
	        map.put("balanceAmount", details.getBalanceAmount());
	        transactionList.add(map);
	    }

	    return transactionList;
	}



	@CrossOrigin
	@GetMapping("/loans/pdf")
	public ResponseEntity<String> generateLoanPdf() {
		List<Loan> loans = loanDetailsService.getAllLoans(); // Fetch loan data from DB
 
		try {
			// Define the file path where you want to save the PDF
			String uploadDirectory = appConfig.getLoanPdfPath();
			
			System.out.println(uploadDirectory);
 
	        // Creating PdfWriter instance for writing PDF data to the specified file
	        PdfWriter writer = new PdfWriter(uploadDirectory);
 
	        // Creating PdfDocument instance
	        PdfDocument pdf = new PdfDocument(writer);
 
	        // Creating Document instance
	        Document document = new Document(pdf);
 
	        // Add a Title to the PDF with larger font size and bold
	        document.add(new Paragraph("Loan Management Report")
	                .setTextAlignment(TextAlignment.CENTER)
	                .setFontSize(22)
	                .setBold()
	                .setMarginBottom(20)
	                .setFontColor(ColorConstants.DARK_GRAY));
 
	        // Create table with columns: Loan ID, UAN Number, Loan Account Number, Loan Amount, Tenure, Interest, Loan Status
	        float[] columnWidths = { 1f, 2f, 2f, 2f, 1f, 1f, 2f };
	        Table table = new Table(columnWidths);  // Table with dynamic column widths
 
	        // Add Header Row
	        table.addCell(createStyledHeaderCell("Loan ID"));
	        table.addCell(createStyledHeaderCell("UAN Number"));
	        table.addCell(createStyledHeaderCell("Loan Account Number"));
	        table.addCell(createStyledHeaderCell("Loan Amount"));
	        table.addCell(createStyledHeaderCell("Tenure"));
	        table.addCell(createStyledHeaderCell("Interest"));
	        table.addCell(createStyledHeaderCell("Loan Status"));
 
	        // Add loan data to the table
	        for (Loan loan : loans) {
	            table.addCell(createStyledCell(String.valueOf(loan.getLoanId())));
	            table.addCell(createStyledCell(loan.getUanNumber()));
	            table.addCell(createStyledCell(loan.getLoanAccountNumber()));
	            table.addCell(createStyledCell(loan.getLoanAmount()));
	            table.addCell(createStyledCell(String.valueOf(loan.getTenure())));
	            table.addCell(createStyledCell(String.valueOf(loan.getInterest())));
	            table.addCell(createStyledCell(loan.getLoanStatus()));
	        }
 
	        // Add the table to the document
	        document.add(table);
 
	        // Add a small footer
	        document.add(new Paragraph("\nReport generated on: " + LocalDate.now())
	                .setTextAlignment(TextAlignment.RIGHT)
	                .setFontSize(8)
	                .setFontColor(ColorConstants.GRAY));
 
	        // Close the document
	        document.close();
 
	        // Return a response indicating the file has been saved successfully
	        return ResponseEntity.ok("PDF report has been successfully generated at: " + uploadDirectory);
 
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(500).body("Error generating PDF report.");
	    }
	}
 
	// Helper method to create a styled cell for table content
	private Cell createStyledCell(String content) {
	    // Create a Paragraph with the content
	    Paragraph paragraph = new Paragraph(content)
	            .setTextAlignment(TextAlignment.CENTER)
	            .setFontSize(10);
 
	    // Create and style the cell with the paragraph
	    return new Cell()
	            .add(paragraph)  // Add the paragraph instead of string
	            .setBackgroundColor(ColorConstants.WHITE)  // Set white background for data rows
	            .setFontColor(ColorConstants.BLACK)  // Set text color to black
	            .setPadding(5);
	            // .setBorder(Border.NO_BORDER);
	}
 
	// Helper method to create a styled header cell for table headers
	private Cell createStyledHeaderCell(String content) {
	    // Create a Paragraph with the content
	    Paragraph paragraph = new Paragraph(content)
	            .setTextAlignment(TextAlignment.CENTER)
	            .setFontSize(12)
	            .setBold();
 
	    // Create and style the header cell with the paragraph
	    return new Cell()
	            .add(paragraph)  // Add the paragraph instead of string
	            .setBackgroundColor(ColorConstants.BLUE)  // Set header background color to blue
	            .setFontColor(ColorConstants.WHITE)  // Set text color to white for header
	            .setPadding(10);
	            //.setBorder(Border.NO_BORDER);
	}
 
	
//	@CrossOrigin
//	@PostMapping("/save")
//    public LoantransactionDetails saveTranscation(@RequestBody LoantransactionDetails obj)
//    {
//    		
//    		System.out.println("loan amount"+obj.getDate());
//    		
//    		LoantransactionDetails detail=new LoantransactionDetails();
//    		detail.setDate(obj.getDate());
//    		
//    		detail.setPaymentType(obj.getPaymentType());
//    		detail.setTransactionAmount(obj.getTransactionAmount());
//    		detail.setLoanAmount(obj.getLoanAmount());
//    		detail.setBalanceAmount(obj.getLoanAmount()-obj.getTransactionAmount());
//    		double balanceamount =detail.getBalanceAmount();
//    		String to = emailId;
//    		
//    		String Subject = "Loan Management Report";
//    		
//    		String body = "Dear User, please find the attached loan report details"+"Your paid Amount is "+balanceamount;
//    		
//    		emailService.sendSimpleEmail(to, Subject,body );
//    		System.out.println("emailid"+to);
//    		
//    		
//		return rep.save(detail);
//    	
//    }
//	
	
	@CrossOrigin
	@PostMapping("/saveApplicantDetails")
	public ResponseEntity<Map<String, Object>> saveJson(@RequestBody String data) throws IOException {
		ProcessInstance processInstance = processEngine.getRuntimeService()
				.createProcessInstanceByKey("Loan_Application").execute();
		ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
		TaskService taskService = processEngine.getTaskService();
		RuntimeService runtimeService = processEngine.getRuntimeService();
		String processInstanceId = processInstance.getId();
		JsonNode rootNode = objectMapper.readTree(data);
		String dobString = rootNode.path("personalData").path("personalInfo").path("dob").asText();
		int age = calculateAgeFromDOB(dobString);
 
		double annualIncome = 0;
		if (rootNode.has("houseHold")) {
			annualIncome = rootNode.path("houseHold").path("annualIncome").asDouble();
		} else if (rootNode.has("employmentData")) {
			annualIncome = rootNode.path("employmentData").path("annualIncome").asDouble();
		}
 
		responseMap.put("age", age);
		responseMap.put("annualIncome", annualIncome);
		emailId = rootNode.path("personalData").path("contactInfo").path("email").asText();
		runtimeService.setVariable(processInstanceId, "emailId", emailId);
		applicantName = rootNode.path("personalData").path("personalInfo").path("legalFullName").asText();
		loanAmount = rootNode.path("bankDetails").path("loanAmount").asLong();
		loanType = rootNode.path("bankDetails").path("loanType").asText();
		loanAccountNumber = generateLoanAccountNumber();
		loanStatus = "Pending";
		Timestamp createdDate = new Timestamp(System.currentTimeMillis());
 
		if (rootNode.has("Files")) {
			JsonNode filesNode = rootNode.path("Files").path("otherFiles");
			for (JsonNode fileNode : filesNode) {
				String fileName = fileNode.path("name").asText();
				String fileContent = fileNode.path("content").asText();
				documentService.storeFile(fileName, fileContent);
			}
		}
//		loanApplicantDetailsRepository.saveJson(data, emailId, loanAccountNumber, createdDate, loanStatus, loanType,
//				loanAmount, applicantName);
		int rowsAffected = loanApplicantDetailsRepository.saveJson(data, emailId, loanAccountNumber, createdDate,
				loanStatus, loanType, loanAmount, applicantName,null,processInstanceId);
 
		LoanApplicantDetails savedApplicant = loanApplicantDetailsRepository
				.findTopByEmailIdOrderByCreatedDateDesc(emailId);
 
		Long generatedId = (savedApplicant != null) ? savedApplicant.getId() : null;
 
		Map<String, Object> applicationData = new HashMap<>();
		applicationData.put("id", generatedId);
		applicationData.put("emailId", emailId);
		applicationData.put("loanAccountNumber", loanAccountNumber);
		applicationData.put("createdDate", createdDate);
		applicationData.put("loanStatus", loanStatus);
		applicationData.put("loanType", loanType);
		applicationData.put("loanAmount", loanAmount);
		applicationData.put("applicantName", applicantName);
		applicationData.put("jsonData", data);
		applicationData.put("processInstanceId", processInstanceId);
		loanApplications.put(loanAccountNumber, applicationData);
		System.out.println(loanApplications);
 
		String subject = "Loan Application Submission Confirmation";
		String body = "Dear Applicant,\n\nYour loan application has been successfully submitted. We will process your request and update you shortly.\n\nThank you.";
		 emailService.sendSimpleEmail(emailId, subject, body);
 
		return ResponseEntity.ok(applicationData);
	}

	private String generateLoanAccountNumber() {
		return String.format("%04d", new Random().nextInt(10000));
	}
	
	
//	@CrossOrigin
//	@GetMapping("/ApplicantDashboard")
//	public Map<String, Object> getApplicantDashboard(@RequestParam String emailId) {
//		Map<String, Object> responseMap = new HashMap<>();
//
//		List<LoanApplicantDetails> loanDetailsList = loanApplicantService.getAllLoanDetailsByEmail(emailId);
//
//		if (!loanDetailsList.isEmpty()) {
//			List<Map<String, Object>> loanDetailsResponseList = new ArrayList<>();
//
//			for (LoanApplicantDetails loanDetails : loanDetailsList) {
//				Map<String, Object> loanDetailsMap = new HashMap<>();
//				loanDetailsMap.put("applicantName", loanDetails.getApplicantName());
//				loanDetailsMap.put("createdDate", loanDetails.getCreatedDate());
//				loanDetailsMap.put("accountNumber", loanDetails.getLoanAccountNumber());
//				loanDetailsMap.put("loanStatus", loanDetails.getLoanStatus());
//				loanDetailsMap.put("loanType", loanDetails.getLoanType());
//				loanDetailsMap.put("loanAmount", loanDetails.getLoanAmount());
//				loanDetailsMap.put("balanceAmount", loanDetails.getBalanceAmount());
//				loanDetailsResponseList.add(loanDetailsMap);
//			}
//
//			responseMap.put("loanDetails", loanDetailsResponseList);
//		} else {
//			responseMap.put("error", "No loan details found for the given email.");
//		}
//
//		return responseMap;
//	}
	@CrossOrigin
	@GetMapping("/ApplicantDashboard")
	public Map<String, Object> getApplicantDashboard(@RequestParam String emailId) {
	    Map<String, Object> responseMap = new HashMap<>();
	    System.out.println("Fetching loan details for email: " + emailId);

	    List<LoanApplicantDetails> loanDetailsList = loanApplicantService.getAllLoanDetailsByEmail(emailId);
	    System.out.println("Retrieved Loan Details: " + loanDetailsList);

	    if (!loanDetailsList.isEmpty()) {
	        List<Map<String, Object>> loanDetailsResponseList = new ArrayList<>();

	        for (LoanApplicantDetails loanDetails : loanDetailsList) {
	            Map<String, Object> loanDetailsMap = new HashMap<>();
	            loanDetailsMap.put("applicantName", loanDetails.getApplicantName());
	            loanDetailsMap.put("createdDate", loanDetails.getCreatedDate());
	            loanDetailsMap.put("accountNumber", loanDetails.getLoanAccountNumber());
	            loanDetailsMap.put("loanStatus", loanDetails.getLoanStatus());
	            loanDetailsMap.put("loanType", loanDetails.getLoanType());
	            loanDetailsMap.put("loanAmount", loanDetails.getLoanAmount());
	            loanDetailsMap.put("balanceAmount", loanDetails.getBalanceAmount());
	            loanDetailsResponseList.add(loanDetailsMap);
	        }

	        responseMap.put("loanDetails", loanDetailsResponseList);
	    } else {
	        System.out.println("No loan details found for email: " + emailId);
	        responseMap.put("error", "No loan details found for the given email.");
	    }

	    return responseMap;
	}

	@CrossOrigin
	@GetMapping("/calculateCibilScore")
	public int calculateCibil() {
		int age = (int) responseMap.get("age");
		double annualIncome = (double) responseMap.get("annualIncome");
		int cibilScore = calculateCibilScore(age, annualIncome);

		return cibilScore;
	}

	public static int calculateCibilScore(int age, double annualIncome) {
		int ageScore = getAgeScore(age);
		int incomeScore = getIncomeScore(annualIncome);
		return (ageScore + incomeScore) / 2;
	}

	private static int getAgeScore(int age) {
		if (age >= 18 && age <= 25) {
			return 300;
		} else if (age >= 26 && age <= 35) {
			return 600;
		} else if (age >= 36 && age <= 50) {
			return 750;
		} else if (age >= 51 && age <= 65) {
			return 800;
		} else if (age > 65) {
			return 850;
		}
		return 300;
	}

	private static int getIncomeScore(double annualIncome) {
		if (annualIncome < 500000) {
			return 300;
		} else if (annualIncome >= 500000 && annualIncome < 1000000) {
			return 600;
		} else if (annualIncome >= 1000000 && annualIncome < 2000000) {
			return 750;
		} else if (annualIncome >= 2000000) {
			return 800;
		}
		return 300;
	}

	public int calculateAgeFromDOB(String dobString) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate dob = LocalDate.parse(dobString, formatter);
		LocalDate currentDate = LocalDate.now();
		Period period = Period.between(dob, currentDate);
		return period.getYears();
	}

	@CrossOrigin
	@GetMapping("/getTaskBasedOnUser")
	public ResponseEntity<List<TaskDTO>> getAllActiveTasksBasedOnUser(@RequestParam String user) {
	    String processDefinitionKey = "Loan_Application";
	    System.out.println("Fetching active tasks for user: " + user + " and process definition key: " + processDefinitionKey);
 
	    // Get ProcessEngine and TaskService
	    ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
	    TaskService taskService = processEngine.getTaskService();
 
	    // Query for active tasks assigned to the user
	    List<Task> tasks = taskService.createTaskQuery()
	            .processDefinitionKey(processDefinitionKey)
	            .taskAssignee(user)
	            .active()
	            .list();
 
	    // Convert tasks into TaskDTO objects
	    List<TaskDTO> taskDTOs = tasks.stream().map(task -> {
	        // Retrieve processInstanceId from the task
	        String processInstanceId = task.getProcessInstanceId();
 
	        // Retrieve associated LoanApplicantDetails data based on processInstanceId
	        LoanApplicantDetails loanDetails = loanApplicantDetailsRepository
	                .findByProcessInstanceId(processInstanceId);
 
	        // Create TaskDTO with all details
	        Timestamp creationTimestamp = task.getCreateTime() != null ?
	                new Timestamp(task.getCreateTime().getTime()) : null;
 
	        return new TaskDTO(
	                task.getId(),              // Task ID
	                task.getName(),            // Task Name
	                task.getAssignee(),        // Assignee
	                processInstanceId,         // Process Instance ID
	                creationTimestamp,         // Task creation timestamp
	                loanDetails                // LoanApplicantDetails object
	        );
	    }).collect(Collectors.toList());
 
	    return ResponseEntity.ok(taskDTOs);
	}

	@CrossOrigin
	@PostMapping("/InitialApprover")
	public ResponseEntity<String> loanApproval(@RequestBody String approval,@RequestParam String processInstanceId) throws JsonProcessingException {
		System.out.println("Received Approval Data: " + approval);
		
		ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
		TaskService taskService = processEngine.getTaskService();
		RuntimeService runtimeService = processEngine.getRuntimeService();
		ObjectMapper objectMapper = new ObjectMapper();

		JsonNode rootNode = objectMapper.readTree(approval);
		String finalDecision = rootNode.path("InitialApprover").asText();
		System.out.println("Setting InitialApprover to: " + finalDecision);
		runtimeService.setVariable(processInstanceId, "InitialApprover", finalDecision.trim());
		String approvalValue = (String) runtimeService.getVariable(processInstanceId, "InitialApprover");
		System.out.println("Current value of InitialApprover: " + approvalValue);

		List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstanceId).active().list();
		Task task = tasks.get(0);
		String taskId = task.getId();
		String userId = task.getAssignee();

		System.out.println("Task ID: " + taskId);
		System.out.println("Assigned User: " + userId);
		taskService.claim(taskId, userId);
		System.out.println("Task claimed successfully by user: " + userId);

		taskService.complete(taskId);
		System.out.println("Task completed successfully.");

		return ResponseEntity.ok("Loan approval process completed successfully.");
	}

//	@CrossOrigin
//	@PostMapping("/UnderWriter")
//	public ResponseEntity<String> UnderWriterApprover(@RequestBody String approval) throws JsonProcessingException {
//		System.out.println("Received Approval Data: " + approval);
//		ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
//		TaskService taskService = processEngine.getTaskService();
//		RuntimeService runtimeService = processEngine.getRuntimeService();
//		ObjectMapper objectMapper = new ObjectMapper();
//		JsonNode rootNode = objectMapper.readTree(approval);
//		String finalDecision = rootNode.path("UnderWriter").asText();
//		String clarificationDetails = "";
//		if ("needClarification".equals(finalDecision)) {
//			clarificationDetails = rootNode.path("clarificationDetails").asText();
//		}
//		System.out.println("Final Decision: " + finalDecision);
//		System.out.println("Clarification Details: " + clarificationDetails);
//		runtimeService.setVariable(processInstanceId, "UnderWriter", finalDecision);
//		if (!clarificationDetails.isEmpty()) {
//			runtimeService.setVariable(processInstanceId, "clarificationDetails", clarificationDetails);
//		}
//		List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstanceId).active().list();
//		Task task = tasks.get(0);
//		taskId = task.getId();
//		userId = task.getAssignee();
//		System.out.println("Task ID: " + taskId);
//		System.out.println("Assigned User: " + userId);
//		taskService.claim(taskId, userId);
//		System.out.println("Task claimed successfully by user: " + userId);
//		taskService.complete(taskId);
//		System.out.println("Task completed successfully.");
//		return ResponseEntity.ok("Loan approval process completed successfully.");
//	}

	@CrossOrigin
	@PostMapping("/UnderWriter")
	public ResponseEntity<String> UnderWriterApprover(@RequestBody String approval,@RequestParam String processInstanceId) throws JsonProcessingException {
	    System.out.println("Received Approval Data: " + approval);
 
	    ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
	    TaskService taskService = processEngine.getTaskService();
	    RuntimeService runtimeService = processEngine.getRuntimeService();
 
	    ObjectMapper objectMapper = new ObjectMapper();
	    JsonNode rootNode = objectMapper.readTree(approval);
 
	    // Ensure JSON parsing works correctly
	    String finalDecision = rootNode.has("UnderWriter") ? rootNode.get("UnderWriter").asText() : "";
 
	    // Debugging print
	    System.out.println("Extracted finalDecision: " + finalDecision);
 
	    // Declare clarificationDetails properly
	    
	    if ("needClarification".equals(finalDecision)) {
	        clarificationDetails = rootNode.path("clarificationDetails").asText("");
	    }
 
	    System.out.println("Final Decision: " + finalDecision);
	    System.out.println("Clarification Details: " + clarificationDetails);
 
	    runtimeService.setVariable(processInstanceId, "UnderWriter", finalDecision);
 
	    if (!clarificationDetails.isEmpty()) {
	        runtimeService.setVariable(processInstanceId, "clarificationDetails", clarificationDetails);
	    }
 
	    List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstanceId).active().list();
	    if (tasks.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No active task found for the given process instance.");
	    }
 
	    Task task = tasks.get(0);
	    String taskId = task.getId();
	    String userId = task.getAssignee();
 
	    System.out.println("Task ID: " + taskId);
	    System.out.println("Assigned User: " + userId);
 
	    taskService.claim(taskId, userId);
	    System.out.println("Task claimed successfully by user: " + userId);
 
	    taskService.complete(taskId);
	    System.out.println("Task completed successfully.");
 
	    return ResponseEntity.ok("Loan approval process completed successfully.");
	}
	@CrossOrigin
	@PostMapping("/calculateTenureInterest")
	public ResponseEntity<Map<String, Object>> calculateTenureAndInterest() {
	//		@RequestBody Map<String, Object> requestData) {
	//	Long loanAmount = Long.parseLong(requestData.get("loanAmount").toString);

		int tenure;
		double interestRate;
		if (loanAmount <= 100000) {
			tenure = 5;
			interestRate = 5.0;
		} else if (loanAmount <= 500000) {
			tenure = 12;
			interestRate = 6.0;
		} else if (loanAmount <= 1000000) {
			tenure = 24;
			interestRate = 7.0;
		} else if (loanAmount <= 5000000) {
			tenure = 36;
			interestRate = 8.0;
		} else {
			tenure = 48;
			interestRate = 9.0;
		}

		loanResponseMap.put("loanAmount", loanAmount);
		loanResponseMap.put("tenure", tenure);
		loanResponseMap.put("interestRate", interestRate);
		loanResponseMap.put("loanAccountNumber", loanAccountNumber);
		loanResponseMap.put("applicantName", applicantName);
		return ResponseEntity.ok(loanResponseMap);
	}

	@CrossOrigin
	@PostMapping("/LegalApprover")
	public ResponseEntity<String> LegalApprover(@RequestBody String approval,@RequestParam String processInstanceId) throws JsonProcessingException {
		System.out.println("Received Approval Data: " + approval);
		ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
		TaskService taskService = processEngine.getTaskService();
		RuntimeService runtimeService = processEngine.getRuntimeService();
		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode rootNode = objectMapper.readTree(approval);
		
		  String finalDecision = rootNode.has("LegalApprover") ? rootNode.get("LegalApprover").asText() : "";
 
		    System.out.println("Extracted finalDecision: " + finalDecision);
	
		    if ("needClarification".equals(finalDecision)) {
		        clarificationDetails = rootNode.path("clarificationDetails").asText("");
		    }
	
		    System.out.println("Final Decision: " + finalDecision);
		    System.out.println("Clarification Details: " + clarificationDetails);
	
		    runtimeService.setVariable(processInstanceId, "LegalApprover", finalDecision);
 
		List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstanceId).active().list();
		System.out.println("tasskkkkk");
		Task task = tasks.get(0);
		taskId = task.getId();
		userId = task.getAssignee();
		System.out.println("Task ID: " + taskId);
		System.out.println("Assigned User: " + userId);
		taskService.claim(taskId, userId);
		System.out.println("Task claimed successfully by user: " + userId);
		taskService.complete(taskId);
		System.out.println("Task completed successfully.");
		return ResponseEntity.ok("Loan approval process completed successfully.");
	}
	
//	@CrossOrigin
//	@GetMapping("/getApplicantDetails")
//	public List<JsonNode> getAllApplicantData() {
//		List<JsonNode> response = new ArrayList<>();
//		ObjectMapper objectMapper = new ObjectMapper();
//		List<LoanApplicantDetails> jsonDataList = loanApplicantDetailsRepository.findAll();
//		for (LoanApplicantDetails jsonData : jsonDataList) {
//			try {
//				JsonNode jsonNode = objectMapper.readTree(jsonData.getData());
//				response.add(jsonNode);
//			} catch (IOException e) {
//				e.printStackTrace();
//			}
//		}
//		return response;
//	}
	
	@CrossOrigin
	@GetMapping("/getApplicantDetails")
	public List<JsonNode> getAllApplicantData() {
	    List<JsonNode> response = new ArrayList<>();
	    ObjectMapper objectMapper = new ObjectMapper();
	    List<LoanApplicantDetails> jsonDataList = loanApplicantDetailsRepository.findAll();
 
	    for (LoanApplicantDetails jsonData : jsonDataList) {
	        try {
	            JsonNode dataNode = objectMapper.readTree(jsonData.getData());
 
	            ObjectNode combinedNode = objectMapper.createObjectNode();
	            combinedNode.put("id", jsonData.getId());
	            combinedNode.put("emailId", jsonData.getEmailId());
	            combinedNode.put("loanAccountNumber", jsonData.getLoanAccountNumber());
	            combinedNode.put("createdDate", jsonData.getCreatedDate() != null ? jsonData.getCreatedDate().toString() : null);
	            combinedNode.put("loanStatus", jsonData.getLoanStatus());
	            combinedNode.put("loanType", jsonData.getLoanType());
	            combinedNode.put("loanAmount", jsonData.getLoanAmount());
	            combinedNode.put("applicantName", jsonData.getApplicantName());
	            //combinedNode.put("balanceAmount", balanceAmount);
	            combinedNode.setAll((ObjectNode) dataNode);
 
	            response.add(combinedNode);
	        } catch (IOException e) {
	            e.printStackTrace();
	        }
	    }
	    return response;
	}  

	@CrossOrigin
	@GetMapping("/getApplicantData/{id}")
	public ResponseEntity<JsonNode> getApplicantData(@PathVariable Long id) {
		Optional<LoanApplicantDetails> jsonData = loanApplicantDetailsRepository.findById(id);

		if (jsonData.isPresent()) {
			try {
				ObjectMapper objectMapper = new ObjectMapper();
				JsonNode jsonNode = objectMapper.readTree(jsonData.get().getData());
				return ResponseEntity.ok(jsonNode);
			} catch (IOException e) {
				e.printStackTrace();
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
			}
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@CrossOrigin
	 @GetMapping("/getApplicantDataByAccount/{loanAccountNumber}")
	    public LoanApplicantDetails getApplicantDataByAccount(@PathVariable String loanAccountNumber) {
	        LoanApplicantDetails jsonData = loanApplicantDetailsRepository.findByLoanAccountNumber(loanAccountNumber);
            return jsonData;
	        
//	        if (jsonData.isPresent()) {
//	            try {
//	                ObjectMapper objectMapper = new ObjectMapper();
//	                JsonNode jsonNode = objectMapper.readTree(jsonData.get().getData());
//	                return ResponseEntity.ok(jsonNode);
//	            } catch (IOException e) {
//	                e.printStackTrace();
//	                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//	            }
//	        } else {
//	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//	        }
	    }

	@CrossOrigin
	@GetMapping("/getLoanDetails")
	public ResponseEntity<Map<String, Object>> getLoanDetails() {
		if (loanResponseMap.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Collections.singletonMap("message", "No loan details found"));
		}
		return ResponseEntity.ok(loanResponseMap);
	}

	@CrossOrigin
	@PostMapping("/calculateTenureInterestSaveData")
	public ResponseEntity<Map<String, Object>> calculateAndSaveLoan() {
		

		int tenure;
		double interestRate;
		if (loanAmount <= 100000) {
			tenure = 5;
			interestRate = 5.0;
		} else if (loanAmount <= 500000) {
			tenure = 12;
			interestRate = 6.0;
		} else if (loanAmount <= 1000000) {
			tenure = 24;
			interestRate = 7.0;
		} else if (loanAmount <= 5000000) {
			tenure = 36;
			interestRate = 8.0;
		} else {
			tenure = 48;
			interestRate = 9.0;
		}
		
		
		
		String loanValue = String.valueOf(loanAmount);
		

		
		
		
		Loan loan = new Loan();
		loan.setTenure(tenure);
		loan.setLoanAmount(loanValue);
		loan.setInterest(interestRate);
		String uanNumber = generateAccountNumber();
		loan.setUanNumber(uanNumber);
		loan.setLoanAccountNumber(loanAccountNumber);
		loan.setLoanStatus(loanStatus);

		Loan savedLoan = loanDetailsService.saveLoan(loan);

		Map<String, Object> response = new HashMap<>();
		response.put("loanId", savedLoan.getLoanId());
		response.put("loanAmount", savedLoan.getLoanAmount());
		response.put("tenure", savedLoan.getTenure());
		response.put("interestRate", savedLoan.getInterest());
		response.put("uanNumber", uanNumber);
		response.put("loanStatus", loanStatus);
		response.put("loanAccountNumber", loanAccountNumber);

		System.out.println(response);

		return ResponseEntity.ok(response);
	}
	
	private String uanNumber;

	private static final String BASE_NUMBER = "22507000000000";
	private long lastGeneratedNumber = Long.parseLong(BASE_NUMBER);

	private synchronized String generateAccountNumber() { // Make thread-safe
		lastGeneratedNumber += 1;
		uanNumber = String.format("%014d", lastGeneratedNumber);
		return uanNumber;
	}

	@CrossOrigin
	@GetMapping("/getEmailId")
	public String getEmail(@RequestParam String processInstanceId) {

		ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
		RuntimeService runtimeService = processEngine.getRuntimeService();

		emailIdData = (String) runtimeService.getVariable(processInstanceId, "emailId");

		System.out.println("Email ID: " + emailIdData);
		return emailIdData != null ? emailIdData : "Email ID not found!";
	}

	@CrossOrigin
	@GetMapping("/download-all-Files")
	public ResponseEntity<Resource> downloadAll() {
		try {
			Path zipFilePath = Paths.get("C:\\Users\\STS177\\Desktop").resolve("all-files.zip");

			try (FileOutputStream fos = new FileOutputStream(zipFilePath.toFile());
					ZipOutputStream zipOut = new ZipOutputStream(fos)) {

				File directory = new File("C:\\Users\\STS177\\Desktop");
				File[] files = directory.listFiles();
				if (files != null) {
					for (File file : files) {
						if (file.isFile()) {
							try (FileInputStream fis = new FileInputStream(file)) {
								ZipEntry zipEntry = new ZipEntry(file.getName());
								zipOut.putNextEntry(zipEntry);

								byte[] buffer = new byte[1024];
								int length;
								while ((length = fis.read(buffer)) >= 0) {
									zipOut.write(buffer, 0, length);
								}
							}
						}
					}
				}
			}
			Resource resource = new FileSystemResource(zipFilePath.toFile());
			return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"all-files.zip\"")
					.body(resource);

		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@CrossOrigin
	@GetMapping("/downloadFileByEmailId")
	public ResponseEntity<?> getJsonDataByEmailAndDownloadFile(@RequestParam String emailId)
			throws FileNotFoundException {
		List<LoanApplicantDetails> jsonDataOptional = loanApplicantDetailsRepository.findByEmailId(emailId);

		LoanApplicantDetails jsonData = jsonDataOptional.get(0);
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			JsonNode jsonNode = objectMapper.readTree(jsonData.getData());
			if (jsonNode.has("Files")) {
				JsonNode filesNode = jsonNode.path("Files").path("otherFiles");
				for (JsonNode fileNode : filesNode) {
					String fileName = fileNode.path("name").asText();
					String fileContent = fileNode.path("content").asText();

					Resource file = documentService.loadFileAsResource(fileName);
					System.out.println("File exists: " + file.exists() + ", isReadable: " + file.isReadable());

					if (file.exists() && file.isReadable()) {
						return ResponseEntity.ok()
								.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
								.contentType(MediaType.APPLICATION_OCTET_STREAM).body(file);
					} else {
						return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found: " + fileName);
					}
				}
			}
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No files found for this emailId.");
		} catch (JsonProcessingException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error parsing JSON data");
		}
	}

	@CrossOrigin
	@GetMapping("/updateStatusApproved")
	@Transactional
	public String updateStatus() {
		LoanApplicantDetails detail = loanApplicantDetailsRepository.findByLoanAccountNumber(loanAccountNumber);

		if (detail == null) {
			return "Loan applicant not found";
		}
		ObjectMapper objectMapper = new ObjectMapper();
		String validJsonString;
		try {
			ObjectNode jsonNode = objectMapper.createObjectNode();
			jsonNode.put("updated", detail.getData());
			validJsonString = objectMapper.writeValueAsString(jsonNode);
		} catch (Exception e) {
			return "Failed to generate JSON: " + e.getMessage();
		}
		loanApplicantDetailsRepository.updateLoanStatus(loanAccountNumber, "Approved", validJsonString);

		loanStatus = "Approved";

		return "Status updated successfully";
	}

	@CrossOrigin
	@GetMapping("/updateStatusDisbursed")
	@Transactional
	public String updateStatusDisbursed() {
		LoanApplicantDetails detail = loanApplicantDetailsRepository.findByLoanAccountNumber(loanAccountNumber);

		if (detail == null) {
			return "Loan applicant not found";
		}
		ObjectMapper objectMapper = new ObjectMapper();
		String validJsonString;
		try {
			ObjectNode jsonNode = objectMapper.createObjectNode();
			jsonNode.put("updated", detail.getData());
			validJsonString = objectMapper.writeValueAsString(jsonNode);
		} catch (Exception e) {
			return "Failed to generate JSON: " + e.getMessage();
		}
		loanApplicantDetailsRepository.updateLoanStatus(loanAccountNumber, "Disbursed", validJsonString);

		loanStatus = "Disbursed";

		return "Status updated successfully";
	}

	@CrossOrigin
	@PostMapping("/customerAcknowledgement")
		public ResponseEntity<String> customerAcknowledgement(@RequestBody String approval,@RequestParam String processInstanceId) throws JsonProcessingException {
			System.out.println("Received Approval Data: " + approval);
			ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
			TaskService taskService = processEngine.getTaskService();
			RuntimeService runtimeService = processEngine.getRuntimeService();
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode rootNode = objectMapper.readTree(approval);
			String finalDecision = rootNode.path("Customer").asText();
			
			if ("needClarification".equals(finalDecision)) {
				clarificationDetails = rootNode.path("clarificationDetails").asText();
			}
			System.out.println("Final Decision: " + finalDecision);
			System.out.println("Clarification Details: " + clarificationDetails);
			runtimeService.setVariable(processInstanceId, "Customer", finalDecision);
			if (!clarificationDetails.isEmpty()) {
				runtimeService.setVariable(processInstanceId, "clarificationDetails", clarificationDetails);
			}
			List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstanceId).active().list();
			Task task = tasks.get(0);
			taskId = task.getId();
			userId = task.getAssignee();
			System.out.println("Task ID: " + taskId);
			System.out.println("Assigned User: " + userId);
			taskService.claim(taskId, userId);
			System.out.println("Task claimed successfully by user: " + userId);
			taskService.complete(taskId);
			System.out.println("Task completed successfully.");
			return ResponseEntity.ok("Loan approval process completed successfully.");
		}
	
	@CrossOrigin
	@PostMapping("/ManagerEnd")
	public String ManagerEnd(@RequestParam String processInstanceId) throws Exception {

		ProcessEngine procssEngine = ProcessEngines.getDefaultProcessEngine();
		TaskService taskService = processEngine.getTaskService();
		RuntimeService runtimeService = processEngine.getRuntimeService();

		System.out.println(processInstanceId);

		Task task = taskService.createTaskQuery().processInstanceId(processInstanceId).singleResult();

			taskService.claim(task.getId(), "Demo");
		
		taskService.complete(task.getId());
		System.out.println("Task completed for processInstanceId: " + processInstanceId);
	
		return "task Completed Successfully";
		}
	
	@CrossOrigin
	@PostMapping("/CustomerMail")
	public String CustomerMail() {
		System.out.println("Sending email to: " + emailId);
		String to = emailId;
		String subject = "Loan Approval Confirmation";
		String body = "Congratulations! Your application has been deemed eligible for a loan. "
				+ "We have attached the disbursement details in the form. Once you acknowledge, we can proceed with account generation."
				+ "http://localhost:3002/#/LoanAmountDetails";
		System.out.println(body);
		emailService.sendSimpleEmail(to, subject, body);
		return "Email Sent Successfully";
	}
	@CrossOrigin
	@PostMapping("/emailSenderClarification")
	public String emailSenderClarification() throws JsonMappingException, JsonProcessingException {
		System.out.println(emailId);
		String to = emailId;
		String subject = "Clarification Needed";
		String body = "Dear Customer,\n\n"
				+ "We need additional clarification regarding your loan application. Specifically, we require the following details:\n"
				+ "- " + clarificationDetails + "\n\n" + "Please provide the necessary information by visiting the following link: "
				+ "http://localhost:3002/#/file\n\n" + "Thank you for your prompt attention to this matter.\n\n";
		System.out.println(body);
		emailService.sendSimpleEmail(to, subject, body);
		System.out.println("mail sent");
		
		return "mail Sent";
	}
	
	@CrossOrigin
	@GetMapping("/clarification")
	public Map clarificationDetails() {
		System.out.println(clarificationDetails);
		System.out.println(loanType);
		System.out.println(loanAccountNumber);
		Map<String,Object> customerReply = new HashMap<>();
		customerReply.put("loanType", loanType);
		customerReply.put("clarificationDetails", clarificationDetails);
		customerReply.put("loanAccountNumber", loanAccountNumber);
		
		return customerReply;
	}
	
	@CrossOrigin
	@PostMapping("/customerClarificationReply")
	public ResponseEntity<String> customerClarificationReply(@RequestBody Map<String, Object> requestData,@RequestParam String processInstanceId) throws IOException {
 
		List<Map<String, Object>> files = (List<Map<String, Object>>) requestData.get("files");
 
		ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
		TaskService taskService = processEngine.getTaskService();
		RuntimeService runtimeService = processEngine.getRuntimeService();
 
		List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstanceId).active().list();
		if (tasks.isEmpty()) {
			return ResponseEntity.badRequest().body("No active tasks found for the process instance.");
		}
 
		Task task = tasks.get(0);
		taskId = task.getId();
		userId = task.getAssignee();
 
		System.out.println("Task ID: " + taskId);
		System.out.println("Assigned User: " + userId);
 
		taskService.claim(taskId, userId);
		System.out.println("Task claimed successfully by user: " + userId);
 
		if (files != null && !files.isEmpty()) {
			for (Map<String, Object> fileData : files) {
				String fileName = (String) fileData.get("name");
				String fileContent = (String) fileData.get("content"); // Ensure the frontend sends base64 content
				documentService.storeFile(fileName, fileContent);
				System.out.println("Stored file: " + fileName);
			}
		}
		taskService.complete(taskId);
		System.out.println("Task completed successfully.");
 
		return ResponseEntity.ok("Task processed successfully");
	}
//	@CrossOrigin
//	@PostMapping("/emailSenderClarification")
//	public String emailSenderClarification() throws JsonMappingException, JsonProcessingException {
//		System.out.println(emailId);
//		System.out.println(content);
//		String to = emailId;
//		String subject = "Clarification Needed";
//		String body = "Dear Customer,\n\n"
//				+ "We need additional clarification regarding your loan application. Specifically, we require the following details:\n"
//				+ "- " + content + "\n\n" + "Please provide the necessary information by visiting the following link: "
//				+ "http://localhost:3002/#/file\n\n" + "Thank you for your prompt attention to this matter.\n\n";
//		System.out.println(body);
//		System.out.println("mail sent");
//		return "mail Sent";
//	}
//	
//	@CrossOrigin
//	@GetMapping("/clarification")
//	public String clarificationDetails() {
//		System.out.println(content);
//		String data = content;
//		return data;
//	}
//@CrossOrigin
//		@PostMapping("/save")
//		public LoantransactionDetails saveTranscation(@RequestBody LoantransactionDetails obj, @RequestParam String loanAccountNumber) {
//		    
//		    System.out.println("loan amount: " + obj.getDate());
//		    System.out.println("account"+obj.getLoanAccountNumber());
//		    LoantransactionDetails detail = new LoantransactionDetails();
//		    detail.setDate(obj.getDate());
//		    detail.setLoanAccountNumber(obj.getLoanAccountNumber());
//		    
//		    detail.setPaymentType(obj.getPaymentType());
//		    detail.setTransactionAmount(obj.getTransactionAmount());
//		    detail.setLoanAmount(obj.getLoanAmount());
//		    detail.setBalanceAmount(obj.getLoanAmount() - obj.getTransactionAmount());
//		    
//		    System.out.println("print"+loanAccountNumber);
//		    System.out.println("print1"+obj.getLoanAccountNumber());
//		    double balanceamount = detail.getBalanceAmount();
//		    
//		    String to = emailId;  
//		    String subject = "Loan Management Report";
//		    String body = "Dear User, please find the attached loan report details. Your paid amount is " + balanceamount;
//		    
//		    System.out.println("to--"+to);
//		    System.out.println("subject"+subject);
//		    
//		    emailService.sendSimpleEmail(to, subject, body);
//		    System.out.println("Email sent to: " + to);
//		    
//		    
//		    return rep.save(detail);
	
//		}
	
	@CrossOrigin
	@PostMapping("/save")
	public LoantransactionDetails saveTranscation(@RequestBody LoantransactionDetails obj, @RequestParam String loanAccountNumber) {
	    
		System.out.println(loanAccountNumber);
	    System.out.println("loan amount: " + obj.getDate());
	    System.out.println("account"+obj.getLoanAccountNumber());
	    LoantransactionDetails detail = new LoantransactionDetails();
	    detail.setDate(obj.getDate());
	    detail.setLoanAccountNumber(loanAccountNumber);
	    detail.setUanId(generateAccountNumber());
	    detail.setPaymentType(obj.getPaymentType());
	    detail.setTransactionAmount(obj.getTransactionAmount());
	    detail.setLoanAmount(obj.getLoanAmount());
	    detail.setBalanceAmount(obj.getLoanAmount() - obj.getTransactionAmount());
	    detail.setTransactionStatus("Completed");
	    System.out.println("print"+loanAccountNumber);
	    System.out.println("print1"+obj.getLoanAccountNumber());
	    double balanceamount = detail.getBalanceAmount();
	    LoanApplicantDetails loanDetail= loanApplicantDetailsRepository.findByLoanAccountNumber(loanAccountNumber);
	    
		System.out.println("json data-----"+loanDetail.getData());
		
//		loanDetail.setBalanceAmount(newBalanceAmount);
		loanApplicantDetailsRepository.saveJson(loanDetail.getData(), loanDetail.getEmailId(), loanAccountNumber, loanDetail.getCreatedDate(),
		        loanDetail.getLoanStatus(), loanDetail.getLoanType(), loanDetail.getLoanAmount(),
		        loanDetail.getApplicantName(), obj.getLoanAmount() - obj.getTransactionAmount(),loanDetail.getProcessInstanceId());
	 
		
		 loanApplicantDetailsRepository.delete(loanDetail);
//	    String to = "gayathriram9443@gmail.com";  
	    String to=emailId;
	    String subject = "Loan Management Report";
	    String body = "Dear User, please find the attached loan report details. Your paid amount is " + balanceamount;
	    
	    System.out.println("to--"+to);
	    System.out.println("subject"+subject);
	    emailService.sendSimpleEmail(to, subject, body);
	    
	    System.out.println("Email sent to: " + to);  
	    return rep.save(detail);
	}
	
	
//		@CrossOrigin
//	    @GetMapping("/getAllTransactions")
//	    public ResponseEntity<List<LoantransactionDetails>> getAllTransactionsByLoanAccountNumber(@RequestParam String loanAccountNumber) {
//	       
//	        List<LoantransactionDetails> loanTransactions =rep.findByLoanAccountNumber(loanAccountNumber);
//	        
//	        System.out.println("loan"+loanTransactions.toString());
//	        
//	        if (loanTransactions.isEmpty()) {
//	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Return 404 if no transactions found
//	        }
//	        
//	        System.out.println("loan"+loanTransactions.toString());
//	        return ResponseEntity.ok(loanTransactions);  // Return 200 OK with the list of transactions
//	    }
		
		

		
}
		