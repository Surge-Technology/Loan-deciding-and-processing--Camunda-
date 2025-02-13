package com.surge.loanManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.surge.loanManagement.model.BankAccountDetails;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccountDetails,Long>{

}
