package com.surge.loanManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.surge.loanManagement.model.User;

@Repository
public interface UserDetailsRepository extends JpaRepository<User, Long> {

//	User findByEmail(String email);
	User findByEmailOrUsername(String email, String username);

}
