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
@Table(name = "ASSET_DETAILS")
public class AssetDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ASSET_ID")
    private long assetId;

    @ManyToOne
    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
    private CustomerDetails customerDetails;

    @Column(name = "SAVING_DEPOSITS")
    private String savingDeposits;

    @Column(name = "STOCKS_INVESTMENT")
    private String stocksInvestment;

    @Column(name = "MUTUAL_FUNDS_SHARE")
    private String mutualFundsShare;

    @Column(name = "MOTOR_VEHICLE")
    private String motorVehicle;

    @Column(name = "SUPERANNUATION")
    private String superannuation;

    @Column(name = "INSURANCE")
    private String insurance;

    @Column(name = "OTHER_ASSETS")
    private String otherAssets;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "CREATED_ON")
    private Date createdOn;

    @Column(name = "MODIFIED_BY")
    private String modifiedBy;

    @Column(name = "MODIFIED_ON")
    private Date modifiedOn;

	public long getAssetId() {
		return assetId;
	}

	public CustomerDetails getCustomerDetails() {
		return customerDetails;
	}

	public String getSavingDeposits() {
		return savingDeposits;
	}

	public String getStocksInvestment() {
		return stocksInvestment;
	}

	public String getMutualFundsShare() {
		return mutualFundsShare;
	}

	public String getMotorVehicle() {
		return motorVehicle;
	}

	public String getSuperannuation() {
		return superannuation;
	}

	public String getInsurance() {
		return insurance;
	}

	public String getOtherAssets() {
		return otherAssets;
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

	public void setAssetId(long assetId) {
		this.assetId = assetId;
	}

	public void setCustomerDetails(CustomerDetails customerDetails) {
		this.customerDetails = customerDetails;
	}

	public void setSavingDeposits(String savingDeposits) {
		this.savingDeposits = savingDeposits;
	}

	public void setStocksInvestment(String stocksInvestment) {
		this.stocksInvestment = stocksInvestment;
	}

	public void setMutualFundsShare(String mutualFundsShare) {
		this.mutualFundsShare = mutualFundsShare;
	}

	public void setMotorVehicle(String motorVehicle) {
		this.motorVehicle = motorVehicle;
	}

	public void setSuperannuation(String superannuation) {
		this.superannuation = superannuation;
	}

	public void setInsurance(String insurance) {
		this.insurance = insurance;
	}

	public void setOtherAssets(String otherAssets) {
		this.otherAssets = otherAssets;
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
