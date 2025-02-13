package com.surge.loanManagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.FinanceDetails;
import com.surge.loanManagement.repository.FinanceRepository;

@Service
public class FinanceService {

	@Autowired
	FinanceRepository financeRepository;

	public FinanceDetails createFinanceDetails(FinanceDetails financeDetails) {
		return financeRepository.save(financeDetails);
	}

	public List<FinanceDetails> getAllFinanceDetails() {
		return financeRepository.findAll();
	}

	public FinanceDetails getFinanceDetailsById(long financeId) {
		Optional<FinanceDetails> financeDetails = financeRepository.findById(financeId);
		if (financeDetails.isPresent()) {
			return financeDetails.get();
		} else {
			throw new RuntimeException("FinanceDetails not found with ID: " + financeId);
		}
	}

	public FinanceDetails updateFinanceDetails(long financeId, FinanceDetails financeDetails) {
		FinanceDetails existingFinanceDetails = getFinanceDetailsById(financeId);
		existingFinanceDetails.setAnnualIncome(financeDetails.getAnnualIncome());
		existingFinanceDetails.setGrossRentals(financeDetails.getGrossRentals());
		existingFinanceDetails.setModifiedBy(financeDetails.getModifiedBy());
		existingFinanceDetails.setModifiedOn(financeDetails.getModifiedOn());
		return financeRepository.save(existingFinanceDetails);
	}

	public void deleteFinanceDetails(long financeId) {
		financeRepository.deleteById(financeId);
	}
}
