package com.camundaSaas.C8LoanProcess.model;


import java.sql.Timestamp;

 
public class TaskDTO {
    private String taskId;
    private String taskName;
    private String assignee;
    private String processInstanceId;
    private String creationTimestamp;
    private LoanApplicantDetails loanDetails;
 
    public TaskDTO(String taskId, String taskName, String assignee, String processInstanceId,
                   String creationTimestamp2, LoanApplicantDetails loanDetails) {
        this.taskId = taskId;
        this.taskName = taskName;
        this.assignee = assignee;
        this.processInstanceId = processInstanceId;
        this.creationTimestamp = creationTimestamp2;
        this.loanDetails = loanDetails;
    }
 
    public String getTaskId() {
        return taskId;
    }
 
    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }
 
    public String getTaskName() {
        return taskName;
    }
 
    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }
 
    public String getAssignee() {
        return assignee;
    }
 
    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }
 
    public String getProcessInstanceId() {
        return processInstanceId;
    }
 
    public void setProcessInstanceId(String processInstanceId) {
        this.processInstanceId = processInstanceId;
    }
 
    public String getCreationTimestamp() {
        return creationTimestamp;
    }
 
    public void setCreationTimestamp(String creationTimestamp) {
        this.creationTimestamp = creationTimestamp;
    }
 
    public LoanApplicantDetails getLoanDetails() {
        return loanDetails;
    }
 
    public void setLoanDetails(LoanApplicantDetails loanDetails) {
        this.loanDetails = loanDetails;
    }
}