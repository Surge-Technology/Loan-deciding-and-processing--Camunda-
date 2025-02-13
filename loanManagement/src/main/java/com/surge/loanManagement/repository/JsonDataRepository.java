package com.surge.loanManagement.repository;
 
import java.util.Optional;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
 
import com.surge.loanManagement.model.JsonData;
 
import jakarta.transaction.Transactional;
 
@Repository
public interface JsonDataRepository extends JpaRepository<JsonData, Long> {
 
	@Modifying
	@Transactional
	@Query(value = "INSERT INTO json_data_store (data, email_id) VALUES (CAST(:data AS JSONB), :emailId)", nativeQuery = true)
	void saveJson(String data, String emailId);
 
	Optional<JsonData> findById(Long id);
 
	@Modifying
	@Transactional
	@Query(value = "UPDATE json_data_store SET data = CAST(:data AS JSONB), email_id = :emailId WHERE id = :id", nativeQuery = true)
	void updateJsonData(Long id, String data, String emailId);
 
	Optional<JsonData> findByEmailId(String emailId);
 
}