package com.surge.loanManagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.surge.loanManagement.model.DisbursementJsonData;

import jakarta.transaction.Transactional;

@Repository
public interface JsonDataDisbursementRepository extends JpaRepository<DisbursementJsonData, Long> {

	@Modifying
	@Transactional
	@Query(value = "INSERT INTO disbursement_json_data (data, email_id) VALUES (CAST(:data AS JSONB), :emailId)", nativeQuery = true)
	void saveJson(String data, String emailId);

	Optional<DisbursementJsonData> findByEmailId(String emailId);
}
