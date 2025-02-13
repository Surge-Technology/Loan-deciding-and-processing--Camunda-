package com.surge.loanManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.surge.loanManagement.model.BankAccountDetails;
import com.surge.loanManagement.service.BankAccountService;

@Service
public class BankAccountController {

	@Autowired
	BankAccountService bankAccountService;
	
	  @PostMapping("/createBankAccount")
	    public ResponseEntity<BankAccountDetails> createBankAccount(@RequestBody BankAccountDetails bankAccountDetails) {
	        BankAccountDetails createdAccount = bankAccountService.createBankAccount(bankAccountDetails);
	        return ResponseEntity.ok(createdAccount);
	    }

	    @GetMapping("/getAllBankAccounts")
	    public ResponseEntity<List<BankAccountDetails>> getAllBankAccounts() {
	        List<BankAccountDetails> accounts = bankAccountService.getAllBankAccounts();
	        return ResponseEntity.ok(accounts);
	    }

	    @GetMapping("/getBankAccountById/{accountId}")
	    public ResponseEntity<BankAccountDetails> getBankAccountById(@PathVariable long accountId) {
	        BankAccountDetails account = bankAccountService.getBankAccountById(accountId);
	        return ResponseEntity.ok(account);
	    }

	    @PutMapping("/updateBankAccount/{accountId}")
	    public ResponseEntity<BankAccountDetails> updateBankAccount(@PathVariable long accountId, @RequestBody BankAccountDetails bankAccountDetails) {
	        BankAccountDetails updatedAccount = bankAccountService.updateBankAccount(accountId, bankAccountDetails);
	        return ResponseEntity.ok(updatedAccount);
	    }

	    @DeleteMapping("/deleteBankAccount/{accountId}")
	    public ResponseEntity<Void> deleteBankAccount(@PathVariable long accountId) {
	    	bankAccountService.deleteBankAccount(accountId);
	        return ResponseEntity.noContent().build();
	    }
}
