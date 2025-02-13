package com.surge.loanManagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.LiabilityDetails;
import com.surge.loanManagement.repository.LiabilityRepository;

@Service
public class LiabilityService {

	@Autowired
	LiabilityRepository liabilityRepository;

	public LiabilityDetails createLiabilityDetails(LiabilityDetails liabilityDetails) {
		return liabilityRepository.save(liabilityDetails);
	}

	public List<LiabilityDetails> getAllLiabilityDetails() {
		return liabilityRepository.findAll();
	}

	public LiabilityDetails getLiabilityDetailsById(long liabilityId) {
		Optional<LiabilityDetails> liabilityDetails = liabilityRepository.findById(liabilityId);
		if (liabilityDetails.isPresent()) {
			return liabilityDetails.get();
		} else {
			throw new RuntimeException("LiabilityDetails not found with ID: " + liabilityId);
		}
	}

	public LiabilityDetails updateLiabilityDetails(long liabilityId, LiabilityDetails liabilityDetails) {
		LiabilityDetails existingLiabilityDetails = getLiabilityDetailsById(liabilityId);
		existingLiabilityDetails.setLoanBank(liabilityDetails.getLoanBank());
		existingLiabilityDetails.setLoanType(liabilityDetails.getLoanType());
		existingLiabilityDetails.setLoanAmount(liabilityDetails.getLoanAmount());
		existingLiabilityDetails.setLoanInterest(liabilityDetails.getLoanInterest());
		existingLiabilityDetails.setCurrentLoanLimit(liabilityDetails.getCurrentLoanLimit());
		existingLiabilityDetails.setCurrentLoanBalance(liabilityDetails.getCurrentLoanBalance());
		existingLiabilityDetails.setPaymentTenureRemaining(liabilityDetails.getPaymentTenureRemaining());
		existingLiabilityDetails.setModifiedBy(liabilityDetails.getModifiedBy());
		existingLiabilityDetails.setModifiedOn(liabilityDetails.getModifiedOn());
		return liabilityRepository.save(existingLiabilityDetails);
	}

	public void deleteLiabilityDetails(long liabilityId) {
		liabilityRepository.deleteById(liabilityId);
	}
}
