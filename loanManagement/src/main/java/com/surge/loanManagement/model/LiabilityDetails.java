package com.surge.loanManagement.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "LIABILITY_DETAILS")
public class LiabilityDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LIABILITY_ID")
    private long liabilityId;

    @ManyToOne
    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
    private CustomerDetails customerDetails;

//    @ManyToOne
//    @JoinColumn(name = "LOAN_ID", nullable = false)
//    private LoanDetails loanDetails; // Mapping the liability to the loan

    @Column(name = "LOAN_BANK")
    private String loanBank;

    @Column(name = "LOAN_TYPE")
    private String loanType;

    @Column(name = "BORROWER_NAME")
    private String borrowerName;

    @Column(name = "LOAN_AMOUNT")
    private String loanAmount;

    @Column(name = "LOAN_INTEREST")
    private String loanInterest;

    @Column(name = "CURRENT_LOAN_LIMIT")
    private String currentLoanLimit;

    @Column(name = "CURRENT_LOAN_BALANCE")
    private String currentLoanBalance;

    @Column(name = "PAYMENT_TENURE_REMAINING")
    private String paymentTenureRemaining;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "CREATED_ON")
    private Date createdOn;

    @Column(name = "MODIFIED_BY")
    private String modifiedBy;

    @Column(name = "MODIFIED_ON")
    private Date modifiedOn;

	public long getLiabilityId() {
		return liabilityId;
	}

	public CustomerDetails getCustomerDetails() {
		return customerDetails;
	}

	public String getLoanBank() {
		return loanBank;
	}

	public String getLoanType() {
		return loanType;
	}

	public String getBorrowerName() {
		return borrowerName;
	}

	public String getLoanAmount() {
		return loanAmount;
	}

	public String getLoanInterest() {
		return loanInterest;
	}

	public String getCurrentLoanLimit() {
		return currentLoanLimit;
	}

	public String getCurrentLoanBalance() {
		return currentLoanBalance;
	}

	public String getPaymentTenureRemaining() {
		return paymentTenureRemaining;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public String getModifiedBy() {
		return modifiedBy;
	}

	public Date getModifiedOn() {
		return modifiedOn;
	}

	public void setLiabilityId(long liabilityId) {
		this.liabilityId = liabilityId;
	}

	public void setCustomerDetails(CustomerDetails customerDetails) {
		this.customerDetails = customerDetails;
	}

	public void setLoanBank(String loanBank) {
		this.loanBank = loanBank;
	}

	public void setLoanType(String loanType) {
		this.loanType = loanType;
	}

	public void setBorrowerName(String borrowerName) {
		this.borrowerName = borrowerName;
	}

	public void setLoanAmount(String loanAmount) {
		this.loanAmount = loanAmount;
	}

	public void setLoanInterest(String loanInterest) {
		this.loanInterest = loanInterest;
	}

	public void setCurrentLoanLimit(String currentLoanLimit) {
		this.currentLoanLimit = currentLoanLimit;
	}

	public void setCurrentLoanBalance(String currentLoanBalance) {
		this.currentLoanBalance = currentLoanBalance;
	}

	public void setPaymentTenureRemaining(String paymentTenureRemaining) {
		this.paymentTenureRemaining = paymentTenureRemaining;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	public void setModifiedOn(Date modifiedOn) {
		this.modifiedOn = modifiedOn;
	}
    
    
}
