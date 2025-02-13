package com.surge.loanManagement.controller;

import java.util.Arrays;
import java.util.List;
 
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
 
 
public class FetchUsersDelegate implements JavaDelegate {
    @Override
    public void execute(DelegateExecution execution) {
        List<String> users = Arrays.asList("UnderWriter","LegalApprover");
        execution.setVariable("assigneeList", users);
    }
}