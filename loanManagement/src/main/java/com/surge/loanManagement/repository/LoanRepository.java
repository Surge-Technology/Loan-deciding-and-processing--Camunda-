package com.surge.loanManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.surge.loanManagement.model.LoanDetails;

@Repository
public interface LoanRepository extends JpaRepository<LoanDetails,Long>{

}
