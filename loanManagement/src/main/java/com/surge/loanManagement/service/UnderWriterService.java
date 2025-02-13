package com.surge.loanManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.UnderwriterDetails;
import com.surge.loanManagement.repository.UnderwriterRepository;

@Service
public class UnderWriterService {

	@Autowired
	UnderwriterRepository underwriterRepository;

	public UnderwriterDetails createUnderwriter(UnderwriterDetails underwriterDetails) {
		return underwriterRepository.save(underwriterDetails);
	}

	public List<UnderwriterDetails> getAllUnderwriters() {
		return underwriterRepository.findAll();
	}

	public UnderwriterDetails getUnderwriterById(long underwriterId) {
		return underwriterRepository.findById(underwriterId)
				.orElseThrow(() -> new RuntimeException("Underwriter not found"));
	}

	public UnderwriterDetails updateUnderwriter(long underwriterId, UnderwriterDetails underwriterDetails) {
		UnderwriterDetails existingUnderwriter = getUnderwriterById(underwriterId);
		existingUnderwriter.setUnderwriterFirstName(underwriterDetails.getUnderwriterFirstName());
		existingUnderwriter.setUnderwriterLastName(underwriterDetails.getUnderwriterLastName());
		existingUnderwriter.setUnderwriterEmail(underwriterDetails.getUnderwriterEmail());
		existingUnderwriter.setUnderwriterPhoneNumber(underwriterDetails.getUnderwriterPhoneNumber());
		return underwriterRepository.save(existingUnderwriter);
	}

	public void deleteUnderwriter(long underwriterId) {
		underwriterRepository.deleteById(underwriterId);
	}
}
