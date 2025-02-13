package com.surge.loanManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.surge.loanManagement.model.PropertyDetails;

@Repository
public interface PropertyRepository extends JpaRepository<PropertyDetails,Long>{

}
