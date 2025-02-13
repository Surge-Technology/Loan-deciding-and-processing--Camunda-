package com.surge.loanManagement.model;

import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "CUSTOMER_DETAILS")
public class CustomerDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CUSTOMER_ID")
    private long customerId;

    @Column(name = "NATIONALITY_ID")
    private String nationalityId;

    @Column(name = "FIRST_NAME")
    private String firstName;

    @Column(name = "LAST_NAME")
    private String lastName;

    @Column(name = "LEGAL_FULL_NAME")
    private String legalFullName;

    @Column(name = "CUSTOMER_DOB")
    private Date customerDob;

    @Column(name = "CUSTOMER_GENDER")
    private String customerGender;

    @Column(name = "CUSTOMER_PHONE_NUMBER")
    private String customerPhoneNumber;

    @Column(name = "CUSTOMER_EMAIL")
    private String customerEmail;

    @Column(name = "CUSTOMER_MARITAL_STATUS")
    private String customerMaritalStatus;

    @Column(name = "CUSTOMER_NATIONAL_ID")
    private String customerNationalId;

    @Column(name = "SPOUSE")
    private String spouse;

    @Column(name = "EMPLOYMENT_STATUS")
    private String employmentStatus;

    @Column(name = "CUSTOMER_NATIONAL_ID_TYPE")
    private String customerNationalIdType;

    // The below fields are to be added (but not yet defined in the class)
    @Column(name = "ADDRESS_LINE_1")
    private String addressLine1;

    @Column(name = "ADDRESS_LINE_2")
    private String addressLine2;

    @Column(name = "YEARS_OF_RESIDENCE")
    private String yearsOfResidence;

    @Column(name = "CITY")
    private String city;

    @Column(name = "STATE")
    private String state;

    @Column(name = "POSTAL_CODE")
    private String postalCode;

    @OneToMany(mappedBy = "customerDetails")
    private List<LoanDetails> loanDetails;

    @OneToMany(mappedBy = "customerDetails")
    private List<RelationDetails> relationDetails;

//    @OneToMany(mappedBy = "customerDetails")
//    private List<DocumentDetails> documentDetails;

    @OneToMany(mappedBy = "customerDetails")
    private List<EmploymentDetails> employmentDetails;

    @OneToMany(mappedBy = "customerDetails")
    private List<PropertyDetails> propertyDetails;

    @OneToMany(mappedBy = "customerDetails", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BankAccountDetails> bankAccountDetails;

    @OneToMany(mappedBy = "customerDetails", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FinanceDetails> financeDetails;

    @OneToMany(mappedBy = "customerDetails", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<LiabilityDetails> liabilityDetails;

    @OneToMany(mappedBy = "customerDetails", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CreditCardDetails> creditCardDetails;

    @OneToMany(mappedBy = "customerDetails", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AssetDetails> assetDetails;

	public long getCustomerId() {
		return customerId;
	}

	public String getNationalityId() {
		return nationalityId;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public String getLegalFullName() {
		return legalFullName;
	}

	public Date getCustomerDob() {
		return customerDob;
	}

	public String getCustomerGender() {
		return customerGender;
	}

	public String getCustomerPhoneNumber() {
		return customerPhoneNumber;
	}

	public String getCustomerEmail() {
		return customerEmail;
	}

	public String getCustomerMaritalStatus() {
		return customerMaritalStatus;
	}

	public String getCustomerNationalId() {
		return customerNationalId;
	}

	public String getSpouse() {
		return spouse;
	}

	public String getEmploymentStatus() {
		return employmentStatus;
	}

	public String getCustomerNationalIdType() {
		return customerNationalIdType;
	}

	public String getAddressLine1() {
		return addressLine1;
	}

	public String getAddressLine2() {
		return addressLine2;
	}

	public String getYearsOfResidence() {
		return yearsOfResidence;
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

	public List<LoanDetails> getLoanDetails() {
		return loanDetails;
	}

	public List<RelationDetails> getRelationDetails() {
		return relationDetails;
	}

	public List<EmploymentDetails> getEmploymentDetails() {
		return employmentDetails;
	}

	public List<PropertyDetails> getPropertyDetails() {
		return propertyDetails;
	}

	public List<BankAccountDetails> getBankAccountDetails() {
		return bankAccountDetails;
	}

	public List<FinanceDetails> getFinanceDetails() {
		return financeDetails;
	}

	public List<LiabilityDetails> getLiabilityDetails() {
		return liabilityDetails;
	}

	public List<CreditCardDetails> getCreditCardDetails() {
		return creditCardDetails;
	}

	public List<AssetDetails> getAssetDetails() {
		return assetDetails;
	}

	public void setCustomerId(long customerId) {
		this.customerId = customerId;
	}

	public void setNationalityId(String nationalityId) {
		this.nationalityId = nationalityId;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public void setLegalFullName(String legalFullName) {
		this.legalFullName = legalFullName;
	}

	public void setCustomerDob(Date customerDob) {
		this.customerDob = customerDob;
	}

	public void setCustomerGender(String customerGender) {
		this.customerGender = customerGender;
	}

	public void setCustomerPhoneNumber(String customerPhoneNumber) {
		this.customerPhoneNumber = customerPhoneNumber;
	}

	public void setCustomerEmail(String customerEmail) {
		this.customerEmail = customerEmail;
	}

	public void setCustomerMaritalStatus(String customerMaritalStatus) {
		this.customerMaritalStatus = customerMaritalStatus;
	}

	public void setCustomerNationalId(String customerNationalId) {
		this.customerNationalId = customerNationalId;
	}

	public void setSpouse(String spouse) {
		this.spouse = spouse;
	}

	public void setEmploymentStatus(String employmentStatus) {
		this.employmentStatus = employmentStatus;
	}

	public void setCustomerNationalIdType(String customerNationalIdType) {
		this.customerNationalIdType = customerNationalIdType;
	}

	public void setAddressLine1(String addressLine1) {
		this.addressLine1 = addressLine1;
	}

	public void setAddressLine2(String addressLine2) {
		this.addressLine2 = addressLine2;
	}

	public void setYearsOfResidence(String yearsOfResidence) {
		this.yearsOfResidence = yearsOfResidence;
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

	public void setLoanDetails(List<LoanDetails> loanDetails) {
		this.loanDetails = loanDetails;
	}

	public void setRelationDetails(List<RelationDetails> relationDetails) {
		this.relationDetails = relationDetails;
	}

	public void setEmploymentDetails(List<EmploymentDetails> employmentDetails) {
		this.employmentDetails = employmentDetails;
	}

	public void setPropertyDetails(List<PropertyDetails> propertyDetails) {
		this.propertyDetails = propertyDetails;
	}

	public void setBankAccountDetails(List<BankAccountDetails> bankAccountDetails) {
		this.bankAccountDetails = bankAccountDetails;
	}

	public void setFinanceDetails(List<FinanceDetails> financeDetails) {
		this.financeDetails = financeDetails;
	}

	public void setLiabilityDetails(List<LiabilityDetails> liabilityDetails) {
		this.liabilityDetails = liabilityDetails;
	}

	public void setCreditCardDetails(List<CreditCardDetails> creditCardDetails) {
		this.creditCardDetails = creditCardDetails;
	}

	public void setAssetDetails(List<AssetDetails> assetDetails) {
		this.assetDetails = assetDetails;
	}

    
}
