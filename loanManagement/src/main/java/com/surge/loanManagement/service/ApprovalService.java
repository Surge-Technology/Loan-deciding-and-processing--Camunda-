package com.surge.loanManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.ApprovalDetails;
import com.surge.loanManagement.repository.ApprovalRepository;

@Service
public class ApprovalService{

	@Autowired
	ApprovalRepository approvalRepository;
	
	  public ApprovalDetails createApproval(ApprovalDetails approvalDetails) {
	        return approvalRepository.save(approvalDetails);
	    }

	    public List<ApprovalDetails> getAllApprovals() {
	        return approvalRepository.findAll();
	    }

	    public ApprovalDetails getApprovalById(long approvalId) {
	        return approvalRepository.findById(approvalId)
	                .orElseThrow(() -> new RuntimeException("Approval not found with ID: " + approvalId));
	    }

	    public ApprovalDetails updateApproval(long approvalId, ApprovalDetails approvalDetails) {
	        ApprovalDetails existingApproval = getApprovalById(approvalId);
	        existingApproval.setUnderwriterId(approvalDetails.getUnderwriterId());
	        existingApproval.setUnderwriterDecision(approvalDetails.getUnderwriterDecision());
	        existingApproval.setCreditBureau(approvalDetails.getCreditBureau());
	        existingApproval.setCreditScore(approvalDetails.getCreditScore());
	        existingApproval.setRiskAssessment(approvalDetails.getRiskAssessment());
	        existingApproval.setApprovalStatus(approvalDetails.getApprovalStatus());
	        existingApproval.setLoanStatus(approvalDetails.getLoanStatus());
	        existingApproval.setUnderwriterComments(approvalDetails.getUnderwriterComments());
	        existingApproval.setCreatedBy(approvalDetails.getCreatedBy());
	        existingApproval.setCreatedOn(approvalDetails.getCreatedOn());
	        existingApproval.setUpdatedBy(approvalDetails.getUpdatedBy());
	        existingApproval.setUpdatedOn(approvalDetails.getUpdatedOn());
	        return approvalRepository.save(existingApproval);
	    }

	    public void deleteApproval(long approvalId) {
	    	approvalRepository.deleteById(approvalId);
	    }
}
