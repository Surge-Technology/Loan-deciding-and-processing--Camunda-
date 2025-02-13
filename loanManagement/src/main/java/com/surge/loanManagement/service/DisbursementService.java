//package com.surge.loanManagement.service;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.surge.loanManagement.model.DisbursementDetails;
//import com.surge.loanManagement.repository.DisbursementRepository;
//
//@Service
//public class DisbursementService {
//
//	@Autowired
//	DisbursementRepository disbursementRepository;
//
//
//	public DisbursementDetails createDisbursement(DisbursementDetails disbursementDetails) {
//		return disbursementRepository.save(disbursementDetails);
//	}
//
//	public List<DisbursementDetails> getAllDisbursements() {
//		return disbursementRepository.findAll();
//	}
//
//	public DisbursementDetails getDisbursementById(long disbursementId) {
//		return disbursementRepository.findById(disbursementId)
//				.orElseThrow(() -> new RuntimeException("Disbursement not found with ID: " + disbursementId));
//	}
//
//	public DisbursementDetails updateDisbursement(long disbursementId, DisbursementDetails disbursementDetails) {
//		DisbursementDetails existingDisbursement = getDisbursementById(disbursementId);
//
//		existingDisbursement.setDisbursementAmount(disbursementDetails.getDisbursementAmount());
//		existingDisbursement.setDisbursementDate(disbursementDetails.getDisbursementDate());
//		existingDisbursement.setDisbursementMethod(disbursementDetails.getDisbursementMethod());
//		existingDisbursement.setDisbursementStatus(disbursementDetails.getDisbursementStatus());
//		existingDisbursement.setInterestRate(disbursementDetails.getInterestRate());
//		existingDisbursement.setUpdatedBy(disbursementDetails.getUpdatedBy());
//		existingDisbursement.setUpdatedOn(disbursementDetails.getUpdatedOn());
//		return disbursementRepository.save(existingDisbursement);
//	}
//
//	public void deleteDisbursement(long disbursementId) {
//		disbursementRepository.deleteById(disbursementId);
//	}
//
//}
