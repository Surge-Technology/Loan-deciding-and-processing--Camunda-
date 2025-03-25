package com.camundaSaas.C8LoanProcess.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.camunda.zeebe.client.ZeebeClient;
import io.camunda.zeebe.client.api.response.ProcessInstanceEvent;

@RestController
public class LoanClosureController {

	@Autowired
	ZeebeClient zeebeClient;

	private String processInstanceId;

	@CrossOrigin
	@GetMapping("/loanClosure")
	public String loanClosure() {

		ProcessInstanceEvent processInstanceEvent = zeebeClient.newCreateInstanceCommand().bpmnProcessId("LoanClosure")
				.latestVersion().variables("").send().join();

		processInstanceId = String.valueOf(processInstanceEvent.getProcessInstanceKey());

		return processInstanceId + "Process Instance Started Successfully";
	}
	
	
	
}
