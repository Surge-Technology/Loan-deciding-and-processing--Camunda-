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
@Table(name = "CREDIT_CARD_DETAILS")
public class CreditCardDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CREDIT_ID")
    private Long creditId;

    @ManyToOne
    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
    private CustomerDetails customerDetails;

    @ManyToOne
    @JoinColumn(name = "LOAN_APP_ID", nullable = true)
    private LoanDetails loanDetails;

    @Column(name = "CREDIT_CARD_BANK")
    private String creditCardBank;

    @Column(name = "CARD_PRIMARY_HOLDER")
    private String cardPrimaryHolder;

    @Column(name = "CREDIT_CARD_LIMIT")
    private String creditCardLimit;

    @Column(name = "BALANCE_ON_CARD")
    private String balanceOnCard;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "CREATED_ON")
    private Date createdOn;

    @Column(name = "MODIFIED_BY")
    private String modifiedBy;

    @Column(name = "MODIFIED_ON")
    private Date modifiedOn;

	public Long getCreditId() {
		return creditId;
	}
	public CustomerDetails getCustomer() {
		return customerDetails;
	}
	public LoanDetails getLoan() {
		return loanDetails;
	}
	public String getCreditCardBank() {
		return creditCardBank;
	}
	public String getCardPrimaryHolder() {
		return cardPrimaryHolder;
	}
	public String getCreditCardLimit() {
		return creditCardLimit;
	}
	public String getBalanceOnCard() {
		return balanceOnCard;
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
	public void setCreditId(Long creditId) {
		this.creditId = creditId;
	}
	public void setCustomer(CustomerDetails customerDetails) {
		this.customerDetails = customerDetails;
	}
	public void setLoan(LoanDetails loanDetails) {
		this.loanDetails = loanDetails;
	}
	public void setCreditCardBank(String creditCardBank) {
		this.creditCardBank = creditCardBank;
	}
	public void setCardPrimaryHolder(String cardPrimaryHolder) {
		this.cardPrimaryHolder = cardPrimaryHolder;
	}
	public void setCreditCardLimit(String creditCardLimit) {
		this.creditCardLimit = creditCardLimit;
	}
	public void setBalanceOnCard(String balanceOnCard) {
		this.balanceOnCard = balanceOnCard;
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
