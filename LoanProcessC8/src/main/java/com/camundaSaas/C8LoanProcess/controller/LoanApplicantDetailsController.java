package com.camundaSaas.C8LoanProcess.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.camundaSaas.C8LoanProcess.AppConfig;
import com.camundaSaas.C8LoanProcess.JsonFileWriter;
import com.camundaSaas.C8LoanProcess.Repository.LoanApplicantRepository;
import com.camundaSaas.C8LoanProcess.Repository.LoanTransactionDetailsRepository;
import com.camundaSaas.C8LoanProcess.model.FileEntity;
import com.camundaSaas.C8LoanProcess.model.Loan;
import com.camundaSaas.C8LoanProcess.model.LoanApplicantDetails;
import com.camundaSaas.C8LoanProcess.model.LoanTransactionDetails;
import com.camundaSaas.C8LoanProcess.model.TaskDTO;
import com.camundaSaas.C8LoanProcess.service.EmailService;
import com.camundaSaas.C8LoanProcess.service.FileService;
import com.camundaSaas.C8LoanProcess.service.LoanApplicantService;
import com.camundaSaas.C8LoanProcess.service.LoanDetailsService;
import com.camundaSaas.C8LoanProcess.util.LoanCustomerUtilities;
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

import io.camunda.tasklist.CamundaTaskListClient;
import io.camunda.tasklist.auth.SaasAuthentication;
import io.camunda.tasklist.dto.Task;
import io.camunda.tasklist.dto.TaskState;
import io.camunda.tasklist.exception.TaskListException;
import io.camunda.zeebe.client.ZeebeClient;
import io.camunda.zeebe.client.api.response.ProcessInstanceEvent;

@RestController
@CrossOrigin
public class LoanApplicantDetailsController {

	@Autowired
	ZeebeClient zeebeClient;

	@Autowired
	LoanApplicantService loanApplicantService;

	@Autowired
	LoanApplicantRepository loanApplicantRepository;

	@Autowired
	ObjectMapper objectMapper;

	@Autowired
	EmailService emailService;

	@Autowired
	FileService fileService;

	@Autowired
	AppConfig appConfig;

	@Autowired
	private LoanDetailsService loanDetailsService;

	private Path uploadDirectory;

	@Autowired
	LoanTransactionDetailsRepository loantransactionDetailsRepository;

	@PostConstruct
	public void init() {
		uploadDirectory = Paths.get(appConfig.getFileSystemPath());
	}

	@Value("${camunda-env}")
	private String environment;

	@Value("${zeebe.client.security.plaintext:true}")
	private boolean isPlainText;

	@Value("${zeebe.client.cloud.client-id:}")
	private String cloudClientId;

	@Value("${zeebe.client.cloud.client-secret:}")
	private String cloudClientSecret;

	@Value("${zeebe.client.cloud.auth-server:}")
	private String cloudAuthServer;

	@Value("${zeebe.client.cloud.cluster-id:}")
	private String cloudClusterId;
	
	@Value("${zeebe.client.broker.gateway-address:}")
	private String brokerGatewayAddress;

	@Value("${zeebe.client.security.plaintext:true}")
	private boolean isSelfManaged;
	
	private static final String SELF_MANAGED_URL = "http://localhost:8083";
	private static final String SAAS_TASKLIST_URL = "https://bru-2.tasklist.camunda.io";
	private Map<String, Object> responseMap;
	private String emailId;
	private long loanAmount;
	private final Map<String, Object> loanResponseMap = new HashMap<>();
	private String loanAccountNumber;
	private String applicantName;
	String loanStatus = "Pending";
	private String processInstanceId;
	private JsonNode rootNode;
	String clarificationDetails = "";
	private String loanType;

	@CrossOrigin
	@PostMapping("/saveApplicantDetails")
	public ResponseEntity<Map<String, Object>> saveJson(@RequestBody String data) throws IOException {
		ProcessInstanceEvent processInstance = zeebeClient.newCreateInstanceCommand()
				.bpmnProcessId("Loan_Application_C8").latestVersion().send().join();
		processInstanceId = String.valueOf(processInstance.getProcessInstanceKey());
		rootNode = objectMapper.readTree(data);
		String dobString = rootNode.path("personalData").path("personalInfo").path("dob").asText();
		int age = calculateAgeFromDOB(dobString);
		double annualIncome = 0;
		if (rootNode.has("houseHold")) {
			annualIncome = rootNode.path("houseHold").path("annualIncome").asDouble();
		} else if (rootNode.has("employmentData")) {
			annualIncome = rootNode.path("employmentData").path("annualIncome").asDouble();
		}
		responseMap = new HashMap<>();
		responseMap.put("age", age);
		responseMap.put("annualIncome", annualIncome);
		emailId = rootNode.path("personalData").path("contactInfo").path("email").asText();
		applicantName = rootNode.path("personalData").path("personalInfo").path("legalFullName").asText();
		loanAmount = rootNode.path("bankDetails").path("loanAmount").asLong();
		loanType = rootNode.path("bankDetails").path("loanType").asText();
		loanAccountNumber = generateLoanAccountNumber();
		Timestamp createdDate = new Timestamp(System.currentTimeMillis());
		if (rootNode.has("Files")) {
			JsonNode filesNode = rootNode.path("Files").path("otherFiles");
			for (JsonNode fileNode : filesNode) {
				String fileName = fileNode.path("name").asText();
				String fileContent = fileNode.path("content").asText();
				// documentService.storeFile(fileName, fileContent);
			}
		}
		int rowsAffected = loanApplicantRepository.saveJson(data, emailId, loanAccountNumber, createdDate, loanStatus,
				loanType, loanAmount, applicantName, null, processInstanceId);
		LoanApplicantDetails savedApplicant = loanApplicantRepository.findTopByEmailIdOrderByCreatedDateDesc(emailId);
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
		zeebeClient.newSetVariablesCommand(processInstance.getProcessInstanceKey())
				.variables(Map.of("emailId", emailId, "applicantName", applicantName, "loanAmount", loanAmount,
						"loanType", loanType, "loanStatus", loanStatus, "loanAccountNumber", loanAccountNumber))
				.send().join();
		String subject = "Loan Application Submission Confirmation";
		String body = "Dear Applicant,\n\nYour loan application has been successfully submitted. We will process your request and update you shortly.\n\nThank you.";
		emailService.sendSimpleEmail(emailId, subject, body);
		return ResponseEntity.ok(applicationData);
	}

	private String generateLoanAccountNumber() {
		return String.format("%04d", new Random().nextInt(10000));
	}

	public int calculateAgeFromDOB(String dobString) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		LocalDate dob = LocalDate.parse(dobString, formatter);
		LocalDate currentDate = LocalDate.now();
		Period period = Period.between(dob, currentDate);
		return period.getYears();
	}

//	@GetMapping("/getAllActiveTasks")
//	public List<Task> getAllActiveTasks() throws TaskListException {
//	    String selfManagedTaskListUrl = "http://localhost:8083";
//	    SimpleAuthentication simpleAuthentication = new SimpleAuthentication("demo", "demo");
//	    CamundaTaskListClient client = new CamundaTaskListClient.Builder()
//	            .taskListUrl(selfManagedTaskListUrl)
//	            .shouldReturnVariables()
//	            .authentication(simpleAuthentication)
//	            .build();
//	    List<Task> createdTasks = client.getTasks(true, TaskState.CREATED, 50, true);
//	    List<Task> activeTasks = new ArrayList<>();
//	    activeTasks.addAll(createdTasks);
//	    System.out.println("Active Tasks: " + activeTasks);
//	    return activeTasks;
//	}
//
//	@GetMapping("/getTaskById/{taskId}")
//	public Task getTaskById(@PathVariable String taskId) throws TaskListException {
//		String selfManagedTaskListUrl = "http://localhost:8083";
//		SimpleAuthentication simpleAuthentication = new SimpleAuthentication("demo", "demo");
//		CamundaTaskListClient client = new CamundaTaskListClient.Builder().taskListUrl(selfManagedTaskListUrl)
//				.shouldReturnVariables().authentication(simpleAuthentication).build();
//		Task task = client.getTask(taskId);
//		System.out.println("Task Details: " + task);
//		return task;
//	}
	@CrossOrigin
	@GetMapping("/getAllTransaction")
	public List<Map<String, Object>> getAllTransaction() {
		List<LoanTransactionDetails> loantransactionDetails = loantransactionDetailsRepository.findAll();
		List<Map<String, Object>> transactionList = new ArrayList<>();
		for (LoanTransactionDetails details : loantransactionDetails) {
			Map<String, Object> map = new HashMap<>();
			map.put("accountNumber", details.getLoanAccountNumber());
			map.put("balanceAmount", details.getBalanceAmount());
			transactionList.add(map);
		}
		return transactionList;
	}

	// cGetActiveFromSaas
	@GetMapping("/getActivedTaskList1")
	public List<Task> getActivedTaskList1() throws TaskListException {
		SaasAuthentication sa = new SaasAuthentication("U_L~ogg51nWrF_z4fLbAVFQS3aZ~GQIB",
				"2NKLsUvxfCy7B83YD5GTlo4Vw~pKwzgQd72n9_U4NpYUbpPlghYQ_ttg8y3KYCKh");
		CamundaTaskListClient client = new CamundaTaskListClient.Builder()
				.taskListUrl("https://bru-2.tasklist.camunda.io/1a8d8e18-4054-4bd2-afad-6f2adf8c58b8")
				.shouldReturnVariables().authentication(sa).build();
		List<Task> taskdtoList = client.getTasks(true, TaskState.CREATED, 50, true);
		return client.getTasks(true, TaskState.CREATED, 50, true);
	}

//	@CrossOrigin
//	@GetMapping("/ManagerEnd")
//	public Map<String, Object> managerEnd() throws TaskListException {
//		// Get active tasks
//		ResponseEntity<List<TaskDTO>> resp = getActiveTasks();
// 
//		// Extract task IDs from the task list
//		List<String> taskIds = resp.getBody().stream().map(TaskDTO::getTaskId).collect(Collectors.toList());
// 
//Map<String,Object> map = new HashMap<>();
//map.put("taskIds", taskIds);
//CamundaTaskListClient client = LoanCustomerUtilities.getClient(cloudClientId, cloudClientSecret, cloudClusterId,
//        SELF_MANAGED_URL, SAAS_TASKLIST_URL);
//
//LoanCustomerUtilities.completeTask(client, taskIds.get(0));
//
//		return map;
//	}
	@CrossOrigin
	@GetMapping("/ManagerEnd")
	public Map<String, Object> managerEnd() throws TaskListException {
		ResponseEntity<List<TaskDTO>> resp = getActiveTasksManager();
		List<String> taskIds = resp.getBody() != null
				? resp.getBody().stream().map(TaskDTO::getTaskId).collect(Collectors.toList())
				: new ArrayList<>();
		Map<String, Object> customerReply = new HashMap<>();
		customerReply.put("taskIds", taskIds);
		CamundaTaskListClient client = LoanCustomerUtilities.getClient(cloudClientId, cloudClientSecret, cloudClusterId,
				SELF_MANAGED_URL, SAAS_TASKLIST_URL);
		for (String taskId : taskIds) {
			LoanCustomerUtilities.completeTask(client, taskId);
		}
		return customerReply;
	}

	public ResponseEntity<List<TaskDTO>> getActiveTasksManager() throws TaskListException {
		String user = "Manager";
		System.out.println("user: " + user);

		SaasAuthentication sa = new SaasAuthentication("U_L~ogg51nWrF_z4fLbAVFQS3aZ~GQIB",
				"2NKLsUvxfCy7B83YD5GTlo4Vw~pKwzgQd72n9_U4NpYUbpPlghYQ_ttg8y3KYCKh");

		CamundaTaskListClient client = new CamundaTaskListClient.Builder()
				.taskListUrl("https://bru-2.tasklist.camunda.io/1a8d8e18-4054-4bd2-afad-6f2adf8c58b8")
				.shouldReturnVariables().authentication(sa).build();

		List<Task> userTasks = client.getTasks(true,
				TaskState.CREATED, 
				50,
				true 
		).stream().filter(task -> user.equals(task.getAssignee())).collect(Collectors.toList());

		System.out.println("Task Assignees: " + userTasks.stream().map(Task::getAssignee).collect(Collectors.toList()));

		Map<String, Object> clarificationData = getClarificationDetails(); 

		List<TaskDTO> taskDTOs = userTasks.stream().map(task -> {

			LoanApplicantDetails loanDetails = loanApplicantRepository.findByProcessInstanceId(processInstanceId);
			if (loanDetails == null) {
				System.out.println("No loan details found for processInstanceId: " + processInstanceId);
				loanDetails = new LoanApplicantDetails();
			} else {
				System.out.println("Loan details found: " + loanDetails);
			}
			return new TaskDTO(task.getId(), task.getName(), task.getAssignee(), processInstanceId,
					task.getCreationTime(), loanDetails);
		}).collect(Collectors.toList());

		return ResponseEntity.ok(taskDTOs);
	}

	@CrossOrigin
	@GetMapping("/calculateTenureInterest")
	public Map<String, Object> calculateTenureAndInterest() throws TaskListException {
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

		ResponseEntity<List<TaskDTO>> resp = getActiveTasks();

		List<String> taskIds = resp.getBody().stream().map(TaskDTO::getTaskId).collect(Collectors.toList());
		Map<String, Object> customerReply = getClarificationDetails();
		customerReply.put("taskIds", taskIds);

		loanResponseMap.put("customerReply", customerReply);
		loanResponseMap.put("taskIds", taskIds);
		return loanResponseMap;
	}

	@CrossOrigin
	@GetMapping("/getActiveTask")
	public ResponseEntity<List<TaskDTO>> getActiveTask(@RequestParam String user) throws TaskListException {

		System.out.println("user" + user);
		SaasAuthentication sa = new SaasAuthentication("U_L~ogg51nWrF_z4fLbAVFQS3aZ~GQIB",
				"2NKLsUvxfCy7B83YD5GTlo4Vw~pKwzgQd72n9_U4NpYUbpPlghYQ_ttg8y3KYCKh");

		CamundaTaskListClient client = new CamundaTaskListClient.Builder()
				.taskListUrl("https://bru-2.tasklist.camunda.io/1a8d8e18-4054-4bd2-afad-6f2adf8c58b8")
				.shouldReturnVariables().authentication(sa).build();

		List<Task> userTasks = client.getTasks(true, TaskState.CREATED, 50, true).stream()
				.filter(task -> user.equals(task.getAssignee())).collect(Collectors.toList());
		System.out.println("Task Assignees: " + userTasks.stream().map(Task::getAssignee).collect(Collectors.toList()));

		List<TaskDTO> taskDTOs = userTasks.stream().map(task -> {

			LoanApplicantDetails loanDetails = loanApplicantRepository.findByProcessInstanceId(processInstanceId);

			if (loanDetails == null) {
				System.out.println("No loan details found for processInstanceId: " + processInstanceId);
				loanDetails = new LoanApplicantDetails();
			} else {
				System.out.println("Loan details found: " + loanDetails);
			}

			return new TaskDTO(task.getId(), task.getName(), task.getAssignee(), processInstanceId,
					task.getCreationTime(), loanDetails);
		}).collect(Collectors.toList());

		return ResponseEntity.ok(taskDTOs);
	}

	// initial
	@CrossOrigin
	@PostMapping("/InitialApprover")
	public ResponseEntity<String> handleLoanApproval(@RequestBody String approval,
			@RequestParam String processInstanceId, @RequestParam String id) throws Exception { 
		System.out.println(processInstanceId);
		System.out.println("Received Approval Data: " + approval);
		System.out.println("Received Task ID: " + id);
		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode rootNode = objectMapper.readTree(approval);
		String assignee = rootNode.path("InitialApprover").asText().trim();
		System.out.println("Assignee: " + assignee);
		zeebeClient.newSetVariablesCommand(Long.parseLong(processInstanceId))
				.variables(Map.of("InitialApprover", assignee)).send().join();
		System.out.println("Process variable 'InitialApprover' set successfully.");
		CamundaTaskListClient client = LoanCustomerUtilities.getClient(cloudClientId, cloudClientSecret, cloudClusterId,
				SELF_MANAGED_URL, SAAS_TASKLIST_URL);
		LoanCustomerUtilities.completeTask(client, id);
		return ResponseEntity.ok("Task " + id + " completed successfully.");
	}

//approvers
	@CrossOrigin
	@PostMapping("/UnderWriter")
	public ResponseEntity<String> UnderWriterApprover(@RequestBody String approval,
			@RequestParam String id) throws Exception {
		System.out.println("Received Approval Data: " + approval);
		System.out.println("Received Task ID: " + id);
		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode rootNode = objectMapper.readTree(approval);
		String finalDecision = rootNode.path("Decision").asText().trim();
		if ("needClarification".equals(finalDecision)) {
			clarificationDetails = rootNode.path("clarificationDetails").asText("");
		}
		System.out.println("Final Decision: " + finalDecision);
		System.out.println("Clarification Details: " + clarificationDetails);
		Map<String, Object> variables = new HashMap<>();
		variables.put("Decision", finalDecision);
		if (!clarificationDetails.isEmpty()) {
			variables.put("clarificationDetails", clarificationDetails);
		}
		System.out.println(variables);
		zeebeClient.newSetVariablesCommand(Long.parseLong(processInstanceId)).variables(variables).send().join();
		System.out.println("Process variables set successfully.");
		CamundaTaskListClient client = LoanCustomerUtilities.getClient(cloudClientId, cloudClientSecret, cloudClusterId,
				SELF_MANAGED_URL, SAAS_TASKLIST_URL);
		LoanCustomerUtilities.completeTask(client, id);
		System.out.println("Task " + id + " completed successfully.");
		return ResponseEntity.ok("UnderWriter decision processed and task completed successfully.");
	}

	@CrossOrigin
	@PostMapping("/LegalApprover")
	public ResponseEntity<String> LegalApprover(@RequestBody String approval, @RequestParam String processInstanceId,
			@RequestParam String id) throws Exception {

		System.out.println("Received Approval Data: " + approval);
		System.out.println("Received Process Instance ID: " + processInstanceId);
		System.out.println("Received Task ID: " + id);
		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode rootNode = objectMapper.readTree(approval);
		String finalDecision = rootNode.path("Decision").asText().trim();

		if ("needClarification".equals(finalDecision)) {
			clarificationDetails = rootNode.path("clarificationDetails").asText("");
		}
		System.out.println("Final Decision: " + finalDecision);
		System.out.println("Clarification Details: " + clarificationDetails);
		Map<String, Object> variables = new HashMap<>();
		variables.put("Decision", finalDecision);

		if (!clarificationDetails.isEmpty()) {
			variables.put("clarificationDetails", clarificationDetails);
		}

		zeebeClient.newSetVariablesCommand(Long.parseLong(processInstanceId)).variables(variables).send().join();
		System.out.println("Process variables set successfully.");

		CamundaTaskListClient client = LoanCustomerUtilities.getClient(cloudClientId, cloudClientSecret, cloudClusterId,
				SELF_MANAGED_URL, SAAS_TASKLIST_URL);
		LoanCustomerUtilities.completeTask(client, id);
		System.out.println("Task " + id + " completed successfully.");

		return ResponseEntity.ok("Legal approval process completed successfully.");
	}

//clarification

	@CrossOrigin
	@GetMapping("/clarification")
	public Map<String, Object> clarificationDetails() throws TaskListException {
		ResponseEntity<List<TaskDTO>> resp = getActiveTasks();
		List<String> taskIds = resp.getBody().stream().map(TaskDTO::getTaskId).collect(Collectors.toList());
		Map<String, Object> customerReply = getClarificationDetails();
		customerReply.put("taskIds", taskIds);
		return customerReply;
	}
	private Map<String, Object> getClarificationDetails() {
		System.out.println(clarificationDetails);
		System.out.println(loanType);
		System.out.println(loanAccountNumber);
		System.out.println(emailId);
		Map<String, Object> customerReply = new HashMap<>();
		customerReply.put("loanType", loanType);
		customerReply.put("clarificationDetails", clarificationDetails);
		customerReply.put("loanAccountNumber", loanAccountNumber);
		customerReply.put("emailId", emailId);
		return customerReply;
	}

// Updated getActiveTask method
	public ResponseEntity<List<TaskDTO>> getActiveTasks() throws TaskListException {
		String user = "customer";
		System.out.println("user: " + user);
		SaasAuthentication sa = new SaasAuthentication("U_L~ogg51nWrF_z4fLbAVFQS3aZ~GQIB",
				"2NKLsUvxfCy7B83YD5GTlo4Vw~pKwzgQd72n9_U4NpYUbpPlghYQ_ttg8y3KYCKh");
		CamundaTaskListClient client = new CamundaTaskListClient.Builder()
				.taskListUrl("https://bru-2.tasklist.camunda.io/1a8d8e18-4054-4bd2-afad-6f2adf8c58b8")
				.shouldReturnVariables().authentication(sa).build();
		List<Task> userTasks = client.getTasks(true,
				TaskState.CREATED, 
				50, 
				true 
		).stream().filter(task -> user.equals(task.getAssignee())).collect(Collectors.toList());
		System.out.println("Task Assignees: " + userTasks.stream().map(Task::getAssignee).collect(Collectors.toList()));
		Map<String, Object> clarificationData = getClarificationDetails(); // Get clarification details
		List<TaskDTO> taskDTOs = userTasks.stream().map(task -> {
			LoanApplicantDetails loanDetails = loanApplicantRepository.findByProcessInstanceId(processInstanceId);
			if (loanDetails == null) {
				System.out.println("No loan details found for processInstanceId: " + processInstanceId);
				loanDetails = new LoanApplicantDetails();
			} else {
				System.out.println("Loan details found: " + loanDetails);
			}
			return new TaskDTO(task.getId(), task.getName(), task.getAssignee(), processInstanceId,
					task.getCreationTime(), loanDetails);
		}).collect(Collectors.toList());
		return ResponseEntity.ok(taskDTOs);
	}

//	@GetMapping("/clarification")
//	public Map clarificationDetails() {
//		System.out.println(clarificationDetails);
//		System.out.println(loanType);
//		System.out.println(loanAccountNumber);
//		System.out.println(emailId);
//		
//		Map<String, Object> customerReply = new HashMap<>();
//		customerReply.put("loanType", loanType);
//		customerReply.put("clarificationDetails", clarificationDetails);
//		customerReply.put("loanAccountNumber", loanAccountNumber);
//		customerReply.put("emailId", emailId);
//		
//		return customerReply;
//	}
	@CrossOrigin
	@PostMapping("/clarification/{taskId}")
	public ResponseEntity<String> clarificationTask(@PathVariable String taskId) throws TaskListException {
		CamundaTaskListClient client = LoanCustomerUtilities.getClient(cloudClientId, cloudClientSecret, cloudClusterId,
				SELF_MANAGED_URL, SAAS_TASKLIST_URL);
		LoanCustomerUtilities.completeTask(client, taskId);
		return ResponseEntity.ok("Task " + taskId + " completed successfully.");
	}

	// complete
	@PostMapping("/completeTask/{taskId}")
	public ResponseEntity<String> completeTask(@PathVariable String taskId) throws TaskListException {
		CamundaTaskListClient client = LoanCustomerUtilities.getClient(cloudClientId, cloudClientSecret, cloudClusterId,
				SELF_MANAGED_URL, SAAS_TASKLIST_URL);
		LoanCustomerUtilities.completeTask(client, taskId);
		return ResponseEntity.ok("Task " + taskId + " completed successfully.");
	}

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
	@GetMapping("/getApplicantDetails")
	public List<JsonNode> getAllApplicantData() {
		List<JsonNode> response = new ArrayList<>();
		ObjectMapper objectMapper = new ObjectMapper();
		List<LoanApplicantDetails> jsonDataList = loanApplicantRepository.findAll();
		for (LoanApplicantDetails jsonData : jsonDataList) {
			try {
				JsonNode dataNode = objectMapper.readTree(jsonData.getData());
				ObjectNode combinedNode = objectMapper.createObjectNode();
				combinedNode.put("id", jsonData.getId());
				combinedNode.put("emailId", jsonData.getEmailId());
				combinedNode.put("loanAccountNumber", jsonData.getLoanAccountNumber());
				combinedNode.put("createdDate",jsonData.getCreatedDate() != null ? jsonData.getCreatedDate().toString() : null);
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

	@CrossOrigin
	@GetMapping("/getApplicantDataByAccount/{loanAccountNumber}")
	public LoanApplicantDetails getApplicantDataByAccount(@PathVariable String loanAccountNumber) {
		LoanApplicantDetails jsonData = loanApplicantRepository.findByLoanAccountNumber(loanAccountNumber);
		return jsonData;
	}

	@CrossOrigin
	@GetMapping("/getApplicantData/{id}")
	public ResponseEntity<JsonNode> getApplicantData(@PathVariable Long id) {
		Optional<LoanApplicantDetails> jsonData = loanApplicantRepository.findById(id);
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
	@PostMapping("/emailSenderClarification")
	public String emailSenderClarification() throws JsonMappingException, JsonProcessingException {
		String to = emailId;
		String subject = "Clarification Needed";
		String body = "Dear Customer,\n\n"
				+ "We need additional clarification regarding your loan application. Specifically, we require the following details:\n"
				 + "- " + clarificationDetails + "\n\n"
				+ "Please provide the necessary information by visiting the following link: "
				+ "http://localhost:3003/#/file\n\n" + "Thank you for your prompt attention to this matter.\n\n";
		System.out.println(body);
		System.out.println(to);
		emailService.sendSimpleEmail(to, subject, body);
		System.out.println("mail sent");
		return "mail Sent";
	}

	@CrossOrigin
	@PostMapping("/emailSenderApproval")
	public String emailSenderApproval() {
		System.out.println("Sending email to: " + emailId);
		String to = emailId;
		String subject = "Loan Approval Confirmation";
		String body = "Congratulations! Your application has been deemed eligible for a loan. "
				+ "We have attached the disbursement details in the form. Once you acknowledge, we can proceed with account generation."
				+ "http://localhost:3003/#/LoanAmountDetails";
		System.out.println(body);
		emailService.sendSimpleEmail(to, subject, body);
		return "Email Sent Successfully";
	}

	@CrossOrigin
	@PostMapping("/emailSenderRejection")
	public String emailSenderRejection() {
		System.out.println("Sending email to: " + emailId);
		String to = emailId;
		String subject = "Loan Application Status";
		String body = "We regret to inform you that your loan application has not been approved. "
				+ "Please contact our support team for further details.";
		System.out.println(body);
		emailService.sendSimpleEmail(to, subject, body);
		return "Email Sent Successfully";
	}

	@CrossOrigin
	@PostMapping("/upload")
	public ResponseEntity<List<FileEntity>> uploadFiles(@RequestParam("file") List<MultipartFile> file,
			@RequestParam("documentCategory") String documentCategory, @RequestParam("emailId") String emailId)
			throws IOException {
		List<FileEntity> savedFiles = new ArrayList<>();
		for (MultipartFile file1 : file) {
			FileEntity savedFile = fileService.saveFile(file1, documentCategory, emailId);
			savedFiles.add(savedFile);
		}
		return ResponseEntity.ok(savedFiles);
	}

	@CrossOrigin
	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteFile(@RequestParam("documentCategory") String documentCategory,
			@RequestParam("emailId") String emailId) throws IOException {
		boolean isDeleted = fileService.deleteFileByCategory(documentCategory, emailId);
		if (isDeleted) {
			return ResponseEntity.ok("File corresponding to the category deleted successfully.");
		} else {
			return ResponseEntity.status(404).body("No file found to delete for the provided category.");
		}
	}

	@CrossOrigin
	@GetMapping("/download/{id}")
	public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
		try {
			Resource resource = fileService.downloadFileById(id);
			return ResponseEntity.ok()
					.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
					.body(resource);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@CrossOrigin
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteFile(@PathVariable Long id) {
		boolean isDeleted = fileService.deleteFileById(id);
		if (isDeleted) {
			return ResponseEntity.ok("File with ID " + id + " deleted successfully.");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File with ID " + id + " not found.");
		}
	}

	@CrossOrigin
	@DeleteMapping("/deleteMultiple")
	public ResponseEntity<String> deleteMultipleFiles(@RequestParam("documentCategory") String documentCategory,
			@RequestParam("emailId") String emailId) {
		boolean isDeleted = fileService.deleteFilesByCategoryAndEmail(emailId, documentCategory);
		if (isDeleted) {
			return ResponseEntity.ok("All files corresponding to the category and emailId deleted successfully.");
		} else {
			return ResponseEntity.status(404).body("No files found to delete for the provided category and emailId.");
		}
	}

	@CrossOrigin
	@GetMapping("/downloadEmail")
	public ResponseEntity<Resource> downloadFilesByEmail(@RequestParam("emailId") String emailId) throws IOException {
		List<FileEntity> fileEntities = fileService.getFilesByEmail(emailId);
		if (fileEntities.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
		Path tempDir = Paths.get(appConfig.getFileSystemPath());
		if (!Files.exists(tempDir)) {
			Files.createDirectories(tempDir);
		}
		Path tempZip = Files.createTempFile(tempDir, "files-", ".zip");
		if (Files.exists(tempZip)) {
			Files.delete(tempZip);
		}
		URI zipUri = URI.create("jar:file:" + tempZip.toUri().getPath());
		try (FileSystem zipFs = FileSystems.newFileSystem(zipUri, Map.of("create", "true"))) {
			for (FileEntity fileEntity : fileEntities) {
				Path sourcePath = Paths.get(fileEntity.getFilepath());
				if (Files.exists(sourcePath) && Files.isReadable(sourcePath)) {
					Path destinationPath = zipFs.getPath("/" + fileEntity.getFileName());
					Files.copy(sourcePath, destinationPath, StandardCopyOption.REPLACE_EXISTING);
				}
			}
		} catch (IOException e) {
			Files.deleteIfExists(tempZip);
			throw e;
		}
		Resource resource = new UrlResource(tempZip.toUri());
		return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM)
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"files.zip\"").body(resource);
	}

	@CrossOrigin
	@GetMapping("/download-all")
	public ResponseEntity<Resource> downloadAllFiles() {
		try {
			Path uploadDirectory = Paths.get(appConfig.getFileSystemPath()).resolve("all-files.zip");
			try (FileOutputStream fos = new FileOutputStream(uploadDirectory.toFile());
					ZipOutputStream zipOut = new ZipOutputStream(fos)) {
				File directory = new File(appConfig.getFileSystemPath());
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
			Resource resource = new FileSystemResource(uploadDirectory.toFile());
			return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"all-files.zip\"")
					.body(resource);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@CrossOrigin
	@PostMapping("/save")
	public LoanTransactionDetails saveTranscation(@RequestBody LoanTransactionDetails obj,
			@RequestParam String loanAccountNumber) {
		System.out.println(loanAccountNumber);
		System.out.println("loan amount: " + obj.getDate());
		System.out.println("account" + obj.getLoanAccountNumber());
		LoanTransactionDetails detail = new LoanTransactionDetails();
		detail.setDate(obj.getDate());
		detail.setLoanAccountNumber(loanAccountNumber);
		detail.setUanId(generateAccountNumber());
		detail.setPaymentType(obj.getPaymentType());
		detail.setTransactionAmount(obj.getTransactionAmount());
		detail.setLoanAmount(obj.getLoanAmount());
		detail.setBalanceAmount(obj.getLoanAmount() - obj.getTransactionAmount());
		detail.setTransactionStatus("Completed");
		System.out.println("print" + loanAccountNumber);
		System.out.println("print1" + obj.getLoanAccountNumber());
		double balanceamount = detail.getBalanceAmount();
		LoanApplicantDetails loanDetail = loanApplicantRepository.findByLoanAccountNumber(loanAccountNumber);
		System.out.println("json data-----" + loanDetail.getData());
		loanApplicantRepository.saveJson(loanDetail.getData(), loanDetail.getEmailId(), loanAccountNumber,
				loanDetail.getCreatedDate(), loanDetail.getLoanStatus(), loanDetail.getLoanType(),
				loanDetail.getLoanAmount(), loanDetail.getApplicantName(),
				obj.getLoanAmount() - obj.getTransactionAmount(), loanDetail.getProcessInstanceId());
		loanApplicantRepository.delete(loanDetail);
		String to = emailId;
		String subject = "Loan Management Report";
		String body = "Dear User, please find the attached loan report details. Your paid amount is " + balanceamount;
		System.out.println("to--" + to);
		System.out.println("subject" + subject);
		emailService.sendSimpleEmail(to, subject, body);

		System.out.println("Email sent to: " + to);
		return loantransactionDetailsRepository.save(detail);
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
	@GetMapping("/loans/pdf")
	public ResponseEntity<String> generateLoanPdf() {
		List<Loan> loans = loanDetailsService.getAllLoans();
		try {
			String uploadDirectory = appConfig.getLoanPdfPath();
			PdfWriter writer = new PdfWriter(uploadDirectory);
			PdfDocument pdf = new PdfDocument(writer);
			Document document = new Document(pdf);
			document.add(new Paragraph("Loan Management Report").setTextAlignment(TextAlignment.CENTER).setFontSize(22)
					.setBold().setMarginBottom(20).setFontColor(ColorConstants.DARK_GRAY));
			float[] columnWidths = { 1f, 2f, 2f, 2f, 1f, 1f, 2f };
			Table table = new Table(columnWidths);
			table.addCell(createStyledHeaderCell("Loan ID"));
			table.addCell(createStyledHeaderCell("UAN Number"));
			table.addCell(createStyledHeaderCell("Loan Account Number"));
			table.addCell(createStyledHeaderCell("Loan Amount"));
			table.addCell(createStyledHeaderCell("Tenure"));
			table.addCell(createStyledHeaderCell("Interest"));
			table.addCell(createStyledHeaderCell("Loan Status"));
			for (Loan loan : loans) {
				table.addCell(createStyledCell(String.valueOf(loan.getLoanId())));
				table.addCell(createStyledCell(loan.getUanNumber()));
				table.addCell(createStyledCell(loan.getLoanAccountNumber()));
				table.addCell(createStyledCell(loan.getLoanAmount()));
				table.addCell(createStyledCell(String.valueOf(loan.getTenure())));
				table.addCell(createStyledCell(String.valueOf(loan.getInterest())));
				table.addCell(createStyledCell(loan.getLoanStatus()));
			}
			document.add(table);
			document.add(new Paragraph("\nReport generated on: " + LocalDate.now())
					.setTextAlignment(TextAlignment.RIGHT).setFontSize(8).setFontColor(ColorConstants.GRAY));
			document.close();
			return ResponseEntity.ok("PDF report has been successfully generated at: " + uploadDirectory);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Error generating PDF report.");
		}
	}

	private Cell createStyledCell(String content) {
		Paragraph paragraph = new Paragraph(content).setTextAlignment(TextAlignment.CENTER).setFontSize(10);
		return new Cell().add(paragraph).setBackgroundColor(ColorConstants.WHITE).setFontColor(ColorConstants.BLACK)
				.setPadding(5);
	}

	private Cell createStyledHeaderCell(String content) {
		Paragraph paragraph = new Paragraph(content).setTextAlignment(TextAlignment.CENTER).setFontSize(12).setBold();
		return new Cell().add(paragraph).setBackgroundColor(ColorConstants.BLUE).setFontColor(ColorConstants.WHITE)
				.setPadding(10);
	}

	@CrossOrigin
	@PostMapping("/customerAcknowledgement/{taskId}")
	public Map<String, Object> customerAcknowledgement(@RequestBody String approval, @PathVariable String taskId)
			throws Exception {
		Map<String, Object> customerReply = new HashMap<>();
		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode rootNode = objectMapper.readTree(approval);
		String assignee = rootNode.path("customer").asText().trim();
		System.out.println("Assigning task to: " + assignee);
		zeebeClient.newSetVariablesCommand(Long.parseLong(processInstanceId)).variables(Map.of("customer", assignee))
				.send().join();
		CamundaTaskListClient client = LoanCustomerUtilities.getClient(cloudClientId, cloudClientSecret, cloudClusterId,
				SELF_MANAGED_URL, SAAS_TASKLIST_URL);
		LoanCustomerUtilities.completeTask(client, taskId);
		System.out.println("Process variable 'Customer' set successfully.");
		return customerReply;
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

	@CrossOrigin
	@GetMapping("/updateStatusApproved")
	@Transactional
	public String updateStatus() {
		LoanApplicantDetails detail = loanApplicantRepository.findByLoanAccountNumber(loanAccountNumber);
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
		loanApplicantRepository.updateLoanStatus(loanAccountNumber, "Approved", validJsonString);
		loanStatus = "Approved";
		return "Status updated successfully";
	}

	@CrossOrigin
	@GetMapping("/updateStatusDisbursed")
	@Transactional
	public String updateStatusDisbursed() {
		LoanApplicantDetails detail = loanApplicantRepository.findByLoanAccountNumber(loanAccountNumber);
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
		loanApplicantRepository.updateLoanStatus(loanAccountNumber, "Disbursed", validJsonString);
		loanStatus = "Disbursed";
		return "Status updated successfully";
	}
	
	@CrossOrigin
	@GetMapping("/updateStatusClosed")
	@Transactional
	public String updateStatusClosed() {
		LoanApplicantDetails detail = loanApplicantRepository.findByLoanAccountNumber(loanAccountNumber);

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
		loanApplicantRepository.updateLoanStatus(loanAccountNumber, "Closed", validJsonString);

		loanStatus = "Closed";

		return "Status updated successfully";
	}
	
	@GetMapping("/getAssignedTaskByAssignee/{assigneeName}")
	public List<Task> getAssignedTaskByAssignee(@PathVariable String assigneeName) throws TaskListException {
		SaasAuthentication sa = new SaasAuthentication("U_L~ogg51nWrF_z4fLbAVFQS3aZ~GQIB",
				"2NKLsUvxfCy7B83YD5GTlo4Vw~pKwzgQd72n9_U4NpYUbpPlghYQ_ttg8y3KYCKh");
		CamundaTaskListClient client = new CamundaTaskListClient.Builder().authentication(sa)
				.taskListUrl("https://bru-2.tasklist.camunda.io/1a8d8e18-4054-4bd2-afad-6f2adf8c58b8") // taskList URL
				.build();
		System.out.println("Client Initialized: " + client);
		List<Task> assigneeTasks = client.getAssigneeTasks(assigneeName, TaskState.CREATED, 50, true);
		System.out.println("Active tasks: " + assigneeTasks);
		return assigneeTasks;
	}

	@CrossOrigin
	@GetMapping("/getAssignedTask/{processName}/{adminName}")
	public List<Map<String, Object>> getAssignedTask(@PathVariable String processName, @PathVariable String adminName)
			throws TaskListException {
		SaasAuthentication sa = new SaasAuthentication("U_L~ogg51nWrF_z4fLbAVFQS3aZ~GQIB",
				"2NKLsUvxfCy7B83YD5GTlo4Vw~pKwzgQd72n9_U4NpYUbpPlghYQ_ttg8y3KYCKh");
		CamundaTaskListClient client = new CamundaTaskListClient.Builder().authentication(sa)
				.taskListUrl("https://bru-2.tasklist.camunda.io/1a8d8e18-4054-4bd2-afad-6f2adf8c58b8/").build();
		List<Task> assigneeTasks = client.getAssigneeTasks(adminName, TaskState.CREATED, 50, true);
		return assigneeTasks.stream()
				.map(task -> task.getVariables().stream()
						.collect(Collectors.toMap(var -> var.getName(), var -> var.getValue())))
				.collect(Collectors.toList());
	}

	@GetMapping("/getAssignedTaskUnderWriter/{processName}/{adminName}")
	public List<Task> getAssignedTaskUnderWriter(@PathVariable String processName, @PathVariable String adminName)
			throws TaskListException {
		SaasAuthentication sa = new SaasAuthentication("U_L~ogg51nWrF_z4fLbAVFQS3aZ~GQIB",
				"2NKLsUvxfCy7B83YD5GTlo4Vw~pKwzgQd72n9_U4NpYUbpPlghYQ_ttg8y3KYCKh");
		CamundaTaskListClient client = new CamundaTaskListClient.Builder().authentication(sa)
				.taskListUrl("https://bru-2.tasklist.camunda.io/1a8d8e18-4054-4bd2-afad-6f2adf8c58b8/").build();
		List<Task> assigneeTasks = client.getAssigneeTasks(adminName, TaskState.CREATED, 50, true);
		JsonFileWriter.writeTasksToJsonFile(assigneeTasks);
		return assigneeTasks;
	}

	@GetMapping("/data")
	public Map<String, Object> getTaskVariablesJson() {
		Map<String, Object> variablesMap = new HashMap<>();
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			File jsonFile = new File("assigned_tasks.json");
			JsonNode rootNode = objectMapper.readTree(jsonFile);
			if (rootNode.isArray() && rootNode.size() > 0) {
				JsonNode firstTask = rootNode.get(0);
				JsonNode variablesNode = firstTask.get("variables");
				if (variablesNode != null && variablesNode.isArray() && variablesNode.size() > 0) {
					String fullId = variablesNode.get(0).get("id").asText();
					String numericId = fullId.split("-")[0];
					variablesMap.put("extractedId", numericId);
					for (JsonNode variable : variablesNode) {
						String name = variable.get("name").asText();
						JsonNode valueNode = variable.get("value");
						if (valueNode.isNumber()) {
							variablesMap.put(name, valueNode.asDouble());
						} else if (valueNode.isArray()) {
							variablesMap.put(name, objectMapper.convertValue(valueNode, String[].class));
						} else {
							variablesMap.put(name, valueNode.asText());
						}
					}
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
			variablesMap.put("error", "Failed to read JSON file.");
		}
		return variablesMap;
	}

	@GetMapping("/test")
	public ResponseEntity<List<TaskDTO>> getActiveTasksUnderWriter() throws TaskListException {
		String user = "UnderWriter";
		System.out.println("user: " + user);
		SaasAuthentication sa = new SaasAuthentication("U_L~ogg51nWrF_z4fLbAVFQS3aZ~GQIB",
				"2NKLsUvxfCy7B83YD5GTlo4Vw~pKwzgQd72n9_U4NpYUbpPlghYQ_ttg8y3KYCKh");
		CamundaTaskListClient client = new CamundaTaskListClient.Builder()
				.taskListUrl("https://bru-2.tasklist.camunda.io/1a8d8e18-4054-4bd2-afad-6f2adf8c58b8")
				.shouldReturnVariables().authentication(sa).build();
		List<Task> userTasks = client.getTasks(true, TaskState.CREATED, 50, true).stream()
				.filter(task -> user.equals(task.getAssignee())).collect(Collectors.toList());
		System.out.println("Fetched tasks: " + userTasks);
		Map<String, Object> taskVariable = getTaskVariablesJson();
		String processInstanceId = (String) taskVariable.get("extractedId"); // ✅ Corrected Key
		System.out.println("Extracted processInstanceId: " + processInstanceId);
		List<TaskDTO> taskDTOs = userTasks.stream().map(task -> {
			LoanApplicantDetails loanApplicantDetails = loanApplicantRepository
					.findByProcessInstanceId(processInstanceId);
			return new TaskDTO(task.getId(), task.getName(), task.getAssignee(), processInstanceId,
					task.getCreationTime(), loanApplicantDetails);
		}).collect(Collectors.toList());
		return ResponseEntity.ok(taskDTOs);
	}

	@CrossOrigin
	@GetMapping("/loan/accountNumber/{accountNumber}")
	public ResponseEntity<Loan> getLoanByAccountNumber(@PathVariable String accountNumber) {
		Loan loan = loanDetailsService.getLoanByAccountNumber(accountNumber);
		return ResponseEntity.status(HttpStatus.OK).body(loan);
	}

	@PostMapping("/loan/saveLoan")
	public ResponseEntity<Loan> saveLoan(@RequestBody Loan loan) {
		Loan savedLoan = loanDetailsService.saveLoan(loan);
		return new ResponseEntity<>(savedLoan, HttpStatus.CREATED);
	}
	
	private String taskId;
	
	@GetMapping("/loanTermModification")

	public List<Task> getActivedTaskList() throws TaskListException {

		String user = "Manager";

		SaasAuthentication sa = new SaasAuthentication("U_L~ogg51nWrF_z4fLbAVFQS3aZ~GQIB",

				"2NKLsUvxfCy7B83YD5GTlo4Vw~pKwzgQd72n9_U4NpYUbpPlghYQ_ttg8y3KYCKh");

		CamundaTaskListClient client = new CamundaTaskListClient.Builder()

				.taskListUrl("https://bru-2.tasklist.camunda.io/1a8d8e18-4054-4bd2-afad-6f2adf8c58b8")

				.shouldReturnVariables().authentication(sa).build();
		List<Task> taskdtoList = client.getTasks(true, TaskState.CREATED, 50, true);
		System.out.println(taskdtoList.get(0));
		Task task = taskdtoList.get(0);
		 taskId = task.getId();

		return client.getTasks(true, TaskState.CREATED, 50, true);
	}

	@GetMapping("/loanTermModificationComplete")
	public String completeTask(@RequestBody String loanTerm, @RequestParam String processInstanceId)
			throws TaskListException, JsonMappingException, JsonProcessingException {

		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode rootNode = objectMapper.readTree(loanTerm);

		String assignee = rootNode.path("loanTerm").asText().trim();

		System.out.println("Assignee: " + assignee);

		zeebeClient.newSetVariablesCommand(Long.parseLong(processInstanceId)).variables(Map.of("loanTerm", assignee))
				.send().join();
		System.out.println("Process variable 'loanTerm' set successfully.");
		SaasAuthentication sa = new SaasAuthentication("U_L~ogg51nWrF_z4fLbAVFQS3aZ~GQIB",

				"2NKLsUvxfCy7B83YD5GTlo4Vw~pKwzgQd72n9_U4NpYUbpPlghYQ_ttg8y3KYCKh");

		CamundaTaskListClient client = new CamundaTaskListClient.Builder()

				.taskListUrl("https://bru-2.tasklist.camunda.io/1a8d8e18-4054-4bd2-afad-6f2adf8c58b8")

				.shouldReturnVariables().authentication(sa).build();

		Map<String, Object> map = new HashMap<>();
		client.completeTask(taskId, map);
		return "task Completed";
	}
	
}
