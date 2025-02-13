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
@Table(name = "FINANCIAL_DETAILS")
public class FinanceDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FINANCE_ID")
    private long financeId;

    @Column(name = "ANNUAL_INCOME")
    private String annualIncome;

    @Column(name = "GROSS_RENTALS")
    private String grossRentals;

    @ManyToOne
    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
    private CustomerDetails customerDetails;

    @Column(name = "INTEREST_PAID")
    private String interestPaid;

    @Column(name = "DIVIDENDS")
    private String dividends;

    @Column(name = "OTHER_INCOME")
    private String otherIncome;

    @Column(name = "RENTAL_PAID")
    private String rentalPaid;

    @Column(name = "GROCERIES_EXPENSE")
    private String groceriesExpense;

    @Column(name = "MEDICAL_EXPENSE")
    private String medicalExpense;

    @Column(name = "CLOTHING_EXPENSE")
    private String clothingExpense;

    @Column(name = "RECREATION_EXPENSE")
    private String recreationExpense;

    @Column(name = "PERSONAL_INSURANCE")
    private String personalInsurance;

    @Column(name = "COMMUNICATIONS_EXPENSE")
    private String communicationsExpense;

    @Column(name = "TRANSPORTATION_EXPENSE")
    private String transportationExpense;

    @Column(name = "EDUCATION_EXPENSE")
    private String educationExpense;

    @Column(name = "CHILDCARE_EXPENSE")
    private String childcareExpense;

    @Column(name = "OTHER_EXPENSE")
    private String otherExpense;

    @Column(name = "SAVING_DEPOSITS")
    private String savingDeposits;

    @Column(name = "STOCKS_INVESTMENT")
    private String stocksInvestment;

    @Column(name = "MUTUAL_FUND_SHARE")
    private String mutualFundShare;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "CREATED_ON")
    private Date createdOn;

    @Column(name = "MODIFIED_BY")
    private String modifiedBy;

    @Column(name = "MODIFIED_ON")
    private Date modifiedOn;

	public long getFinanceId() {
		return financeId;
	}

	public String getAnnualIncome() {
		return annualIncome;
	}

	public String getGrossRentals() {
		return grossRentals;
	}

	public CustomerDetails getCustomerDetails() {
		return customerDetails;
	}

	public String getInterestPaid() {
		return interestPaid;
	}

	public String getDividends() {
		return dividends;
	}

	public String getOtherIncome() {
		return otherIncome;
	}

	public String getRentalPaid() {
		return rentalPaid;
	}

	public String getGroceriesExpense() {
		return groceriesExpense;
	}

	public String getMedicalExpense() {
		return medicalExpense;
	}

	public String getClothingExpense() {
		return clothingExpense;
	}

	public String getRecreationExpense() {
		return recreationExpense;
	}

	public String getPersonalInsurance() {
		return personalInsurance;
	}

	public String getCommunicationsExpense() {
		return communicationsExpense;
	}

	public String getTransportationExpense() {
		return transportationExpense;
	}

	public String getEducationExpense() {
		return educationExpense;
	}

	public String getChildcareExpense() {
		return childcareExpense;
	}

	public String getOtherExpense() {
		return otherExpense;
	}

	public String getSavingDeposits() {
		return savingDeposits;
	}

	public String getStocksInvestment() {
		return stocksInvestment;
	}

	public String getMutualFundShare() {
		return mutualFundShare;
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

	public void setFinanceId(long financeId) {
		this.financeId = financeId;
	}

	public void setAnnualIncome(String annualIncome) {
		this.annualIncome = annualIncome;
	}

	public void setGrossRentals(String grossRentals) {
		this.grossRentals = grossRentals;
	}

	public void setCustomerDetails(CustomerDetails customerDetails) {
		this.customerDetails = customerDetails;
	}

	public void setInterestPaid(String interestPaid) {
		this.interestPaid = interestPaid;
	}

	public void setDividends(String dividends) {
		this.dividends = dividends;
	}

	public void setOtherIncome(String otherIncome) {
		this.otherIncome = otherIncome;
	}

	public void setRentalPaid(String rentalPaid) {
		this.rentalPaid = rentalPaid;
	}

	public void setGroceriesExpense(String groceriesExpense) {
		this.groceriesExpense = groceriesExpense;
	}

	public void setMedicalExpense(String medicalExpense) {
		this.medicalExpense = medicalExpense;
	}

	public void setClothingExpense(String clothingExpense) {
		this.clothingExpense = clothingExpense;
	}

	public void setRecreationExpense(String recreationExpense) {
		this.recreationExpense = recreationExpense;
	}

	public void setPersonalInsurance(String personalInsurance) {
		this.personalInsurance = personalInsurance;
	}

	public void setCommunicationsExpense(String communicationsExpense) {
		this.communicationsExpense = communicationsExpense;
	}

	public void setTransportationExpense(String transportationExpense) {
		this.transportationExpense = transportationExpense;
	}

	public void setEducationExpense(String educationExpense) {
		this.educationExpense = educationExpense;
	}

	public void setChildcareExpense(String childcareExpense) {
		this.childcareExpense = childcareExpense;
	}

	public void setOtherExpense(String otherExpense) {
		this.otherExpense = otherExpense;
	}

	public void setSavingDeposits(String savingDeposits) {
		this.savingDeposits = savingDeposits;
	}

	public void setStocksInvestment(String stocksInvestment) {
		this.stocksInvestment = stocksInvestment;
	}

	public void setMutualFundShare(String mutualFundShare) {
		this.mutualFundShare = mutualFundShare;
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
