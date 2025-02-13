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
@Table(name = "AUDIT_DETAILS")
public class AuditDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AUDIT_ID")
    private long auditId;

    @ManyToOne
    @JoinColumn(name = "LOAN_ID", nullable = false)
    private LoanDetails loanDetails;

    @Column(name = "ACTION_TYPE")
    private String actionType;

    @Column(name = "PERFORMED_BY")
    private String performedBy;

    @Column(name = "PERFORMED_ON")
    private Date performedOn;

    @Column(name = "ACTION_NAME")
    private String actionName;

    @Column(name = "ACTION_DESCRIPTION", length = 4000)  
    private String actionDescription;

	public long getAuditId() {
		return auditId;
	}

	public LoanDetails getLoan() {
		return loanDetails;
	}

	public String getActionType() {
		return actionType;
	}

	public String getPerformedBy() {
		return performedBy;
	}

	public Date getPerformedOn() {
		return performedOn;
	}

	public String getActionName() {
		return actionName;
	}

	public String getActionDescription() {
		return actionDescription;
	}

	public void setAuditId(long auditId) {
		this.auditId = auditId;
	}

	public void setLoan(LoanDetails loanDetails) {
		this.loanDetails = loanDetails;
	}

	public void setActionType(String actionType) {
		this.actionType = actionType;
	}

	public void setPerformedBy(String performedBy) {
		this.performedBy = performedBy;
	}

	public void setPerformedOn(Date performedOn) {
		this.performedOn = performedOn;
	}

	public void setActionName(String actionName) {
		this.actionName = actionName;
	}

	public void setActionDescription(String actionDescription) {
		this.actionDescription = actionDescription;
	}
}
