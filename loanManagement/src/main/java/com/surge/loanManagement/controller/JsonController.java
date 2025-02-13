package com.surge.loanManagement.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.ProcessEngines;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.surge.loanManagement.AppConfig;
import com.surge.loanManagement.DTO.TaskDTO;
import com.surge.loanManagement.model.DisbursementJsonData;
import com.surge.loanManagement.model.FileEntity;
import com.surge.loanManagement.model.JsonData;
import com.surge.loanManagement.repository.JsonDataDisbursementRepository;
import com.surge.loanManagement.repository.JsonDataRepository;
import com.surge.loanManagement.service.DocumentService;
import com.surge.loanManagement.service.EmailService;
import com.surge.loanManagement.service.FileService;

import jakarta.annotation.PostConstruct;

@RestController
public class JsonController {

	private String processInstanceId;
	private String taskId;
	private String userId;
	private String decision;
	private String emailIdData;
	private String customerData;
	private String disbursemnetData;
	private Map<String, Object> finalDecision;
	private String clarificationDetails;
	private String loanDetails;
	private String content;
	private String accountNumber;
	@Autowired
	JsonDataRepository repository;
	@Autowired
	ProcessEngine processEngine;
	@Autowired
	EmailService emailService;
	@Autowired
	ObjectMapper objectMapper;

	@Autowired
	private JsonDataDisbursementRepository jsonDataDisbursementRepository;

	@Autowired
	DocumentService documentService;

	@Autowired
	FileService fileService;
	
	@Autowired
	AppConfig appConfig;
 
	private Path uploadDirectory;
 
	@PostConstruct
	public void init() {
		uploadDirectory = Paths.get(appConfig.getFileSystemPath());
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
	@PostMapping("/saveJsonData")
	public ResponseEntity<String> saveJson(@RequestBody String jsonData, String emailId) {
		try {
			ProcessInstance processInstance = processEngine.getRuntimeService()
					.createProcessInstanceByKey("LoanManagementApplication").execute();
			ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
			TaskService taskService = processEngine.getTaskService();
			RuntimeService runtimeService = processEngine.getRuntimeService();
			processInstanceId = processInstance.getId();
			customerData = jsonData;
			JsonNode rootNode = objectMapper.readTree(jsonData);
			emailId = rootNode.path("personalData").path("contactInfo").path("email").asText();
			runtimeService.setVariable(processInstanceId, "emailId", emailId);
			if (rootNode.has("Files")) {
				JsonNode filesNode = rootNode.path("Files").path("otherFiles");
				for (JsonNode fileNode : filesNode) {
					String fileName = fileNode.path("name").asText();
					String fileContent = fileNode.path("content").asText();
					documentService.storeFile(fileName, fileContent);
				}
			}
			Optional<JsonData> existingJsonData = repository.findByEmailId(emailId);
			if (existingJsonData.isPresent()) {
				JsonData jsonDataRecord = existingJsonData.get();
				repository.updateJsonData(jsonDataRecord.getId(), jsonData, emailId);
				return ResponseEntity.ok("JSON data updated successfully for emailId: " + emailId);
			} else {
				repository.saveJson(jsonData, emailId);
				String subject = "Loan Application Submission Confirmation";
				String body = "Dear Applicant,\n\nYour loan application has been successfully submitted. We will process your request and update you shortly.\n\nThank you.";

				emailService.sendSimpleEmail(emailId, subject, body);
				return ResponseEntity.ok("JSON data saved successfully!");
			}
		} catch (JsonProcessingException e) {
			return ResponseEntity.badRequest().body("Error parsing JSON: " + e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while processing the request: " + e.getMessage());
		}
	}

//	@CrossOrigin
//	@GetMapping("/getActiveTasks")
//	public ResponseEntity<List<TaskDTO>> getActiveTasks(@RequestParam String user) {
//		ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
//		TaskService taskService = processEngine.getTaskService();
//		userId = user;
//		taskService = processEngine.getTaskService();
//		List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstanceId).active().list();
//		List<TaskDTO> taskDTOs = tasks.stream().map(task -> {
//			Timestamp creationTimestamp = task.getCreateTime() != null ? new Timestamp(task.getCreateTime().getTime())
//					: null;
//			return new TaskDTO(task.getId(), task.getName(), task.getAssignee(), task.getProcessInstanceId(),
//					creationTimestamp);
//		}).collect(Collectors.toList());
//		return ResponseEntity.ok(taskDTOs);
//	}

	@CrossOrigin
	@PostMapping("/loanApproval")
	public ResponseEntity<String> loanApproval(@RequestBody String approval) throws JsonProcessingException {
		System.out.println("Received Approval Data: " + approval);
		loanDetails = approval;
		ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
		TaskService taskService = processEngine.getTaskService();
		RuntimeService runtimeService = processEngine.getRuntimeService();
		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode rootNode = objectMapper.readTree(approval);
		String finalDecision = rootNode.path("finalDecision").asText();
		String clarificationDetails = "";
		if ("needClarification".equals(finalDecision)) {
			clarificationDetails = rootNode.path("clarificationDetails").asText();
		}
		System.out.println("Final Decision: " + finalDecision);
		System.out.println("Clarification Details: " + clarificationDetails);
		runtimeService.setVariable(processInstanceId, "finalDecision", finalDecision);
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
	@GetMapping("/readData")
	public List<JsonNode> getAllJsonData() {
		List<JsonNode> response = new ArrayList<>();
		ObjectMapper objectMapper = new ObjectMapper();
		List<JsonData> jsonDataList = repository.findAll();
		for (JsonData jsonData : jsonDataList) {
			try {
				JsonNode jsonNode = objectMapper.readTree(jsonData.getData());
				response.add(jsonNode);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return response;
	}

	@GetMapping("/getJsonData/{id}")
	public JsonData getJsonDataById(@PathVariable Long id) {
		Optional<JsonData> jsonData = repository.findById(id);
		return jsonData.orElseThrow(() -> new RuntimeException("JsonData not found with id: " + id));
	}



	@CrossOrigin
	@GetMapping("/getJsonDataByEmail")
	public String getJsonDataByEmail(@RequestParam String emailId) {
		Optional<JsonData> jsonData = repository.findByEmailId(emailId);
		String data = jsonData.orElseThrow(() -> new RuntimeException("JsonData not found with emailId: " + emailId))
				.getData();
		return data;
	}

	@CrossOrigin
	@PutMapping("/updateJsonDataByEmail")
	public JsonNode updateJsonByEmail(@RequestParam String emailId, @RequestBody String jsonData) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode rootNode = objectMapper.readTree(jsonData);
			String newEmailId = rootNode.path("emailId").asText();
			JsonData existingData = repository.findByEmailId(emailId)
					.orElseThrow(() -> new RuntimeException("JsonData not found with emailId: " + emailId));
			repository.updateJsonData(existingData.getId(), jsonData, newEmailId);
			return rootNode;
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException("Error processing the JSON data.");
		}
	}

//	@CrossOrigin
//	@PostMapping("/emailSenderClarification")
//	public String emailSenderClarification() throws JsonMappingException, JsonProcessingException {
//		System.out.println(emailIdData);
//		System.out.println(customerData);
//		System.out.println(loanDetails);
//		JsonNode rootNode = objectMapper.readTree(loanDetails);
//		content = rootNode.path("clarificationDetails").asText();
//		System.out.println(content);
//		String to = "bala@gmail.com";
////		String to = emailIdData;
//		String subject = "Clarification Needed";
//		String body = "Dear Customer,\n\n"
//				+ "We need additional clarification regarding your loan application. Specifically, we require the following details:\n"
//				+ "- " + content + "\n\n" + "Please provide the necessary information by visiting the following link: "
//				+ "http://localhost:3000/#/file\n\n" + "Thank you for your prompt attention to this matter.\n\n";
//		System.out.println(body);
////		emailService.sendSimpleEmail(to, subject, body);
//		System.out.println("mail sent");
//		return "mail Sent";
//	}

	@CrossOrigin
	@PostMapping("/emailSenderApproval")
	public String emailSenderApproval() {
		System.out.println("Sending email to: " + emailIdData);
		String to = "bala@gmail.com";
//		String to = emailIdData;
		String subject = "Loan Approval Confirmation";
		String body = "Congratulations! Your application has been deemed eligible for a loan. "
				+ "We have attached the disbursement details in the form. Once you acknowledge, we can proceed with account generation."
				+ "http://localhost:3000/#/LoanAmountDetails";
		System.out.println(body);
//		emailService.sendSimpleEmail(to, subject, body);
		return "Email Sent Successfully";
	}

	@CrossOrigin
	@PostMapping("/emailSenderRejection")
	public String emailSenderRejection() {
		System.out.println("Sending email to: " + emailIdData);
		String to = "bala@gmail.com";
		String subject = "Loan Application Status";
		String body = "We regret to inform you that your loan application has not been approved. "
				+ "Please contact our support team for further details.";
		System.out.println(body);
//		emailService.sendSimpleEmail(to, subject, body);
		return "Email Sent Successfully";
	}

//	@CrossOrigin
//	@GetMapping("/clarification")
//	public String clarificationDetails() {
//		System.out.println(content);
//		String data = content;
//		return data;
//	}

	private static final String BASE_NUMBER = "22507000000000";
	private long lastGeneratedNumber = Long.parseLong(BASE_NUMBER);

	@CrossOrigin
	@PostMapping("/generateAccountNumber")
	public ResponseEntity<String> generateAccountNumber() {
		lastGeneratedNumber += 1;

		accountNumber = String.format("%014d", lastGeneratedNumber);

		System.out.println(accountNumber);
		return ResponseEntity.ok(accountNumber);
	}

	@CrossOrigin
	@PostMapping("/emailAccountGenerator")
	public String emailAccountGenerator() {
		System.out.println("Account Number: " + accountNumber);
		System.out.println("Sending email to: " + emailIdData);
		String to = emailIdData;
		String subject = "Account Generated Successfully - Your Account Number: " + accountNumber;
		String body = "Dear Customer,\n\n"
				+ "We are pleased to inform you that your account has been successfully created. "
				+ "Your new account number is: " + accountNumber + ".\n\n";

		emailService.sendSimpleEmail(to, subject, body);
		return "Email Sent Successfully";
	}

	@CrossOrigin
	@PostMapping("/customerApproval")
	public Map<String, Object> SelectLoanType(@RequestBody Map<String, Object> customer) throws Exception {

		ProcessEngine procssEngine = ProcessEngines.getDefaultProcessEngine();
		TaskService taskService = processEngine.getTaskService();
		RuntimeService runtimeService = processEngine.getRuntimeService();

		System.out.println(processInstanceId);

		Task task = taskService.createTaskQuery().processInstanceId(processInstanceId).singleResult();

		if (task == null) {
			throw new Exception("No active task found for processInstanceId: " + processInstanceId);
		}
		runtimeService.setVariables(processInstanceId, customer);
		System.out.println("Loan Type stored in process variables: " + customer);

		if (task.getAssignee() == null) {
			taskService.claim(task.getId(), "Demo");
			System.out.println("Task claimed by: Demo");
		}
		taskService.complete(task.getId());
		System.out.println("Task completed for processInstanceId: " + processInstanceId);

		return customer;
	}

	@CrossOrigin
	@PostMapping("/customerReply")
	public ResponseEntity<String> customerReply(@RequestBody String jsonData) throws IOException {
		// Parse the incoming JSON data
		System.out.println("111");
		JsonNode rootNode = objectMapper.readTree(jsonData);

		ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
		TaskService taskService = processEngine.getTaskService();
		RuntimeService runtimeService = processEngine.getRuntimeService();
		taskService = processEngine.getTaskService();
		List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstanceId).active().list();
		Task task = tasks.get(0);
		taskId = task.getId();
		userId = task.getAssignee();
		System.out.println("Task ID: " + taskId);
		System.out.println("Assigned User: " + userId);
		taskService.claim(taskId, userId);
		System.out.println("Task claimed successfully by user: " + userId);
		taskService.complete(taskId);
		if (rootNode.has("Files")) {
			JsonNode filesNode = rootNode.path("Files").path("otherFiles");
			for (JsonNode fileNode : filesNode) {
				String fileName = fileNode.path("name").asText();
				String fileContent = fileNode.path("content").asText();
				documentService.storeFile(fileName, fileContent);
			}
			taskService.complete(taskId);
		}
		return ResponseEntity.ok("Task completed successfully and files stored.");
	}

	@CrossOrigin
	@PostMapping("/customerReply2")
	public ResponseEntity<String> customerReply(@RequestBody Map<String, Object> requestData) throws IOException {

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

	@CrossOrigin
	@GetMapping("/download-all")
	public ResponseEntity<Resource> downloadAllFiles() {
		try {
			Path zipFilePath = Paths.get(appConfig.getFileSystemPath()).resolve("all-files.zip");

			try (FileOutputStream fos = new FileOutputStream(zipFilePath.toFile());
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
			Resource resource = new FileSystemResource(zipFilePath.toFile());
			return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"all-files.zip\"")
					.body(resource);

		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@CrossOrigin
	@GetMapping("/downloadFile")
	public ResponseEntity<?> getJsonDataByEmailAndDownloadFile(@RequestParam String emailId)
			throws FileNotFoundException {
		Optional<JsonData> jsonDataOptional = repository.findByEmailId(emailId);
		if (jsonDataOptional.isPresent()) {
			JsonData jsonData = jsonDataOptional.get();
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
									.header(HttpHeaders.CONTENT_DISPOSITION,
											"attachment; filename=\"" + fileName + "\"")
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
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("JsonData not found with emailId: " + emailId);
		}
	}

	@CrossOrigin
	@GetMapping("/getEmail")
	public String getEmailId() {

		ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
		RuntimeService runtimeService = processEngine.getRuntimeService();

		emailIdData = (String) runtimeService.getVariable(processInstanceId, "emailId");

		System.out.println("Email ID: " + emailIdData);
		return emailIdData != null ? emailIdData : "Email ID not found!";
	}

//    @PostMapping("/saveDisbursementDetails")
//    public ResponseEntity<String> saveDisbursement(@RequestBody String jsonData) {
//        try {
//            JsonNode rootNode = objectMapper.readTree(jsonData);
//            String emailId = rootNode.path("emailId").asText();
//
//            if (!isValidJson(jsonData)) {
//                return ResponseEntity.badRequest().body("Invalid JSON data");
//            }
//
//            jsonDataDisbursementRepository.saveJson(jsonData, emailId);
//            return ResponseEntity.ok("JSON data for emailId: " + emailId + " saved successfully!");
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("Invalid JSON format: " + e.getMessage());
//        } 
//    }
//    
//    public boolean isValidJson(String json) {
//        try {
//            objectMapper.readTree(json);  
//            return true;
//        } catch (IOException e) {
//            return false;
//        }
//    }
	@PostMapping("/saveDisbursementDetails/{emailId}")
	public ResponseEntity<String> saveDisbursement(@PathVariable String emailId, @RequestBody String jsonData) {
		try {
			if (!isValidJson(jsonData)) {
				return ResponseEntity.badRequest().body("Invalid JSON data");
			}
			jsonDataDisbursementRepository.saveJson(jsonData, emailId);
			return ResponseEntity.ok("JSON data for emailId: " + emailId + " saved successfully!");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error processing request: " + e.getMessage());
		}
	}

	@GetMapping("/getDisbursementDetails/{emailId}")
	public ResponseEntity<?> getDisbursementByEmail(@PathVariable String emailId) {
		try {
			Optional<DisbursementJsonData> disbursementData = jsonDataDisbursementRepository.findByEmailId(emailId);

			if (disbursementData.isPresent()) {
				return ResponseEntity.ok(disbursementData.get());
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body("No disbursement data found for emailId: " + emailId);
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error fetching data: " + e.getMessage());
		}
	}
	
	public boolean isValidJson(String json) {
		try {
			objectMapper.readTree(json);
			return true;
		} catch (IOException e) {
			return false;
		}
	}

}
