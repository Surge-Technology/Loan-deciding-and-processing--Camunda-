package com.surge.loanManagement.model;
 
import java.sql.Timestamp;
 
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
 
@Entity
@Table(name = "applicant_data")
public class LoanApplicantDetails {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(columnDefinition = "JSONB")
    private String data;
 
    @Column(nullable = false)
    private String emailId;
    @Column
    private String loanAccountNumber;
    @Column
    private Timestamp createdDate;
    @Column
    private String loanStatus;
    @Column
    private String loanType;
    @Column
    private Long loanAmount;
    @Column
    private String applicantName;
    @Column
    private Long balanceAmount;
    @Column
    private String processInstanceId;
 
 
 
	public String getProcessInstanceId() {
		return processInstanceId;
	}
 
	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}
 
	public Long getBalanceAmount() {
		return balanceAmount;
	}
 
	public void setBalanceAmount(Long balanceAmount) {
		this.balanceAmount = balanceAmount;
	}
 
	public Long getId() {
        return id;
    }
 
    public void setId(Long id) {
        this.id = id;
    }
 
    public String getData() {
        return data;
    }
 
    public void setData(String data) {
        this.data = data;
    }
 
    public String getEmailId() {
        return emailId;
    }
 
    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }
 
    public String getLoanAccountNumber() {
        return loanAccountNumber;
    }
 
    public void setLoanAccountNumber(String loanAccountNumber) {
        this.loanAccountNumber = loanAccountNumber;
    }
 
    public Timestamp getCreatedDate() {
        return createdDate;
    }
 
    public void setCreatedDate(Timestamp createdDate) {
        this.createdDate = createdDate;
    }
 
    public String getLoanStatus() {
        return loanStatus;
    }
 
    public void setLoanStatus(String loanStatus) {
        this.loanStatus = loanStatus;
    }
 
    public String getLoanType() {
        return loanType;
    }
 
    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }
 
    public Long getLoanAmount() {
        return loanAmount;
    }
 
    public void setLoanAmount(Long loanAmount) {
        this.loanAmount = loanAmount;
    }
 
    public String getApplicantName() {
        return applicantName;
    }
 
    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }
}