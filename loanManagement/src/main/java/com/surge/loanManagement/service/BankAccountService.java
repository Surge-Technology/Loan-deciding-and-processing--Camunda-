package com.surge.loanManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.BankAccountDetails;
import com.surge.loanManagement.repository.BankAccountRepository;

@Service
public class BankAccountService {

	@Autowired
	BankAccountRepository bankAccountRepository;
	
	 public BankAccountDetails createBankAccount(BankAccountDetails bankAccountDetails) {
	        return bankAccountRepository.save(bankAccountDetails);
	    }

	    public List<BankAccountDetails> getAllBankAccounts() {
	        return bankAccountRepository.findAll();
	    }

	    public BankAccountDetails getBankAccountById(long accountId) {
	        return bankAccountRepository.findById(accountId)
	                .orElseThrow(() -> new RuntimeException("Bank account not found"));
	    }

	    public BankAccountDetails updateBankAccount(long accountId, BankAccountDetails bankAccountDetails) {
	        BankAccountDetails existingAccount = getBankAccountById(accountId);
	        return bankAccountRepository.save(existingAccount);
	    }

	    public void deleteBankAccount(long accountId) {
	    	bankAccountRepository.deleteById(accountId);
	    }
}
