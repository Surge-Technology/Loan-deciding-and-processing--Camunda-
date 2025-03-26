package com.camundaSaas.C8LoanProcess.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.camunda.tasklist.CamundaTaskListClient;
import io.camunda.tasklist.auth.SaasAuthentication;
import io.camunda.tasklist.dto.Task;
import io.camunda.tasklist.dto.TaskState;
import io.camunda.tasklist.exception.TaskListException;
import io.camunda.zeebe.client.ZeebeClient;

@RestController
public class MessageEventController {

	@Autowired
	private ZeebeClient zeebeClient;

	private String taskId;
	private String processInstanceId;

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

	@CrossOrigin
		@PostMapping("/startMessage")
		public String test(@RequestBody Map<String, Object> variables) {
			System.out.println(variables);
	 
//			zeebeClient.newPublishMessageCommand().messageName("messageStart").correlationKey("").variables(variables)
//					.send().join();
	 
			zeebeClient.newCreateInstanceCommand().bpmnProcessId("Process_0uh0bap").latestVersion().variables("").send().join();
			return "Process returned Successfully";
		}

	@GetMapping("/getActivedTasks")

	public List<Task> getActivedTaskList1() throws TaskListException {

		String user = "FieldOfficer";

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

	@GetMapping("/completeTask")
	public String completeTask(@RequestBody String fieldVisit, @RequestParam String processInstanceId)
			throws TaskListException, JsonMappingException, JsonProcessingException {

		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode rootNode = objectMapper.readTree(fieldVisit);

		String assignee = rootNode.path("fieldVisit").asText().trim();

		System.out.println("Assignee: " + assignee);

		zeebeClient.newSetVariablesCommand(Long.parseLong(processInstanceId)).variables(Map.of("fieldVisit", assignee))
				.send().join();
		System.out.println("Process variable 'fieldVisit' set successfully.");
		SaasAuthentication sa = new SaasAuthentication("U_L~ogg51nWrF_z4fLbAVFQS3aZ~GQIB",

				"2NKLsUvxfCy7B83YD5GTlo4Vw~pKwzgQd72n9_U4NpYUbpPlghYQ_ttg8y3KYCKh");

		CamundaTaskListClient client = new CamundaTaskListClient.Builder()

				.taskListUrl("https://bru-2.tasklist.camunda.io/1a8d8e18-4054-4bd2-afad-6f2adf8c58b8")

				.shouldReturnVariables().authentication(sa).build();

		Map<String, Object> map = new HashMap<>();
		client.completeTask(taskId, map);
		return "task Completed";
	}
	

//	@CrossOrigin
//	@GetMapping("/getActiveTask")
//	public ResponseEntity<List<TaskDTO>> getActiveTask(@RequestParam String user) throws TaskListException {
//	    
//		System.out.println("user"+user);
//	    SaasAuthentication sa = new SaasAuthentication(
//	        "U_L~ogg51nWrF_z4fLbAVFQS3aZ~GQIB",
//	        "2NKLsUvxfCy7B83YD5GTlo4Vw~pKwzgQd72n9_U4NpYUbpPlghYQ_ttg8y3KYCKh"
//	    );
//
//	    CamundaTaskListClient client = new CamundaTaskListClient.Builder()
//	        .taskListUrl("https://bru-2.tasklist.camunda.io/1a8d8e18-4054-4bd2-afad-6f2adf8c58b8")
//	        .shouldReturnVariables()
//	        .authentication(sa)
//	        .build();
//
//	    List<Task> userTasks = client.getTasks(
//	        true, 
//	        TaskState.CREATED, 
//	        50, 
//	        true 
//	    ).stream()
//	    .filter(task -> user.equals(task.getAssignee()))
//	    .collect(Collectors.toList());
//	    System.out.println("Task Assignees: " + userTasks.stream().map(Task::getAssignee).collect(Collectors.toList()));
//
//	    List<TaskDTO> taskDTOs = userTasks.stream().map(task -> {
//	      
//	        LoanApplicantDetails loanDetails = loanApplicantRepository
//	                .findByProcessInstanceId(processInstanceId);
//
//	        if (loanDetails == null) {
//	            System.out.println("No loan details found for processInstanceId: " + processInstanceId);
//	            loanDetails = new LoanApplicantDetails(); 
//	        } else {
//	            System.out.println("Loan details found: " + loanDetails);
//	        }
//
//	        return new TaskDTO(
//	                task.getId(),            
//	                task.getName(),        
//	                task.getAssignee(),     
//	                processInstanceId,      
//	                task.getCreationTime(), 
//	                loanDetails       
//	        );
//	    }).collect(Collectors.toList());
//
//	    return ResponseEntity.ok(taskDTOs);
//	}

}
