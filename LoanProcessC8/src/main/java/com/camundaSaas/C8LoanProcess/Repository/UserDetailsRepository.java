package com.camundaSaas.C8LoanProcess.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.camundaSaas.C8LoanProcess.model.User;

@Repository
public interface UserDetailsRepository extends JpaRepository<User, Long> {

//	User findByEmail(String email);
	User findByEmailOrUsername(String email, String username);

}
