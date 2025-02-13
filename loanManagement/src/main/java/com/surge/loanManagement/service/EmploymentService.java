package com.surge.loanManagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.EmploymentDetails;
import com.surge.loanManagement.repository.EmploymentRepository;

@Service
public class EmploymentService {

	@Autowired
	EmploymentRepository employmentRepository;

	public EmploymentDetails createEmploymentDetails(EmploymentDetails employmentDetails) {
		return employmentRepository.save(employmentDetails);
	}

	public List<EmploymentDetails> getAllEmploymentDetails() {
		return employmentRepository.findAll();
	}

	public EmploymentDetails getEmploymentDetailsById(long employmentId) {
		Optional<EmploymentDetails> employmentDetails = employmentRepository.findById(employmentId);
		if (employmentDetails.isPresent()) {
			return employmentDetails.get();
		} else {
			throw new RuntimeException("EmploymentDetails not found with ID: " + employmentId);
		}
	}

	public EmploymentDetails updateEmploymentDetails(long employmentId, EmploymentDetails employmentDetails) {
		EmploymentDetails existingEmploymentDetails = getEmploymentDetailsById(employmentId);
		existingEmploymentDetails.setCompanyName(employmentDetails.getCompanyName());
		existingEmploymentDetails.setCompanyContactPerson(employmentDetails.getCompanyContactPerson());
		existingEmploymentDetails.setCompanyContactNumber(employmentDetails.getCompanyContactNumber());
		existingEmploymentDetails.setCompanyContactMail(employmentDetails.getCompanyContactMail());
		existingEmploymentDetails.setKindOfEmployment(employmentDetails.getKindOfEmployment());
		existingEmploymentDetails.setGrossSalary(employmentDetails.getGrossSalary());
		existingEmploymentDetails.setAnnualPackage(employmentDetails.getAnnualPackage());
		existingEmploymentDetails.setDesignation(employmentDetails.getDesignation());
		existingEmploymentDetails.setEmployeeDoj(employmentDetails.getEmployeeDoj());
		existingEmploymentDetails.setYearsOfExperience(employmentDetails.getYearsOfExperience());
		existingEmploymentDetails.setUpdatedBy(employmentDetails.getUpdatedBy());
		existingEmploymentDetails.setUpdatedOn(employmentDetails.getUpdatedOn());
		return employmentRepository.save(existingEmploymentDetails);
	}

	public void deleteEmploymentDetails(long employmentId) {
		employmentRepository.deleteById(employmentId);
	}
}
