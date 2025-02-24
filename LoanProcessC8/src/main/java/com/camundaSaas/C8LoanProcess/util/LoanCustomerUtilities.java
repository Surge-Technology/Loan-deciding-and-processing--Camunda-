package com.camundaSaas.C8LoanProcess.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.camunda.tasklist.CamundaTaskListClient;
import io.camunda.tasklist.auth.SaasAuthentication;
import io.camunda.tasklist.auth.SimpleAuthentication;
import io.camunda.tasklist.dto.Task;
import io.camunda.tasklist.exception.TaskListException;

@Component
public class LoanCustomerUtilities {

	final RestTemplate restTemplate = new RestTemplate();

	public static CamundaTaskListClient getClient(String cloudClientId, String cloudClientSecret, String cloudClusterId,
			String SELF_MANAGED_URL, String SAAS_TASKLIST_URL) throws TaskListException {
		boolean isSelfManaged = cloudClientId.isEmpty();

		return new CamundaTaskListClient.Builder()
				.taskListUrl(isSelfManaged ? SELF_MANAGED_URL : SAAS_TASKLIST_URL + "/" + cloudClusterId)
				.shouldReturnVariables().authentication(isSelfManaged ? new SimpleAuthentication("demo", "demo")
						: new SaasAuthentication(cloudClientId, cloudClientSecret))
				.build();
	}

	public static Optional<Task> getActiveTask(CamundaTaskListClient client, String processInstanceId)
			throws TaskListException {
		List<Task> allTasks = client.getTasks(true, null, 50, true); // Fetch active tasks
		System.out.println(allTasks);
		return allTasks.stream().filter(task -> processInstanceId.equals(task.getProcessName())) // Filter by
																									// processInstanceId
				.findFirst(); // Get the first active task
	}

	public static void completeTask(CamundaTaskListClient client, String taskId) throws TaskListException {
		client.completeTask(taskId, new HashMap<>());
	}

}
