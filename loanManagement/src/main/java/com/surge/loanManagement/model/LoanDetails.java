package com.surge.loanManagement.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "LOAN_DETAILS")
public class LoanDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LOAN_ID")
    private long loanId;

    @ManyToOne
    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
    private CustomerDetails customerDetails;

    @Column(name = "LOAN_TYPE")
    private String loanType;

    @Column(name = "LOAN_AMOUNT")
    private int loanAmount;

    @Column(name = "PRIORITY")
    private String priority;

    @Column(name = "CURRENCY")
    private String currency;

    @Column(name = "REPAY_PLAN")
    private String repayPlan;

    @Column(name = "INTEREST_RATE")
    private BigDecimal interestRate;

    @Column(name = "EMI_AMOUNT")
    private int emiAmount;

    @Column(name = "EXPECTED_DATE")
    private Date expectedDate;

    @Column(name = "OTHER_COMMENTS")
    private String otherComments;

    @Column(name = "REPAY_DURATION")
    private String repayDuration;

    @Column(name = "PURPOSE_OF_LOAN")
    private String purposeOfLoan;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "CREATED_ON")
    private Date createdOn;

    @Column(name = "UPDATED_BY")
    private String updatedBy;

    @Column(name = "UPDATED_ON")
    private Date updatedOn;

    @Column(name = "UNDERWRITER_DECISION")
    private String underwriterDecision;

    @Column(name = "CONSENT_OF_BORROWER")
    private String consentOfBorrower;

    @Column(name = "LOANSTATUS")
    private String loanStatus;

//    // Mapping liabilities
//    @OneToMany(mappedBy = "loanDetails")
//    private List<LiabilityDetails> liabilityDetails;

    @OneToMany(mappedBy = "loanDetails")
    private List<AuditDetails> auditDetails;

//    @OneToMany(mappedBy = "loanDetails")
//    private List<DocumentDetails> documentDetails;

	public long getLoanId() {
		return loanId;
	}

	public CustomerDetails getCustomerDetails() {
		return customerDetails;
	}

	public String getLoanType() {
		return loanType;
	}

	public int getLoanAmount() {
		return loanAmount;
	}

	public String getPriority() {
		return priority;
	}

	public String getCurrency() {
		return currency;
	}

	public String getRepayPlan() {
		return repayPlan;
	}

	public BigDecimal getInterestRate() {
		return interestRate;
	}

	public int getEmiAmount() {
		return emiAmount;
	}

	public Date getExpectedDate() {
		return expectedDate;
	}

	public String getOtherComments() {
		return otherComments;
	}

	public String getRepayDuration() {
		return repayDuration;
	}

	public String getPurposeOfLoan() {
		return purposeOfLoan;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public String getUpdatedBy() {
		return updatedBy;
	}

	public Date getUpdatedOn() {
		return updatedOn;
	}

	public String getUnderwriterDecision() {
		return underwriterDecision;
	}

	public String getConsentOfBorrower() {
		return consentOfBorrower;
	}

	public String getLoanStatus() {
		return loanStatus;
	}

	public List<AuditDetails> getAuditDetails() {
		return auditDetails;
	}

	public void setLoanId(long loanId) {
		this.loanId = loanId;
	}

	public void setCustomerDetails(CustomerDetails customerDetails) {
		this.customerDetails = customerDetails;
	}

	public void setLoanType(String loanType) {
		this.loanType = loanType;
	}

	public void setLoanAmount(int loanAmount) {
		this.loanAmount = loanAmount;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public void setRepayPlan(String repayPlan) {
		this.repayPlan = repayPlan;
	}

	public void setInterestRate(BigDecimal interestRate) {
		this.interestRate = interestRate;
	}

	public void setEmiAmount(int emiAmount) {
		this.emiAmount = emiAmount;
	}

	public void setExpectedDate(Date expectedDate) {
		this.expectedDate = expectedDate;
	}

	public void setOtherComments(String otherComments) {
		this.otherComments = otherComments;
	}

	public void setRepayDuration(String repayDuration) {
		this.repayDuration = repayDuration;
	}

	public void setPurposeOfLoan(String purposeOfLoan) {
		this.purposeOfLoan = purposeOfLoan;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}

	public void setUpdatedOn(Date updatedOn) {
		this.updatedOn = updatedOn;
	}

	public void setUnderwriterDecision(String underwriterDecision) {
		this.underwriterDecision = underwriterDecision;
	}

	public void setConsentOfBorrower(String consentOfBorrower) {
		this.consentOfBorrower = consentOfBorrower;
	}

	public void setLoanStatus(String loanStatus) {
		this.loanStatus = loanStatus;
	}

	public void setAuditDetails(List<AuditDetails> auditDetails) {
		this.auditDetails = auditDetails;
	}

}
