package com.surge.loanManagement.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
 
@Entity
@Table(name = "Loan_Transaction_Details")
public class LoantransactionDetails {
 
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long loanId;
 
	private String uanId;
	private String transactionStatus;
 
	private LocalDateTime date;
 private String loanAccountNumber;
	private Long loanAmount;
	private String paymentType;
	private Long transactionAmount;
	private Long balanceAmount;
 
	public Long getBalanceAmount() {
		return balanceAmount;
	}
 
	public void setBalanceAmount(Long balanceAmount) {
		this.balanceAmount = balanceAmount;
	}
 
	@Version // ✅ Hibernate uses this for optimistic locking
	private Integer version = 0; // ✅ Default value to prevent null issues
 
	public Long getLoanId() {
		return loanId;
	}
 
	public void setLoanId(Long loanId) {
		this.loanId = loanId;
	}
 
	public String getUanId() {
		return uanId;
	}
 
	public void setUanId(String uanId) {
		this.uanId = uanId;
	}
 
	public String getTransactionStatus() {
		return transactionStatus;
	}
 
	public void setTransactionStatus(String transactionStatus) {
		this.transactionStatus = transactionStatus;
	}
 
	public LocalDateTime getDate() {
		return date;
	}
 
	public void setDate(LocalDateTime date) {
		this.date = date;
	}
 
	public Long getLoanAmount() {
		return loanAmount;
	}
 
	public void setLoanAmount(Long loanAmount) {
		this.loanAmount = loanAmount;
	}
 
	public String getPaymentType() {
		return paymentType;
	}
 
	public void setPaymentType(String paymentType) {
		this.paymentType = paymentType;
	}
 
	public Long getTransactionAmount() {
		return transactionAmount;
	}
 
	public void setTransactionAmount(Long transactionAmount) {
		this.transactionAmount = transactionAmount;
	}
 
	public Integer getVersion() {
		return version;
	}
 
	public void setVersion(Integer version) {
		this.version = version;
	}

	public String getLoanAccountNumber() {
		return loanAccountNumber;
	}

	public void setLoanAccountNumber(String loanAccountNumber) {
		this.loanAccountNumber = loanAccountNumber;
	}
 
	
	// Getters and Setters...
}
