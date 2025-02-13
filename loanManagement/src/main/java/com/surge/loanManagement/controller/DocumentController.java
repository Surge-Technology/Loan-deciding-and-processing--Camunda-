package com.surge.loanManagement.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.surge.loanManagement.model.DocumentDetails;
import com.surge.loanManagement.repository.DocumentRepository;
import com.surge.loanManagement.service.DocumentService;

@RestController
public class DocumentController {

	@Autowired
	DocumentService documentService;
	
	@Autowired
	DocumentRepository documentRepository;

	@PostMapping("/fileSystem")
		public ResponseEntity<String> uploadfileToFileSystem(@RequestParam("file")MultipartFile file) throws IOException {
			String uploadImage = documentService.uploadfileToFileSystem(file);
			return ResponseEntity.status(HttpStatus.OK).body(uploadImage);
		}       
	 @GetMapping("/{filename}")
	    public ResponseEntity<Resource> getDocument(@PathVariable String filename) throws FileNotFoundException, MalformedURLException {
	        Resource file = documentService.loadFileAsResource(filename);
	        return ResponseEntity.ok()
	            .contentType(MediaType.APPLICATION_OCTET_STREAM) // Set appropriate media type
	            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
	            .body(file);
	    }
	
	 @PostMapping("/uploadDocument")
	    public ResponseEntity<DocumentDetails> uploadDocument(@RequestBody DocumentDetails documentDetails) {
	        DocumentDetails createdDocument = documentService.uploadDocument(documentDetails);
	        return ResponseEntity.ok(createdDocument);
	    }

	    @GetMapping("/getAllDocuments")
	    public ResponseEntity<List<DocumentDetails>> getAllDocuments() {
	        List<DocumentDetails> documents = documentService.getAllDocuments();
	        return ResponseEntity.ok(documents);
	    }

	    @GetMapping("/getDocumentById/{documentId}")
	    public ResponseEntity<DocumentDetails> getDocumentById(@PathVariable long documentId) {
	        DocumentDetails document = documentService.getDocumentById(documentId);
	        return ResponseEntity.ok(document);
	    }

	    @PutMapping("/updateDocument/{documentId}")
	    public ResponseEntity<DocumentDetails> updateDocument(
	            @PathVariable long documentId,
	            @RequestBody DocumentDetails documentDetails) {
	        DocumentDetails updatedDocument = documentService.updateDocument(documentId, documentDetails);
	        return ResponseEntity.ok(updatedDocument);
	    }

	    @DeleteMapping("/deleteDocument/{documentId}")
	    public ResponseEntity<Void> deleteDocument(@PathVariable long documentId) {
	    	documentService.deleteDocument(documentId);
	        return ResponseEntity.noContent().build();
	    }
}
