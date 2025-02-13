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

import com.surge.loanManagement.model.UnderwriterDetails;
import com.surge.loanManagement.service.UnderWriterService;

@RestController
public class UnderWriterController {

	@Autowired
	UnderWriterService underwriterService;
	
	@PostMapping("/createUnderwriter")
    public ResponseEntity<UnderwriterDetails> createUnderwriter(@RequestBody UnderwriterDetails underwriterDetails) {
        UnderwriterDetails createdUnderwriter = underwriterService.createUnderwriter(underwriterDetails);
        return ResponseEntity.ok(createdUnderwriter);
    }

    @GetMapping("/getAllUnderwriters")
    public ResponseEntity<List<UnderwriterDetails>> getAllUnderwriters() {
        List<UnderwriterDetails> underwriters = underwriterService.getAllUnderwriters();
        return ResponseEntity.ok(underwriters);
    }

    @GetMapping("/getUnderwriterById/{underwriterId}")
    public ResponseEntity<UnderwriterDetails> getUnderwriterById(@PathVariable long underwriterId) {
        UnderwriterDetails underwriter = underwriterService.getUnderwriterById(underwriterId);
        return ResponseEntity.ok(underwriter);
    }

    @PutMapping("/updateUnderwriter/{underwriterId}")
    public ResponseEntity<UnderwriterDetails> updateUnderwriter(@PathVariable long underwriterId, @RequestBody UnderwriterDetails underwriterDetails) {
        UnderwriterDetails updatedUnderwriter = underwriterService.updateUnderwriter(underwriterId, underwriterDetails);
        return ResponseEntity.ok(updatedUnderwriter);
    }

    @DeleteMapping("/deleteUnderwriter/{underwriterId}")
    public ResponseEntity<Void> deleteUnderwriter(@PathVariable long underwriterId) {
        underwriterService.deleteUnderwriter(underwriterId);
        return ResponseEntity.noContent().build();
    }
}
