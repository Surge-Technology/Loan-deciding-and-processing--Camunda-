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
@Table(name = "EMPLOYMENT_DETAILS")
public class EmploymentDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EMPLOYMENT_ID")
    private long employmentId;

    @ManyToOne
    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
    private CustomerDetails customerDetails;

    @Column(name = "COMPANY_NAME")
    private String companyName;

    @Column(name = "COMPANY_CONTACT_PERSON")
    private String companyContactPerson;

    @Column(name = "COMPANY_CONTACT_NUMBER")
    private String companyContactNumber;

    @Column(name = "COMPANY_CONTACT_MAIL")
    private String companyContactMail;

    @Column(name = "KIND_OF_EMPLOYMENT")
    private String kindOfEmployment;

    @Column(name = "GROSS_SALARY")
    private String grossSalary;

    @Column(name = "ANNUAL_PACKAGE")
    private String annualPackage;

    @Column(name = "DESIGNATION")
    private String designation;

    @Column(name = "EMPLOYEE_DOJ")
    private Date employeeDoj;

    @Column(name = "YEARS_OF_EXPERIENCE")
    private String yearsOfExperience;

    @Column(name = "ISCURRENT")
    private boolean isCurrent;

    @Column(name = "ADDRESS_LINE_1")
    private String addressLine1;

    @Column(name = "ADDRESS_LINE_2")
    private String addressLine2;  

    @Column(name = "CITY")
    private String city;  

    @Column(name = "STATE")
    private String state;  

    @Column(name = "POSTAL_CODE")
    private String postalCode; 

    @Column(name = "CREATED_BY")
    private String createdBy;

    @Column(name = "CREATED_ON")
    private Date createdOn;

    @Column(name = "UPDATED_BY")
    private String updatedBy;

    @Column(name = "UPDATED_ON")
    private Date updatedOn;

	public long getEmploymentId() {
		return employmentId;
	}

	public CustomerDetails getCustomerDetails() {
		return customerDetails;
	}

	public String getCompanyName() {
		return companyName;
	}

	public String getCompanyContactPerson() {
		return companyContactPerson;
	}

	public String getCompanyContactNumber() {
		return companyContactNumber;
	}

	public String getCompanyContactMail() {
		return companyContactMail;
	}

	public String getKindOfEmployment() {
		return kindOfEmployment;
	}

	public String getGrossSalary() {
		return grossSalary;
	}

	public String getAnnualPackage() {
		return annualPackage;
	}

	public String getDesignation() {
		return designation;
	}

	public Date getEmployeeDoj() {
		return employeeDoj;
	}

	public String getYearsOfExperience() {
		return yearsOfExperience;
	}

	public boolean isCurrent() {
		return isCurrent;
	}

	public String getAddressLine1() {
		return addressLine1;
	}

	public String getAddressLine2() {
		return addressLine2;
	}

	public String getCity() {
		return city;
	}

	public String getState() {
		return state;
	}

	public String getPostalCode() {
		return postalCode;
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

	public void setEmploymentId(long employmentId) {
		this.employmentId = employmentId;
	}

	public void setCustomerDetails(CustomerDetails customerDetails) {
		this.customerDetails = customerDetails;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public void setCompanyContactPerson(String companyContactPerson) {
		this.companyContactPerson = companyContactPerson;
	}

	public void setCompanyContactNumber(String companyContactNumber) {
		this.companyContactNumber = companyContactNumber;
	}

	public void setCompanyContactMail(String companyContactMail) {
		this.companyContactMail = companyContactMail;
	}

	public void setKindOfEmployment(String kindOfEmployment) {
		this.kindOfEmployment = kindOfEmployment;
	}

	public void setGrossSalary(String grossSalary) {
		this.grossSalary = grossSalary;
	}

	public void setAnnualPackage(String annualPackage) {
		this.annualPackage = annualPackage;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

	public void setEmployeeDoj(Date employeeDoj) {
		this.employeeDoj = employeeDoj;
	}

	public void setYearsOfExperience(String yearsOfExperience) {
		this.yearsOfExperience = yearsOfExperience;
	}

	public void setCurrent(boolean isCurrent) {
		this.isCurrent = isCurrent;
	}

	public void setAddressLine1(String addressLine1) {
		this.addressLine1 = addressLine1;
	}

	public void setAddressLine2(String addressLine2) {
		this.addressLine2 = addressLine2;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public void setState(String state) {
		this.state = state;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
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
