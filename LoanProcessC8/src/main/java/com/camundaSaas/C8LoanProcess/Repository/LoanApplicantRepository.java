package com.camundaSaas.C8LoanProcess.Repository;

import java.sql.Timestamp;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.camundaSaas.C8LoanProcess.model.LoanApplicantDetails;

@Repository
public interface LoanApplicantRepository extends JpaRepository<LoanApplicantDetails, Long> {
	LoanApplicantDetails findTopByEmailIdOrderByCreatedDateDesc(String emailId);

	
	@Modifying
	@Transactional
	@Query(value = "INSERT INTO applicant_data (data, email_id, loan_account_number, created_date, loan_status, loan_type, loan_amount, applicant_name,balance_amount,process_instance_id) "
			+ "VALUES (CAST(:data AS JSONB), :emailId, :loanAccountNumber, :createdDate, :loanStatus, :loanType, :loanAmount, :applicantName, :balanceAmount, :processInstanceId)", nativeQuery = true)
	int saveJson(String data, String emailId, String loanAccountNumber, Timestamp createdDate, String loanStatus,
			String loanType, Long loanAmount, String applicantName, Long balanceAmount, String processInstanceId);

	  @Modifying
	    @Query(value = "UPDATE applicant_data SET loan_status = :status, data = CAST(:data AS jsonb) WHERE loan_account_number = :loanAccountNumber", nativeQuery = true)
	    void updateLoanStatus(@Param("loanAccountNumber") String loanAccountNumber, @Param("status") String status, @Param("data") String data);


	List<LoanApplicantDetails> findAllByEmailIdOrderByCreatedDateDesc(String emailId);


	LoanApplicantDetails findByLoanAccountNumber(String loanAccountNumber);


	LoanApplicantDetails findByProcessInstanceId(String processInstanceId);


	List<LoanApplicantDetails> findByBalanceAmountAndLoanStatusNot(long l, String string);

}
