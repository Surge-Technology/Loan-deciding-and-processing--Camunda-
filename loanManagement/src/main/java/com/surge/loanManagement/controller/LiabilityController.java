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

import com.surge.loanManagement.model.LiabilityDetails;
import com.surge.loanManagement.service.LiabilityService;

@RestController
public class LiabilityController {

	@Autowired
	LiabilityService liabilityService;

	@PostMapping("/createLiabilityDetails")
	public ResponseEntity<LiabilityDetails> createLiabilityDetails(@RequestBody LiabilityDetails liabilityDetails) {
		LiabilityDetails createdLiabilityDetails = liabilityService.createLiabilityDetails(liabilityDetails);
		return ResponseEntity.ok(createdLiabilityDetails);
	}

	@GetMapping("/getAllLiabilityDetails")
	public ResponseEntity<List<LiabilityDetails>> getAllLiabilityDetails() {
		List<LiabilityDetails> liabilityDetailsList = liabilityService.getAllLiabilityDetails();
		return ResponseEntity.ok(liabilityDetailsList);
	}

	@GetMapping("/getLiabilityDetailsById/{liabilityId}")
	public ResponseEntity<LiabilityDetails> getLiabilityDetailsById(@PathVariable long liabilityId) {
		LiabilityDetails liabilityDetails = liabilityService.getLiabilityDetailsById(liabilityId);
		return ResponseEntity.ok(liabilityDetails);
	}

	@PutMapping("/updateLiabilityDetails/{liabilityId}")
	public ResponseEntity<LiabilityDetails> updateLiabilityDetails(@PathVariable long liabilityId,
			@RequestBody LiabilityDetails liabilityDetails) {
		LiabilityDetails updatedLiabilityDetails = liabilityService.updateLiabilityDetails(liabilityId,
				liabilityDetails);
		return ResponseEntity.ok(updatedLiabilityDetails);
	}

	@DeleteMapping("/deleteLiabilityDetails/{liabilityId}")
	public ResponseEntity<Void> deleteLiabilityDetails(@PathVariable long liabilityId) {
		liabilityService.deleteLiabilityDetails(liabilityId);
		return ResponseEntity.noContent().build();
	}
}
