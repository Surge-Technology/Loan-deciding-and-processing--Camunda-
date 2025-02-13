package com.surge.loanManagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.PropertyDetails;
import com.surge.loanManagement.repository.PropertyRepository;

@Service
public class PropertyService{

	@Autowired
	PropertyRepository propertyRepository;
	
	 public PropertyDetails savePropertyDetails(PropertyDetails propertyDetails) {
	        return propertyRepository.save(propertyDetails);
	    }

	    public List<PropertyDetails> getAllPropertyDetails() {
	        return propertyRepository.findAll();
	    }

	    public PropertyDetails getPropertyDetailsById(long propertyId) {
	        Optional<PropertyDetails> propertyDetails = propertyRepository.findById(propertyId);
	        if (propertyDetails.isPresent()) {
	            return propertyDetails.get();
	        } else {
	            throw new RuntimeException("PropertyDetails not found with ID: " + propertyId);
	        }
	    }

	    public PropertyDetails updatePropertyDetails(long propertyId, PropertyDetails updatedProperty) {
	        PropertyDetails existingPropertyDetails = getPropertyDetailsById(propertyId);
	        existingPropertyDetails.setPropertyAddress(updatedProperty.getPropertyAddress());
	        existingPropertyDetails.setPropertyType(updatedProperty.getPropertyType());
	        existingPropertyDetails.setBuiltYear(updatedProperty.getBuiltYear());
	        existingPropertyDetails.setSquareFeet(updatedProperty.getSquareFeet());
	        existingPropertyDetails.setLotSize(updatedProperty.getLotSize());
	        existingPropertyDetails.setSpecialFeatures(updatedProperty.getSpecialFeatures());
	        existingPropertyDetails.setNumberOfRooms(updatedProperty.getNumberOfRooms());
	        existingPropertyDetails.setPropertyOwner(updatedProperty.getPropertyOwner());
	        existingPropertyDetails.setPropertyDocument(updatedProperty.getPropertyDocument());
	        existingPropertyDetails.setPropertyWorth(updatedProperty.getPropertyWorth());
	        existingPropertyDetails.setExplainSpecialFeature(updatedProperty.getExplainSpecialFeature());
	        existingPropertyDetails.setExplainPropertyCondition(updatedProperty.getExplainPropertyCondition());
	        existingPropertyDetails.setOccupancyType(updatedProperty.getOccupancyType());
	        existingPropertyDetails.setStartDate(updatedProperty.getStartDate());
	        existingPropertyDetails.setEndDate(updatedProperty.getEndDate());
	        existingPropertyDetails.setUpdatedBy(updatedProperty.getUpdatedBy());
	        existingPropertyDetails.setUpdatedOn(updatedProperty.getUpdatedOn());

	        return propertyRepository.save(existingPropertyDetails);
	    }

	    public void deletePropertyDetails(long propertyId) {
	    	propertyRepository.deleteById(propertyId);
	    }
}
