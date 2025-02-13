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

import com.surge.loanManagement.model.EmploymentDetails;
import com.surge.loanManagement.service.EmploymentService;

@RestController
public class EmploymentController {

	@Autowired
	EmploymentService employmentService;
	
	@PostMapping("/createEmploymentDetails")
    public ResponseEntity<EmploymentDetails> createEmploymentDetails(@RequestBody EmploymentDetails employmentDetails) {
        EmploymentDetails createdEmploymentDetails = employmentService.createEmploymentDetails(employmentDetails);
        return ResponseEntity.ok(createdEmploymentDetails);
    }

    @GetMapping("/getAllEmploymentDetails")
    public ResponseEntity<List<EmploymentDetails>> getAllEmploymentDetails() {
        List<EmploymentDetails> employmentDetailsList = employmentService.getAllEmploymentDetails();
        return ResponseEntity.ok(employmentDetailsList);
    }
    
    @GetMapping("/getEmploymentDetailsById/{employmentId}")
    public ResponseEntity<EmploymentDetails> getEmploymentDetailsById(@PathVariable long employmentId) {
        EmploymentDetails employmentDetails = employmentService.getEmploymentDetailsById(employmentId);
        return ResponseEntity.ok(employmentDetails);
    }

    @PutMapping("/updateEmploymentDetails/{employmentId}")
    public ResponseEntity<EmploymentDetails> updateEmploymentDetails(
            @PathVariable long employmentId,
            @RequestBody EmploymentDetails employmentDetails) {
        EmploymentDetails updatedEmploymentDetails = employmentService.updateEmploymentDetails(employmentId, employmentDetails);
        return ResponseEntity.ok(updatedEmploymentDetails);
    }

    @DeleteMapping("/deleteEmploymentDetails/{employmentId}")
    public ResponseEntity<Void> deleteEmploymentDetails(@PathVariable long employmentId) {
    	employmentService.deleteEmploymentDetails(employmentId);
        return ResponseEntity.noContent().build();
    }
}
