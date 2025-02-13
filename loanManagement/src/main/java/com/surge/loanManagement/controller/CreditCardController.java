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

import com.surge.loanManagement.model.CreditCardDetails;
import com.surge.loanManagement.service.CreditCardService;

@Service
public class CreditCardController {

	@Autowired
	CreditCardService creditCardService;
	
	@PostMapping("/createCreditCard")
    public ResponseEntity<CreditCardDetails> createCreditCard(@RequestBody CreditCardDetails creditCardDetails) {
        CreditCardDetails createdCard = creditCardService.createCreditCard(creditCardDetails);
        return ResponseEntity.ok(createdCard);
    }

    @GetMapping("/getAllCreditCards")
    public ResponseEntity<List<CreditCardDetails>> getAllCreditCards() {
        List<CreditCardDetails> cards = creditCardService.getAllCreditCards();
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/getCreditCardById/{creditId}")
    public ResponseEntity<CreditCardDetails> getCreditCardById(@PathVariable int creditId) {
        CreditCardDetails card = creditCardService.getCreditCardById(creditId);
        return ResponseEntity.ok(card);
    }

    @PutMapping("/updateCreditCard/{creditId}")
    public ResponseEntity<CreditCardDetails> updateCreditCard(@PathVariable int creditId, @RequestBody CreditCardDetails creditCardDetails) {
        CreditCardDetails updatedCard = creditCardService.updateCreditCard(creditId, creditCardDetails);
        return ResponseEntity.ok(updatedCard);
    }

    @DeleteMapping("/deleteCreditCard/{creditId}")
    public ResponseEntity<Void> deleteCreditCard(@PathVariable int creditId) {
    	creditCardService.deleteCreditCard(creditId);
        return ResponseEntity.noContent().build();
    }
}
