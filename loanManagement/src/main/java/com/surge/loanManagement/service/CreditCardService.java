package com.surge.loanManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surge.loanManagement.model.CreditCardDetails;
import com.surge.loanManagement.repository.CreditRepository;

@Service
public class CreditCardService {

	@Autowired
	CreditRepository creditRepository;
	
	public CreditCardDetails createCreditCard(CreditCardDetails creditCardDetails) {
        return creditRepository.save(creditCardDetails);
    }

    public List<CreditCardDetails> getAllCreditCards() {
        return creditRepository.findAll();
    }

    public CreditCardDetails getCreditCardById(long creditId) {
        return creditRepository.findById(creditId)
                .orElseThrow(() -> new RuntimeException("Credit card not found"));
    }

    public CreditCardDetails updateCreditCard(int creditId, CreditCardDetails creditCardDetails) {
        CreditCardDetails existingCard = getCreditCardById(creditId);
        existingCard.setCreditCardBank(creditCardDetails.getCreditCardBank());
        existingCard.setCardPrimaryHolder(creditCardDetails.getCardPrimaryHolder());
        existingCard.setCreditCardLimit(creditCardDetails.getCreditCardLimit());
        existingCard.setBalanceOnCard(creditCardDetails.getBalanceOnCard());
        return creditRepository.save(existingCard);
    }

    public void deleteCreditCard(long creditId) {
    	creditRepository.deleteById(creditId);
    }
}
