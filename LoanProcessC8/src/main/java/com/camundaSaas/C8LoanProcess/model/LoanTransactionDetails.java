package com.camundaSaas.C8LoanProcess.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Version;
@Entity
@Table(name = "Loan_Transaction_Details")
public class LoanTransactionDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long loanId;
	private String uanId;
	private String transactionStatus;
	private LocalDate date;
	private String loanAccountNumber;
	private Long loanAmount;
	private String paymentType;
	private Long transactionAmount;
	private Long balanceAmount;
	private String email;

	private String paymentMethod;

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

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
 
	public static List<LoanTransactionDetails> findByLoanAccountNumber(String loanAccountNumber2) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public String toString() {
	    return "LoanTransactionDetails{" +
	            "loanAccountNumber='" + loanAccountNumber + '\'' +
	            ", date=" + date +
	            ", paymentType='" + paymentType + '\'' +
	            ", transactionAmount=" + transactionAmount +
	            ", loanAmount=" + loanAmount +
	            ", balanceAmount=" + balanceAmount +
	            '}';
	}
 
}