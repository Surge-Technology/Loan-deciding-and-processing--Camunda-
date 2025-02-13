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

import com.surge.loanManagement.model.PropertyDetails;
import com.surge.loanManagement.service.PropertyService;

@RestController
public class PropertyController {

	@Autowired
	PropertyService propertyService;

	@PostMapping("/createPropertyDetails")
	public ResponseEntity<PropertyDetails> createPropertyDetails(@RequestBody PropertyDetails propertyDetails) {
		PropertyDetails savedProperty = propertyService.savePropertyDetails(propertyDetails);
		return ResponseEntity.ok(savedProperty);
	}

	@GetMapping("/getAllPropertyDetails")
	public ResponseEntity<List<PropertyDetails>> getAllPropertyDetails() {
		List<PropertyDetails> propertyDetailsList = propertyService.getAllPropertyDetails();
		return ResponseEntity.ok(propertyDetailsList);
	}

	@GetMapping("/getPropertyDetailsById/{propertyId}")
	public ResponseEntity<PropertyDetails> getPropertyDetailsById(@PathVariable long propertyId) {
		PropertyDetails propertyDetails = propertyService.getPropertyDetailsById(propertyId);
		return ResponseEntity.ok(propertyDetails);
	}

	@PutMapping("/updatePropertyDetails/{propertyId}")
	public ResponseEntity<PropertyDetails> updatePropertyDetails(@PathVariable long propertyId,
			@RequestBody PropertyDetails propertyDetails) {
		PropertyDetails updatedProperty = propertyService.updatePropertyDetails(propertyId, propertyDetails);
		return ResponseEntity.ok(updatedProperty);
	}

	@DeleteMapping("/deletePropertyDetails/{propertyId}")
	public ResponseEntity<Void> deletePropertyDetails(@PathVariable long propertyId) {
		propertyService.deletePropertyDetails(propertyId);
		return ResponseEntity.noContent().build();
	}
}
