package com.surge.loanManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.surge.loanManagement.model.FinanceDetails;
import com.surge.loanManagement.service.FinanceService;

@RestController
public class FinanceController {

	@Autowired
	FinanceService financeService;
	
	@PostMapping("/createFinanceDetails")
    public ResponseEntity<FinanceDetails> createFinanceDetails(@RequestBody FinanceDetails financeDetails) {
        FinanceDetails createdFinanceDetails = financeService.createFinanceDetails(financeDetails);
        return ResponseEntity.ok(createdFinanceDetails);
    }

    @GetMapping("/getAllFinanceDetails")
    public ResponseEntity<List<FinanceDetails>> getAllFinanceDetails() {
        List<FinanceDetails> financeDetailsList = financeService.getAllFinanceDetails();
        return ResponseEntity.ok(financeDetailsList);
    }

    @GetMapping("/getFinanceDetailsById/{financeId}")
    public ResponseEntity<FinanceDetails> getFinanceDetailsById(@PathVariable long financeId) {
        FinanceDetails financeDetails = financeService.getFinanceDetailsById(financeId);
        return ResponseEntity.ok(financeDetails);
    }

    @PutMapping("/updateFinanceDetails/{financeId}")
    public ResponseEntity<FinanceDetails> updateFinanceDetails(
            @PathVariable long financeId,
            @RequestBody FinanceDetails financeDetails) {
        FinanceDetails updatedFinanceDetails = financeService.updateFinanceDetails(financeId, financeDetails);
        return ResponseEntity.ok(updatedFinanceDetails);
    }

    @DeleteMapping("/deleteFinanceDetails/{financeId}")
    public ResponseEntity<Void> deleteFinanceDetails(@PathVariable long financeId) {
    	financeService.deleteFinanceDetails(financeId);
        return ResponseEntity.noContent().build();
    }
}
