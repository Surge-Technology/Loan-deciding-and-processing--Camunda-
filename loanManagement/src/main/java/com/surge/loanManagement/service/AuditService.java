package com.surge.loanManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.AuditDetails;
import com.surge.loanManagement.repository.AuditRepository;

@Service
public class AuditService {

	@Autowired
	AuditRepository auditRepository;
	
	  public AuditDetails createAudit(AuditDetails auditDetails) {
	        return auditRepository.save(auditDetails);
	    }

	    public List<AuditDetails> getAllAudits() {
	        return auditRepository.findAll();
	    }

	    public AuditDetails getAuditById(long auditId) {
	        return auditRepository.findById(auditId)
	                .orElseThrow(() -> new RuntimeException("Audit not found"));
	    }

	    public AuditDetails updateAudit(long auditId, AuditDetails auditDetails) {
	        AuditDetails existingAudit = getAuditById(auditId);
	        existingAudit.setActionType(auditDetails.getActionType());
	        existingAudit.setPerformedBy(auditDetails.getPerformedBy());
	        existingAudit.setPerformedOn(auditDetails.getPerformedOn());
	        existingAudit.setActionName(auditDetails.getActionName());
	        existingAudit.setActionDescription(auditDetails.getActionDescription());
	        return auditRepository.save(existingAudit);
	    }

	    public void deleteAudit(long auditId) {
	    	auditRepository.deleteById(auditId);
	    }
}
