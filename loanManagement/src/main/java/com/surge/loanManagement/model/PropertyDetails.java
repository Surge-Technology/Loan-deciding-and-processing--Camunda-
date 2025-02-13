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
@Table(name = "PROPERTY_DETAILS")
public class PropertyDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PROPERTY_ID")
    private long propertyId;

//    @ManyToOne
//    @JoinColumn(name = "LOAN_ID", nullable = false)
//    private LoanDetails loanDetails;

    @Column(name = "PROPERTY_ADDRESS", length = 2000)
    private String propertyAddress;

    @Column(name = "PROPERTY_TYPE")
    private String propertyType;

    @Column(name = "BUILT_YEAR")
    private int builtYear;

    @Column(name = "SQUARE_FEET")
    private double squareFeet;

    @Column(name = "LOT_SIZE")
    private double lotSize;

    @Column(name = "SPECIAL_FEATURES")
    private String specialFeatures;

    @Column(name = "NUMBER_OF_ROOMS")
    private String numberOfRooms;

    @Column(name = "PROPERTY_OWNER")
    private String propertyOwner;

    @Column(name = "PROPERTY_DOCUMENT")
    private String propertyDocument;

    @Column(name = "PROPERTY_WORTH")
    private int propertyWorth;

    @Column(name = "EXPLAIN_SPECIAL_FEATURE", length = 4000)
    private String explainSpecialFeature;

    @Column(name = "EXPLAIN_PROPERTY_CONDITION", length = 4000)
    private String explainPropertyCondition;

    @Column(name = "OCCUPANCY_TYPE")
    private String occupancyType;

    @Column(name = "START_DATE")
    private Date startDate;

    @Column(name = "END_DATE")
    private Date endDate;

    @ManyToOne
    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
    private CustomerDetails customerDetails;

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "CREATED_ON")
    private Date createdOn;

    @Column(name = "UPDATED_BY")
    private String updatedBy;

    @Column(name = "UPDATED_ON")
    private Date updatedOn;

	public long getPropertyId() {
		return propertyId;
	}

	public String getPropertyAddress() {
		return propertyAddress;
	}

	public String getPropertyType() {
		return propertyType;
	}

	public int getBuiltYear() {
		return builtYear;
	}

	public double getSquareFeet() {
		return squareFeet;
	}

	public double getLotSize() {
		return lotSize;
	}

	public String getSpecialFeatures() {
		return specialFeatures;
	}

	public String getNumberOfRooms() {
		return numberOfRooms;
	}

	public String getPropertyOwner() {
		return propertyOwner;
	}

	public String getPropertyDocument() {
		return propertyDocument;
	}

	public int getPropertyWorth() {
		return propertyWorth;
	}

	public String getExplainSpecialFeature() {
		return explainSpecialFeature;
	}

	public String getExplainPropertyCondition() {
		return explainPropertyCondition;
	}

	public String getOccupancyType() {
		return occupancyType;
	}

	public Date getStartDate() {
		return startDate;
	}

	public Date getEndDate() {
		return endDate;
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

	public String getUpdatedBy() {
		return updatedBy;
	}

	public Date getUpdatedOn() {
		return updatedOn;
	}

	public void setPropertyId(long propertyId) {
		this.propertyId = propertyId;
	}

	public void setPropertyAddress(String propertyAddress) {
		this.propertyAddress = propertyAddress;
	}

	public void setPropertyType(String propertyType) {
		this.propertyType = propertyType;
	}

	public void setBuiltYear(int builtYear) {
		this.builtYear = builtYear;
	}

	public void setSquareFeet(double squareFeet) {
		this.squareFeet = squareFeet;
	}

	public void setLotSize(double lotSize) {
		this.lotSize = lotSize;
	}

	public void setSpecialFeatures(String specialFeatures) {
		this.specialFeatures = specialFeatures;
	}

	public void setNumberOfRooms(String numberOfRooms) {
		this.numberOfRooms = numberOfRooms;
	}

	public void setPropertyOwner(String propertyOwner) {
		this.propertyOwner = propertyOwner;
	}

	public void setPropertyDocument(String propertyDocument) {
		this.propertyDocument = propertyDocument;
	}

	public void setPropertyWorth(int propertyWorth) {
		this.propertyWorth = propertyWorth;
	}

	public void setExplainSpecialFeature(String explainSpecialFeature) {
		this.explainSpecialFeature = explainSpecialFeature;
	}

	public void setExplainPropertyCondition(String explainPropertyCondition) {
		this.explainPropertyCondition = explainPropertyCondition;
	}

	public void setOccupancyType(String occupancyType) {
		this.occupancyType = occupancyType;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
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

	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}

	public void setUpdatedOn(Date updatedOn) {
		this.updatedOn = updatedOn;
	}


    
    
}
