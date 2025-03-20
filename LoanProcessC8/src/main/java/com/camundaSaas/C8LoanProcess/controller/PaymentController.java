package com.camundaSaas.C8LoanProcess.controller;

import io.camunda.zeebe.client.ZeebeClient;
import io.camunda.zeebe.client.api.response.ProcessInstanceEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
 
import com.camundaSaas.C8LoanProcess.model.LoanTransactionDetails;
 
import java.util.HashMap;
import java.util.Map;
 
@RestController
public class PaymentController {
 
	@Autowired
	private ZeebeClient zeebeClient;
	
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

 
	@Value("${paymentFailure}")
	private boolean paymentFailure;
 
	@CrossOrigin
	@PostMapping("/start-payment")
	public String startPaymentWorkflow(@RequestBody LoanTransactionDetails loanTransactionDetails) {

		String status="";
		if (!paymentFailure) {
			status="success";
		}
		else {
			status="failure";
		}
		Map<String, Object> variables = new HashMap<>();
		variables.put("paymentStatus", status);
		variables.put("loanId", loanTransactionDetails.getLoanId());
		variables.put("loanAmount", loanTransactionDetails.getLoanAmount());
		variables.put("transactionAmount", loanTransactionDetails.getTransactionAmount());
		variables.put("balanceAmount", loanTransactionDetails.getBalanceAmount());
		variables.put("paymentType", loanTransactionDetails.getPaymentType());
		variables.put("email", loanTransactionDetails.getEmail());
		variables.put("paymentMethod", "Manual Pay");
		variables.put("loanAccountNumber", loanTransactionDetails.getLoanAccountNumber());
 
		ProcessInstanceEvent processInstance = zeebeClient.newCreateInstanceCommand()
				.bpmnProcessId("payment_process").latestVersion().variables(variables).send().join();


		return "Payment process Initiated";
	}

}