package com.surge.loanManagement.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.ApprovalDetails;
import com.surge.loanManagement.model.AssetDetails;
import com.surge.loanManagement.model.BankAccountDetails;
import com.surge.loanManagement.model.CreditCardDetails;
import com.surge.loanManagement.model.CustomerDetails;
import com.surge.loanManagement.model.EmploymentDetails;
import com.surge.loanManagement.model.FinanceDetails;
import com.surge.loanManagement.model.LiabilityDetails;
import com.surge.loanManagement.model.PropertyDetails;
import com.surge.loanManagement.model.RelationDetails;
import com.surge.loanManagement.repository.ApprovalRepository;
import com.surge.loanManagement.repository.AssetRepository;
import com.surge.loanManagement.repository.BankAccountRepository;
import com.surge.loanManagement.repository.CreditRepository;
import com.surge.loanManagement.repository.CustomerRepository;
import com.surge.loanManagement.repository.EmploymentRepository;
import com.surge.loanManagement.repository.FinanceRepository;
import com.surge.loanManagement.repository.LiabilityRepository;
import com.surge.loanManagement.repository.PropertyRepository;
import com.surge.loanManagement.repository.RelationRepository;

@Service
public class CustomerService {

	@Autowired
	CustomerRepository customerRepository;
	
	@Autowired
	EmploymentRepository employmentRepository;
	
	@Autowired
	BankAccountRepository bankAccountRepository;
	
	@Autowired
	AssetRepository assetRepository;
	
	@Autowired
	CreditRepository creditCardRepository;
	
	@Autowired
	ApprovalRepository approvalRepository;
	
	@Autowired
	FinanceRepository  financeRepository;
	
	@Autowired
	LiabilityRepository liabilityRepository;
	
	@Autowired
	PropertyRepository propertyRepository;
	
	@Autowired
	RelationRepository relationRepository;
	
	public String saveDetails(Map<String, Object> details) {
	    	   // Extract Customer Details
	        Map<String, Object> customerDetailsMap = (Map<String, Object>) details.get("customerDetails");
	        CustomerDetails customerDetails = new CustomerDetails();
	        customerDetails.setFirstName((String) customerDetailsMap.get("firstName"));
	        customerDetails.setLastName((String) customerDetailsMap.get("lastName"));
	        customerDetails.setCustomerEmail((String) customerDetailsMap.get("customerEmail"));
	        customerDetails.setAddressLine1((String) customerDetailsMap.get("addressLine1"));
	        customerDetails.setAddressLine2((String) customerDetailsMap.get("addressLine2"));
	        customerDetails.setCity((String) customerDetailsMap.get("city"));
	        customerDetails.setState((String) customerDetailsMap.get("state"));
	        customerDetails.setPostalCode((String) customerDetailsMap.get("postalCode"));
	        customerDetails = customerRepository.save(customerDetails);

	        // Extract Employment Details
	        Map<String, Object> employmentDetailsMap = (Map<String, Object>) details.get("employmentDetails");
	        EmploymentDetails employmentDetails = new EmploymentDetails();
	        employmentDetails.setCompanyName((String) employmentDetailsMap.get("companyName"));
	        employmentDetails.setGrossSalary((String) employmentDetailsMap.get("grossSalary"));
	        employmentDetails.setDesignation((String) employmentDetailsMap.get("designation"));
	        employmentDetails.setCustomerDetails(customerDetails);
	        employmentRepository.save(employmentDetails);

	        // Extract Bank Account Details
	        Map<String, Object> bankAccountDetailsMap = (Map<String, Object>) details.get("bankAccountDetails");
	        BankAccountDetails bankAccountDetails = new BankAccountDetails();
	        bankAccountDetails.setAccountNumber((String) bankAccountDetailsMap.get("accountNumber"));
	        bankAccountDetails.setBankName((String) bankAccountDetailsMap.get("bankName"));
	        bankAccountDetails.setIfscCode((String) bankAccountDetailsMap.get("ifscCode"));
	        bankAccountDetails.setAccountType((String) bankAccountDetailsMap.get("accountType"));
	        bankAccountDetails.setCurrentStatus("ACTIVE");
	        bankAccountDetails.setCustomerDetails(customerDetails);
	        bankAccountRepository.save(bankAccountDetails);

	        // Extract Asset Details
	        Map<String, Object> assetDetailsMap = (Map<String, Object>) details.get("assetDetails");
	        AssetDetails assetDetails = new AssetDetails();
	        assetDetails.setSavingDeposits((String) assetDetailsMap.get("savingDeposits"));
	        assetDetails.setStocksInvestment((String) assetDetailsMap.get("stocksInvestment"));
	        assetDetails.setMutualFundsShare((String) assetDetailsMap.get("mutualFundsShare"));
	        assetDetails.setMotorVehicle((String) assetDetailsMap.get("motorVehicle"));
	        assetDetails.setSuperannuation((String) assetDetailsMap.get("superannuation"));
	        assetDetails.setInsurance((String) assetDetailsMap.get("insurance"));
	        assetDetails.setOtherAssets((String) assetDetailsMap.get("otherAssets"));
	        assetDetails.setCustomerDetails(customerDetails);
	        assetRepository.save(assetDetails);

	        // Extract Credit Card Details
	        Map<String, Object> creditCardDetailsMap = (Map<String, Object>) details.get("creditCardDetails");
	        CreditCardDetails creditCardDetails = new CreditCardDetails();
	        creditCardDetails.setCreditCardBank((String) creditCardDetailsMap.get("creditCardBank"));
	        creditCardDetails.setCardPrimaryHolder((String) creditCardDetailsMap.get("cardPrimaryHolder"));
	        creditCardDetails.setCreditCardLimit((String) creditCardDetailsMap.get("creditCardLimit"));
	        creditCardDetails.setBalanceOnCard((String) creditCardDetailsMap.get("balanceOnCard"));
	        creditCardDetails.setCustomer(customerDetails);
	        creditCardRepository.save(creditCardDetails);

	        // Extract Approval Details
	        Map<String, Object> approvalDetailsMap = (Map<String, Object>) details.get("approvalDetails");
	        ApprovalDetails approvalDetails = new ApprovalDetails();
	        approvalDetails.setUnderwriterId((String) approvalDetailsMap.get("underwriterId"));
	        approvalDetails.setUnderwriterDecision((String) approvalDetailsMap.get("underwriterDecision"));
	        approvalDetails.setCreditBureau((String) approvalDetailsMap.get("creditBureau"));
	        approvalDetails.setCreditScore((String) approvalDetailsMap.get("creditScore"));
	        approvalDetails.setRiskAssessment((String) approvalDetailsMap.get("riskAssessment"));
	        approvalDetails.setIncomeVerificationStatus((String) approvalDetailsMap.get("incomeVerificationStatus"));
	        approvalDetails.setCollateralStatus((String) approvalDetailsMap.get("collateralStatus"));
	        approvalDetails.setApprovalStatus((String) approvalDetailsMap.get("approvalStatus"));
	        approvalDetails.setLoanStatus((String) approvalDetailsMap.get("loanStatus"));
	        approvalDetails.setUnderwriterComments((String) approvalDetailsMap.get("underwriterComments"));
	        approvalDetails.setCustomerDetails(customerDetails);
	        approvalRepository.save(approvalDetails);
	        
	        // Extract Finance Details
	        Map<String, Object> financeDetailsMap = (Map<String, Object>) details.get("financeDetails");
	        FinanceDetails financeDetails = new FinanceDetails();
	        financeDetails.setAnnualIncome((String) financeDetailsMap.get("annualIncome"));
	        financeDetails.setGrossRentals((String) financeDetailsMap.get("grossRentals"));
	        financeDetails.setInterestPaid((String) financeDetailsMap.get("interestPaid"));
	        financeDetails.setDividends((String) financeDetailsMap.get("dividends"));
	        financeDetails.setOtherIncome((String) financeDetailsMap.get("otherIncome"));
	        financeDetails.setRentalPaid((String) financeDetailsMap.get("rentalPaid"));
	        financeDetails.setGroceriesExpense((String) financeDetailsMap.get("groceriesExpense"));
	        financeDetails.setMedicalExpense((String) financeDetailsMap.get("medicalExpense"));
	        financeDetails.setCustomerDetails(customerDetails);
	        financeRepository.save(financeDetails);

	        Map<String, Object> liabilityDetailsMap = (Map<String, Object>) details.get("liabilityDetails");

	            LiabilityDetails liabilityDetails = new LiabilityDetails();
	            liabilityDetails.setLoanBank((String) liabilityDetailsMap.get("loanBank"));
	            liabilityDetails.setLoanType((String) liabilityDetailsMap.get("loanType"));
	            liabilityDetails.setBorrowerName((String) liabilityDetailsMap.get("borrowerName"));
	            liabilityDetails.setLoanAmount((String) liabilityDetailsMap.get("loanAmount"));
	            liabilityDetails.setCurrentLoanBalance((String) liabilityDetailsMap.get("currentLoanBalance"));
	            liabilityDetails.setCustomerDetails(customerDetails);
	            liabilityRepository.save(liabilityDetails);
	       

	        // Check if RelationDetails exists
	        Map<String, Object> relationDetailsMap = (Map<String, Object>) details.get("relationDetails");
	            RelationDetails relationDetails = new RelationDetails();
	            relationDetails.setFirstName((String) relationDetailsMap.get("firstName"));
	            relationDetails.setLastName((String) relationDetailsMap.get("lastName"));
	            relationDetails.setAddress((String) relationDetailsMap.get("address"));
	            relationDetails.setPhone((String) relationDetailsMap.get("phone"));
	            relationDetails.setRelationType((String) relationDetailsMap.get("relationType"));
	            relationDetails.setCustomerDetails(customerDetails); // Link relation to customer
	            relationRepository.save(relationDetails);
	      
	            
	            Map<String, Object> propertyDetailsMap = (Map<String, Object>) details.get("propertyDetails");

	                PropertyDetails propertyDetails = new PropertyDetails();
	                propertyDetails.setPropertyAddress((String) propertyDetailsMap.get("propertyAddress"));
	                propertyDetails.setPropertyType((String) propertyDetailsMap.get("propertyType"));
	                propertyDetails.setBuiltYear((Integer) propertyDetailsMap.get("builtYear"));
	                propertyDetails.setSquareFeet((Double) propertyDetailsMap.get("squareFeet"));
	                propertyDetails.setPropertyWorth((Integer) propertyDetailsMap.get("propertyWorth"));
	                propertyDetails.setCustomerDetails(customerDetails); 
	                propertyRepository.save(propertyDetails);
	       
	        
	        return "Details Saved Successfully";
	      
	    }
	
//	   public String saveDetails(Map<String, Object> details) {
//	        try {
//	            // Extract Customer Details
//	            Map<String, Object> customerDetailsMap = (Map<String, Object>) details.get("customerDetails");
//	            CustomerDetails customerDetails = new CustomerDetails();
//	            customerDetails.setFirstName((String) customerDetailsMap.get("firstName"));
//	            customerDetails.setLastName((String) customerDetailsMap.get("lastName"));
//	            customerDetails.setCustomerEmail((String) customerDetailsMap.get("customerEmail"));
//	            // Set other customer details here as needed
//	            customerDetails = customerRepository.save(customerDetails);
//
//	            // Extract Employment Details
//	            Map<String, Object> employmentDetailsMap = (Map<String, Object>) details.get("employmentDetails");
//	            EmploymentDetails employmentDetails = new EmploymentDetails();
//	            employmentDetails.setCompanyName((String) employmentDetailsMap.get("companyName"));
//	            employmentDetails.setGrossSalary((String) employmentDetailsMap.get("grossSalary"));
//	            employmentDetails.setDesignation((String) employmentDetailsMap.get("designation"));
//	            employmentDetails.setCustomerDetails(customerDetails); // Link employment to customer
//	            employmentRepository.save(employmentDetails);
//
//	            // Extract Bank Account Details
//	            Map<String, Object> bankAccountDetailsMap = (Map<String, Object>) details.get("bankAccountDetails");
//	            BankAccountDetails bankAccountDetails = new BankAccountDetails();
//	            bankAccountDetails.setAccountNumber((String) bankAccountDetailsMap.get("accountNumber"));
//	            bankAccountDetails.setBankName((String) bankAccountDetailsMap.get("bankName"));
//	            bankAccountDetails.setIfscCode((String) bankAccountDetailsMap.get("ifscCode"));
//	            bankAccountDetails.setAccountType((String) bankAccountDetailsMap.get("accountType"));
//	            bankAccountDetails.setCurrentStatus("ACTIVE"); // Set initial status or get from map
//	            bankAccountDetails.setCustomerDetails(customerDetails); // Link bank account to customer
//	            bankAccountRepository.save(bankAccountDetails);
//
//	            return "Details Saved Successfully";
//	        } catch (Exception e) {
//	            return "Error: " + e.getMessage();
//	        }
//	    }

	   
	 public CustomerDetails createCustomer(CustomerDetails customerDetails) {
	        return customerRepository.save(customerDetails);
	    }

	    public List<CustomerDetails> getAllCustomers() {
	        return customerRepository.findAll();
	    }

	    public CustomerDetails getCustomerById(long customerId) {
	        return customerRepository.findById(customerId)
	                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + customerId));
	    }

	    public CustomerDetails updateCustomer(long customerId, CustomerDetails customerDetails) {
	        CustomerDetails existingCustomer = getCustomerById(customerId);
	        existingCustomer.setNationalityId(customerDetails.getNationalityId());
	        existingCustomer.setFirstName(customerDetails.getFirstName());
	        existingCustomer.setLastName(customerDetails.getLastName());
	        existingCustomer.setLegalFullName(customerDetails.getLegalFullName());
	        existingCustomer.setCustomerDob(customerDetails.getCustomerDob());
	        existingCustomer.setCustomerGender(customerDetails.getCustomerGender());
	        existingCustomer.setCustomerPhoneNumber(customerDetails.getCustomerPhoneNumber());
	        existingCustomer.setCustomerEmail(customerDetails.getCustomerEmail());
	        existingCustomer.setCustomerMaritalStatus(customerDetails.getCustomerMaritalStatus());
	        existingCustomer.setCustomerNationalId(customerDetails.getCustomerNationalId());
	        existingCustomer.setSpouse(customerDetails.getSpouse());
	        existingCustomer.setEmploymentStatus(customerDetails.getEmploymentStatus());
	        existingCustomer.setCustomerNationalIdType(customerDetails.getCustomerNationalIdType());

	        return customerRepository.save(existingCustomer);
	    }

	    public void deleteCustomer(long customerId) {
	    	customerRepository.deleteById(customerId);
	    }
}
