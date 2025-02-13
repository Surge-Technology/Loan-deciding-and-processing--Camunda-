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
@Table(name = "BANK_ACCOUNT_DETAILS")
public class BankAccountDetails {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ACCOUNT_ID")
    private long accountId;

    @Column(name = "ACCOUNT_NUMBER")
    private String accountNumber;


    @Column(name = "BANK_NAME")
    private String bankName;



    @Column(name = "IFSC_CODE")
    private String ifscCode;



    @Column(name = "ACCOUNT_TYPE")
    private String accountType;

    @Column(name = "STATUS")
    private String currentStatus;

    @Column(name = "CURRENCY_ID")
    private String currencyId;

    @ManyToOne
    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
    private CustomerDetails customerDetails;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "CREATED_ON")
    private Date createdOn;

    @Column(name = "MODIFIED_BY")
    private String modifiedBy;

    @Column(name = "MODIFIED_ON")
    private Date modifiedOn;

	public long getAccountId() {
		return accountId;
	}

	public String getAccountNumber() {
		return accountNumber;
	}

	public String getBankName() {
		return bankName;
	}

	public String getIfscCode() {
		return ifscCode;
	}

	public String getAccountType() {
		return accountType;
	}

	public String getCurrentStatus() {
		return currentStatus;
	}

	public String getCurrencyId() {
		return currencyId;
	}

	public CustomerDetails getCustomerDetails() {
		return customerDetails;
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

	public void setAccountId(long accountId) {
		this.accountId = accountId;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public void setIfscCode(String ifscCode) {
		this.ifscCode = ifscCode;
	}

	public void setAccountType(String accountType) {
		this.accountType = accountType;
	}

	public void setCurrentStatus(String currentStatus) {
		this.currentStatus = currentStatus;
	}

	public void setCurrencyId(String currencyId) {
		this.currencyId = currencyId;
	}

	public void setCustomerDetails(CustomerDetails customerDetails) {
		this.customerDetails = customerDetails;
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
