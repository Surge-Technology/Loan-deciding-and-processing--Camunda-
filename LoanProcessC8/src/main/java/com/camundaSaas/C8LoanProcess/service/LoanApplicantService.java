package com.camundaSaas.C8LoanProcess.service;

import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.camundaSaas.C8LoanProcess.Repository.LoanApplicantRepository;
import com.camundaSaas.C8LoanProcess.model.LoanApplicantDetails;
import com.camundaSaas.C8LoanProcess.model.RepaymentSchedule;


@Service
public class LoanApplicantService {

	@Autowired
	LoanApplicantRepository loanApplicantDetailsRepository;

		
	  public List<LoanApplicantDetails> getAllLoanDetailsByEmail(String emailId) {
	        return loanApplicantDetailsRepository.findAllByEmailIdOrderByCreatedDateDesc(emailId);
	    }


	public LoanApplicantDetails getapplicantData(String loanAccountNumber) {
		
		return loanApplicantDetailsRepository.findByLoanAccountNumber(loanAccountNumber);
	}
	   

	  
	
}
