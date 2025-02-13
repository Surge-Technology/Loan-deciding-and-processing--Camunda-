package com.surge.loanManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.surge.loanManagement.model.CreditCardDetails;

@Repository
public interface CreditRepository extends JpaRepository<CreditCardDetails,Long>{

}
