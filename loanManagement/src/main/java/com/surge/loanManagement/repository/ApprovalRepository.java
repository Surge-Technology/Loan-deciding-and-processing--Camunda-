package com.surge.loanManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.surge.loanManagement.model.ApprovalDetails;

@Repository
public interface ApprovalRepository extends JpaRepository<ApprovalDetails,Long>{

}
