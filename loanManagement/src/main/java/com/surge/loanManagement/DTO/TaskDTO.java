package com.surge.loanManagement.DTO;
 
import java.sql.Timestamp;
 
import com.surge.loanManagement.model.LoanApplicantDetails;
 
public class TaskDTO {
    private String taskId;
    private String taskName;
    private String assignee;
    private String processInstanceId;
    private Timestamp creationTimestamp;
    private LoanApplicantDetails loanDetails;
 
    public TaskDTO(String taskId, String taskName, String assignee, String processInstanceId,
                   Timestamp creationTimestamp, LoanApplicantDetails loanDetails) {
        this.taskId = taskId;
        this.taskName = taskName;
        this.assignee = assignee;
        this.processInstanceId = processInstanceId;
        this.creationTimestamp = creationTimestamp;
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
 
    public Timestamp getCreationTimestamp() {
        return creationTimestamp;
    }
 
    public void setCreationTimestamp(Timestamp creationTimestamp) {
        this.creationTimestamp = creationTimestamp;
    }
 
    public LoanApplicantDetails getLoanDetails() {
        return loanDetails;
    }
 
    public void setLoanDetails(LoanApplicantDetails loanDetails) {
        this.loanDetails = loanDetails;
    }
}