package com.surge.loanManagement.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.surge.loanManagement.model.CustomerDetails;
import com.surge.loanManagement.model.User;
import com.surge.loanManagement.service.CustomerService;
import com.surge.loanManagement.service.UserService;

@RestController
public class CustomerController {

	private String processInstanceId;
	
	private String decision;

	@Autowired
	CustomerService customerService;

	@Autowired
	UserService userService;

	

	@Autowired
	ProcessEngine processEngine;

//	@PostMapping("/register")
//	public Map<String, Object> start(@RequestBody User user) {
//
//		ProcessInstance processInstance = processEngine.getRuntimeService()
//				.createProcessInstanceByKey("LoanManagementApplication").execute();
//
//		processInstanceId = processInstance.getId();
//
//		User savedUser = userService.createUser(user);
//
//		Map<String, Object> response = new HashMap<String, Object>();
//		response.put("processInstanceId", processInstanceId);
//		response.put("user", savedUser);
//
//		return response;
//	}
	
	@PostMapping("/saveDetails")
	public String saveDetails(@RequestBody Map<String, Object> details) {

	    System.out.println("Received details: " + details);

	    // Validate customer details
	    Map<String, Object> customerDetailsMap = (Map<String, Object>) details.get("customerDetails");
	    if (customerDetailsMap == null) {
	        throw new IllegalArgumentException("customerDetails is missing!");
	    }

	    // Process tasks
	    List<Task> tasks = processEngine.getTaskService()
	            .createTaskQuery()
	            .processInstanceId(processInstanceId)
	            .active()
	            .list();

	    TaskService taskService = processEngine.getTaskService();
	    tasks.forEach(task -> {
	        taskService.claim(task.getId(), "Demo");
	        
	        customerService.saveDetails(details);
	        taskService.complete(task.getId());
	        System.out.println("Completed task ID: " + task.getId());
	    });

	    // Save all details
	    return "Details Stored Suucessfully";
	}


//	@PostMapping("/saveDetails")
//	public String saveDetails(@RequestBody Map<String, Object> details) {
//
//		System.out.println("Received details: " + details);
//
//		System.out.println("Current Process Instance ID: " + processInstanceId);
//
//		Object customerDetailsObject = details.get("customerDetails");
//
//		if (customerDetailsObject == null) {
//			throw new IllegalArgumentException("customerDetails is missing!");
//		}
//
//		Map<String, Object> customerDetailsMap = null;
//		if (customerDetailsObject instanceof Map) {
//			customerDetailsMap = (Map<String, Object>) customerDetailsObject;
//		} else if (customerDetailsObject instanceof List) {
//			System.out.println("Received customerDetails as a List, processing...");
//			customerDetailsMap = new HashMap<>();
//		} else {
//			throw new IllegalArgumentException("Expected customerDetails to be a Map or List, but found: "
//					+ customerDetailsObject.getClass().getName());
//		}
//
//		List<Task> tasks = processEngine.getTaskService().createTaskQuery().processInstanceId(processInstanceId)
//				.active().list();
//
//		TaskService taskService = processEngine.getTaskService();
//		for (Task task : tasks) {
//			String taskId = task.getId();
//			System.out.println("Claiming task ID: " + taskId);
//
//			String userId = "Demo";
//			taskService.claim(taskId, userId);
//			System.out.println("Task claimed by: " + userId);
//
//			taskService.complete(taskId);
//			System.out.println("Task completed: " + taskId);
//		}
//		return customerService.saveDetails(details);
//	}

	@GetMapping("/underWriterApproval")
	public String underWriterApproval(@RequestBody String underWriter) {
		System.out.println(underWriter);
		
		decision = underWriter;
		System.out.println("Current Process Instance ID: " + processInstanceId);
		List<Task> tasks = processEngine.getTaskService().createTaskQuery().processInstanceId(processInstanceId)
				.active().list();
		TaskService taskService = processEngine.getTaskService();
		for (Task task : tasks) {
			String taskId = task.getId();
			System.out.println("Claiming task ID: " + taskId);

			String userId = "Demo";
			taskService.claim(taskId, userId);
			System.out.println("Task claimed by: " + userId);

			taskService.complete(taskId);
			System.out.println("Task completed: " + taskId);
		}
		return decision;
	}
	
	@PostMapping("/createCustomer")
	public ResponseEntity<CustomerDetails> createCustomer(@RequestBody CustomerDetails customerDetails) {
		CustomerDetails createdCustomer = customerService.createCustomer(customerDetails);
		return ResponseEntity.ok(createdCustomer);
	}

	@GetMapping("/getAllCustomers")
	public ResponseEntity<List<CustomerDetails>> getAllCustomers() {
		List<CustomerDetails> customers = customerService.getAllCustomers();
		return ResponseEntity.ok(customers);
	}

	@GetMapping("/getCustomerById/{customerId}")
	public ResponseEntity<CustomerDetails> getCustomerById(@PathVariable long customerId) {
		CustomerDetails customer = customerService.getCustomerById(customerId);
		return ResponseEntity.ok(customer);
	}

	@PutMapping("/updateCustomer/{customerId}")
	public ResponseEntity<CustomerDetails> updateCustomer(@PathVariable long customerId,
			@RequestBody CustomerDetails customerDetails) {
		CustomerDetails updatedCustomer = customerService.updateCustomer(customerId, customerDetails);
		return ResponseEntity.ok(updatedCustomer);
	}

	@DeleteMapping("/deleteCustomer/{customerId}")
	public ResponseEntity<Void> deleteCustomer(@PathVariable long customerId) {
		customerService.deleteCustomer(customerId);
		return ResponseEntity.noContent().build();
	}
}
