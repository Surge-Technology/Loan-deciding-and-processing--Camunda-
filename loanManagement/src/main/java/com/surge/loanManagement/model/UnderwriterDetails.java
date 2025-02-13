package com.surge.loanManagement.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "UNDERWRITER_DETAILS")
public class UnderwriterDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UNDERWRITER_ID")
    private long underwriterId;

    @Column(name = "UNDERWRITER_FIRST_NAME")
    private String underwriterFirstName;

    @Column(name = "UNDERWRITER_LAST_NAME")
    private String underwriterLastName;

    @Column(name = "UNDERWRITER_EMAIL")
    private String underwriterEmail;

    @Column(name = "UNDERWRITER_PHONE_NUMBER")
    private String underwriterPhoneNumber;
    
	public long getUnderwriterId() {
		return underwriterId;
	}
	public String getUnderwriterFirstName() {
		return underwriterFirstName;
	}
	public String getUnderwriterLastName() {
		return underwriterLastName;
	}
	public String getUnderwriterEmail() {
		return underwriterEmail;
	}
	public String getUnderwriterPhoneNumber() {
		return underwriterPhoneNumber;
	}
	public void setUnderwriterId(long underwriterId) {
		this.underwriterId = underwriterId;
	}
	public void setUnderwriterFirstName(String underwriterFirstName) {
		this.underwriterFirstName = underwriterFirstName;
	}
	public void setUnderwriterLastName(String underwriterLastName) {
		this.underwriterLastName = underwriterLastName;
	}
	public void setUnderwriterEmail(String underwriterEmail) {
		this.underwriterEmail = underwriterEmail;
	}
	public void setUnderwriterPhoneNumber(String underwriterPhoneNumber) {
		this.underwriterPhoneNumber = underwriterPhoneNumber;
	}


}
