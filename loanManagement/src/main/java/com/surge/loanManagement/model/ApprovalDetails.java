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
@Table(name = "APPROVAL_DETAILS")
public class ApprovalDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "APPROVAL_ID")
    private long approvalId;

    @ManyToOne
    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
    private CustomerDetails customerDetails;

    @ManyToOne
    @JoinColumn(name = "LOAN_ID", nullable = true)
    private LoanDetails loanDetails;

    @Column(name = "UNDERWRITER_ID")
    private String underwriterId;

    @Column(name = "UNDERWRITER_DECISION")
    private String underwriterDecision;

    @Column(name = "CREDIT_BUREAU")
    private String creditBureau;

    @Column(name = "CREDIT_SCORE")
    private String creditScore;

    @Column(name = "RISK_ASSESSMENT")
    private String riskAssessment;

    @Column(name = "INCOME_VERIFICATION_STATUS")
    private String incomeVerificationStatus;

    @Column(name = "COLLATERAL_STATUS")
    private String collateralStatus;

    @Column(name = "APPROVAL_STATUS")
    private String approvalStatus;

    @Column(name = "LOAN_STATUS")
    private String loanStatus;

    @Column(name = "UNDERWRITER_COMMENTS", length = 4000)
    private String underwriterComments;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "CREATED_ON")
    private Date createdOn;

    @Column(name = "UPDATED_BY")
    private String updatedBy;

    @Column(name = "UPDATED_ON")
    private Date updatedOn;

    // Getters and Setters

    public long getApprovalId() {
        return approvalId;
    }

    public void setApprovalId(long approvalId) {
        this.approvalId = approvalId;
    }

    public CustomerDetails getCustomerDetails() {
        return customerDetails;
    }

    public void setCustomerDetails(CustomerDetails customerDetails) {
        this.customerDetails = customerDetails;
    }

    public LoanDetails getLoanDetails() {
        return loanDetails;
    }

    public void setLoanDetails(LoanDetails loanDetails) {
        this.loanDetails = loanDetails;
    }

    public String getUnderwriterId() {
        return underwriterId;
    }

    public void setUnderwriterId(String underwriterId) {
        this.underwriterId = underwriterId;
    }

    public String getUnderwriterDecision() {
        return underwriterDecision;
    }

    public void setUnderwriterDecision(String underwriterDecision) {
        this.underwriterDecision = underwriterDecision;
    }

    public String getCreditBureau() {
        return creditBureau;
    }

    public void setCreditBureau(String creditBureau) {
        this.creditBureau = creditBureau;
    }

    public String getCreditScore() {
        return creditScore;
    }

    public void setCreditScore(String creditScore) {
        this.creditScore = creditScore;
    }

    public String getRiskAssessment() {
        return riskAssessment;
    }

    public void setRiskAssessment(String riskAssessment) {
        this.riskAssessment = riskAssessment;
    }

    public String getIncomeVerificationStatus() {
        return incomeVerificationStatus;
    }

    public void setIncomeVerificationStatus(String incomeVerificationStatus) {
        this.incomeVerificationStatus = incomeVerificationStatus;
    }

    public String getCollateralStatus() {
        return collateralStatus;
    }

    public void setCollateralStatus(String collateralStatus) {
        this.collateralStatus = collateralStatus;
    }

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public String getLoanStatus() {
        return loanStatus;
    }

    public void setLoanStatus(String loanStatus) {
        this.loanStatus = loanStatus;
    }

    public String getUnderwriterComments() {
        return underwriterComments;
    }

    public void setUnderwriterComments(String underwriterComments) {
        this.underwriterComments = underwriterComments;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Date getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(Date createdOn) {
        this.createdOn = createdOn;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Date getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(Date updatedOn) {
        this.updatedOn = updatedOn;
    }
}
