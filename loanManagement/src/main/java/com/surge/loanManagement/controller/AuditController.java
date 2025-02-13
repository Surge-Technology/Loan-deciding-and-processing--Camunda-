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

import com.surge.loanManagement.model.AuditDetails;
import com.surge.loanManagement.service.AuditService;
@RestController
public class AuditController {

	@Autowired
	AuditService auditService;
	
	  @PostMapping("/createAudit")
	    public ResponseEntity<AuditDetails> createAudit(@RequestBody AuditDetails auditDetails) {
	        AuditDetails createdAudit = auditService.createAudit(auditDetails);
	        return ResponseEntity.ok(createdAudit);
	    }

	    @GetMapping("/getAllAudits")
	    public ResponseEntity<List<AuditDetails>> getAllAudits() {
	        List<AuditDetails> audits = auditService.getAllAudits();
	        return ResponseEntity.ok(audits);
	    }

	    @GetMapping("/getAuditById/{auditId}")
	    public ResponseEntity<AuditDetails> getAuditById(@PathVariable long auditId) {
	        AuditDetails audit = auditService.getAuditById(auditId);
	        return ResponseEntity.ok(audit);
	    }

	    @PutMapping("/updateAudit/{auditId}")
	    public ResponseEntity<AuditDetails> updateAudit(@PathVariable long auditId, @RequestBody AuditDetails auditDetails) {
	        AuditDetails updatedAudit = auditService.updateAudit(auditId, auditDetails);
	        return ResponseEntity.ok(updatedAudit);
	    }

	    @DeleteMapping("/deleteAudit/{auditId}")
	    public ResponseEntity<Void> deleteAudit(@PathVariable long auditId) {
	    	auditService.deleteAudit(auditId);
	        return ResponseEntity.noContent().build();
	    }
}
