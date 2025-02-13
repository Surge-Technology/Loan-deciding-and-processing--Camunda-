package com.surge.loanManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.surge.loanManagement.model.UnderwriterDetails;

@Repository
public interface UnderwriterRepository extends JpaRepository<UnderwriterDetails,Long>{

}
