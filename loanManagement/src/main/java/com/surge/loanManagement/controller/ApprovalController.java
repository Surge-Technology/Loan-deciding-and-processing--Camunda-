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

import com.surge.loanManagement.model.ApprovalDetails;
import com.surge.loanManagement.service.ApprovalService;

@RestController
public class ApprovalController {

	@Autowired
	ApprovalService approvalService;
	
	 @PostMapping("/createApproval")
	    public ResponseEntity<ApprovalDetails> createApproval(@RequestBody ApprovalDetails approvalDetails) {
	        ApprovalDetails createdApproval = approvalService.createApproval(approvalDetails);
	        return ResponseEntity.ok(createdApproval);
	    }

	    @GetMapping("/getAllApprovals")
	    public ResponseEntity<List<ApprovalDetails>> getAllApprovals() {
	        List<ApprovalDetails> approvals = approvalService.getAllApprovals();
	        return ResponseEntity.ok(approvals);
	    }

	    @GetMapping("/getApprovalById/{approvalId}")
	    public ResponseEntity<ApprovalDetails> getApprovalById(@PathVariable long approvalId) {
	        ApprovalDetails approval = approvalService.getApprovalById(approvalId);
	        return ResponseEntity.ok(approval);
	    }

	    @PutMapping("/updateApproval/{approvalId}")
	    public ResponseEntity<ApprovalDetails> updateApproval(@PathVariable long approvalId, @RequestBody ApprovalDetails approvalDetails) {
	        ApprovalDetails updatedApproval = approvalService.updateApproval(approvalId, approvalDetails);
	        return ResponseEntity.ok(updatedApproval);
	    }

	    @DeleteMapping("/deleteApproval/{approvalId}")
	    public ResponseEntity<Void> deleteApproval(@PathVariable long approvalId) {
	    	approvalService.deleteApproval(approvalId);
	        return ResponseEntity.noContent().build();
	    }
	    
	    
}
