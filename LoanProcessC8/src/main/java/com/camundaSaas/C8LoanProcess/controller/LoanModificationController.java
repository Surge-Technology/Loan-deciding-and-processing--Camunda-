package com.camundaSaas.C8LoanProcess.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.camundaSaas.C8LoanProcess.Repository.LoanModificationRepository;
import com.camundaSaas.C8LoanProcess.model.LoanModification;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class LoanModificationController {

	@Autowired
	private LoanModificationRepository repository;

	@Autowired
	private ObjectMapper objectMapper;
	
	
	

	@PostMapping("/saveLoanData")
	public String saveLoanData(@RequestBody JsonNode requestJson) {
		try {
			// Extract loanAccountNumber from NewData
			String loanAccountNumber = requestJson.path("NewData").path("loanAccountNumber").asText();

			// Convert full request JSON to string
			String fullJson = objectMapper.writeValueAsString(requestJson);

//			LoanModification loanModification = LoanModification.builder().loanAccountNumber(loanAccountNumber)
//					.payloadJson(fullJson).build();
			LoanModification loanModification = new LoanModification();
			loanModification.setLoanAccountNumber(loanAccountNumber);
			loanModification.setPayloadJson(fullJson);

			repository.save(loanModification);

			return "Loan data saved successfully.";
		} catch (Exception e) {
			return "Failed to save loan data: " + e.getMessage();
		}
	}
	
	
	 @GetMapping("/get/{loanAccountNumber}")
	    public ResponseEntity<?> getLoanModificationByLoanAccountNumber(@PathVariable String loanAccountNumber) {
	        Optional<LoanModification> result = repository.findByLoanAccountNumber(loanAccountNumber);

	        if (result.isPresent()) {
	            return ResponseEntity.ok(result.get());
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                    .body("No loan modification found for account number: " + loanAccountNumber);
	        }
	    }
}