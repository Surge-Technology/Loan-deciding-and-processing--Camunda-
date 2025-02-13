package com.surge.loanManagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.User;
import com.surge.loanManagement.repository.UserDetailsRepository;

@Service
public class UserService {

	@Autowired
	UserDetailsRepository userDetailsRepository;

	public List<User> getAllUsers() {
		return userDetailsRepository.findAll();
	}

	public User getUserById(long userId) {
		Optional<User> user = userDetailsRepository.findById(userId);
		return user.orElseThrow(() -> new RuntimeException("User not found"));
	}

	public User updateUser(long userId, User updatedUser) {
		User existingUser = getUserById(userId);
		existingUser.setUsername(updatedUser.getUsername());
		existingUser.setPassword(updatedUser.getPassword());
		existingUser.setEmail(updatedUser.getEmail());
		existingUser.setRole(updatedUser.getRole());
		return userDetailsRepository.save(existingUser);
	}

	public void deleteUser(long userId) {
		userDetailsRepository.deleteById(userId);
	}
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); 
        return userDetailsRepository.save(user);
    }
    public User login(String emailOrUsername, String password) {
        User user = userDetailsRepository.findByEmailOrUsername(emailOrUsername, emailOrUsername);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }
//    public User login(String email, String password) {
//        User user = userDetailsRepository.findByEmail(email);
//        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
//            return user;
//        }
//        return null;
//    }
}
