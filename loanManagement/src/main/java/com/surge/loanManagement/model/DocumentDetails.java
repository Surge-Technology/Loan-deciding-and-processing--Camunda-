package com.surge.loanManagement.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "DOCUMENT_DETAILS")
public class DocumentDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DOCUMENT_ID")
    private long documentId;

//    @ManyToOne
//    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
//    private CustomerDetails customerDetails;

//    @ManyToOne
//    @JoinColumn(name = "LOAN_ID", nullable = true)
//    private LoanDetails loanDetails;

    @Column(name = "DOCUMENT_NAME")
    private String documentName;

    @Column(name = "DOCUMENT_TYPE")
    private String documentType;

    @Column(name = "UPLOADED_BY")
    private String uploadedBy;

    @Column(name = "UPLOADED_ON")
    private Date uploadedOn;

    @Column(name = "UPDATED_BY")
    private String updatedBy;

    @Column(name = "UPDATED_ON")
    private Date updatedOn;

    @Column(name = "DOCUMENT_PATH")
    private String documentPath;

    

	public DocumentDetails(String documentName, String documentType,
			String documentPath) {
		super();
		this.documentName = documentName;
		this.documentType = documentType;

		this.documentPath = documentPath;
	}

	public long getDocumentId() {
		return documentId;
	}

	public String getDocumentName() {
		return documentName;
	}

	public String getDocumentType() {
		return documentType;
	}

	public String getUploadedBy() {
		return uploadedBy;
	}

	public Date getUploadedOn() {
		return uploadedOn;
	}

	public String getUpdatedBy() {
		return updatedBy;
	}

	public Date getUpdatedOn() {
		return updatedOn;
	}

	public String getDocumentPath() {
		return documentPath;
	}

	public void setDocumentId(long documentId) {
		this.documentId = documentId;
	}


	public void setDocumentName(String documentName) {
		this.documentName = documentName;
	}

	public void setDocumentType(String documentType) {
		this.documentType = documentType;
	}

	public void setUploadedBy(String uploadedBy) {
		this.uploadedBy = uploadedBy;
	}

	public void setUploadedOn(Date uploadedOn) {
		this.uploadedOn = uploadedOn;
	}

	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}

	public void setUpdatedOn(Date updatedOn) {
		this.updatedOn = updatedOn;
	}

	public void setDocumentPath(String documentPath) {
		this.documentPath = documentPath;
	}

  
}
