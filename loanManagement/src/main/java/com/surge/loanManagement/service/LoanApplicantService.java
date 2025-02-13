package com.surge.loanManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.LoanApplicantDetails;
import com.surge.loanManagement.repository.LoanApplicantDetailsRepository;

@Service
public class LoanApplicantService {

	@Autowired
	LoanApplicantDetailsRepository loanApplicantDetailsRepository;
	
//	public List<LoanApplicantDetails> getAllLoanDetailsByEmail(String emailId) {
//	    return loanApplicantDetailsRepository.findAllByEmailIdSortedByDate(emailId);
//	}
//	
	  public List<LoanApplicantDetails> getAllLoanDetailsByEmail(String emailId) {
	        return loanApplicantDetailsRepository.findAllByEmailIdOrderByCreatedDateDesc(emailId);
	    }
	  
//	  public LoanApplicantDetails updateApplicant(Long id, String jsonData) {
//		    LoanApplicantDetails applicant = repository.findById(id)
//		            .orElseThrow(() -> new RuntimeException("Applicant not found"));
//
//		    try {
//		        JsonNode jsonNode = objectMapper.readTree(jsonData); // ✅ Convert String to JSON
//		        applicant.setData(jsonNode);
//		    } catch (IOException e) {
//		        throw new RuntimeException("Invalid JSON format", e);
//		    }
//
//		    return repository.save(applicant);
//		}
}
