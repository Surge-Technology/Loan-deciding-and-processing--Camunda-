package com.surge.loanManagement.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.surge.loanManagement.model.DocumentDetails;
import com.surge.loanManagement.repository.DocumentRepository;
import com.surge.loanManagement.repository.JsonDataRepository;

@Service
public class DocumentService {
	

	private final String FileSystem = "C:/Users/STS177/Desktop/FileSystem/";

	@Autowired
	DocumentRepository documentRepository;
	
	@Autowired
	JsonDataRepository jsonDataRepository;

	public String uploadfileToFileSystem(MultipartFile file) throws IOException {
		String filePath = FileSystem + file.getOriginalFilename();

		String fileName = file.getOriginalFilename();
		System.out.print("FileName" + fileName);
		String fileType = file.getContentType();

		DocumentDetails fileData = createFileData(fileName, fileType, filePath);

		documentRepository.save(fileData);

		file.transferTo(new File(filePath));

		if (fileData != null) {
			return "file uploaded successfully : " + filePath;
		}
		return null;
	}

//	public Resource loadFileAsResource(String filename) throws FileNotFoundException, MalformedURLException {
//
//		Path filePath = Paths.get(FileSystem).resolve(filename).normalize();
//		Resource resource = new UrlResource(filePath.toUri());
//		if (resource.exists() || resource.isReadable()) {
//			return resource;
//		} else {
//			throw new FileNotFoundException("File not found: " + filename);
//		}
//
//	}

	public DocumentDetails createFileData(String documentName, String documentType, String documentPath) {
		// Return a new FileData object using the provided file details
		return new DocumentDetails(documentName, documentType, documentPath);
	}

	public DocumentDetails uploadDocument(DocumentDetails documentDetails) {
		return documentRepository.save(documentDetails);
	}

	public List<DocumentDetails> getAllDocuments() {
		return documentRepository.findAll();
	}

	public DocumentDetails getDocumentById(long documentId) {
		return documentRepository.findById(documentId)
				.orElseThrow(() -> new RuntimeException("Document not found with ID: " + documentId));
	}

	public DocumentDetails updateDocument(long documentId, DocumentDetails documentDetails) {
		DocumentDetails existingDocument = getDocumentById(documentId);
		existingDocument.setDocumentName(documentDetails.getDocumentName());
		existingDocument.setDocumentType(documentDetails.getDocumentType());
		existingDocument.setUploadedBy(documentDetails.getUploadedBy());
		existingDocument.setUploadedOn(documentDetails.getUploadedOn());
		existingDocument.setUpdatedBy(documentDetails.getUpdatedBy());
		existingDocument.setUpdatedOn(documentDetails.getUpdatedOn());
		existingDocument.setDocumentPath(documentDetails.getDocumentPath());
		return documentRepository.save(existingDocument);
	}

	public void deleteDocument(long documentId) {
		documentRepository.deleteById(documentId);
	}
	
//	public void storeFile(String fileName, String base64Content) throws IOException {
//
//        byte[] fileBytes = Base64.getDecoder().decode(base64Content);
//
//        File targetFile = new File(FileSystem + File.separator + fileName);
//
//        targetFile.getParentFile().mkdirs();
//
//        try (FileOutputStream fos = new FileOutputStream(targetFile)) {
//            fos.write(fileBytes);
//        }
//    }
	  public Resource loadFileAsResource(String fileName) {
	        try {
	            File file = new File(FileSystem + File.separator + fileName);  // Assuming files are stored in uploadDir
	            if (file.exists()) {
	                return new FileSystemResource(file);  // Wrap the file in a resource
	            } else {
	                throw new RuntimeException("File not found: " + fileName);
	            }
	        } catch (Exception e) {
	            throw new RuntimeException("Could not read the file: " + fileName, e);
	        }
	    }
	  
	  public String storeFile(String fileName, String base64Content) {
	        try {
	            byte[] fileBytes = Base64.getDecoder().decode(base64Content);

	            // Ensure directory exists
	            File directory = new File(FileSystem);
	            if (!directory.exists()) {
	                directory.mkdirs();
	            }

	            // Save file
	            File file = new File(Paths.get(FileSystem, fileName).toString());
	            try (FileOutputStream fos = new FileOutputStream(file)) {
	                fos.write(fileBytes);
	            }

	            System.out.println("File stored successfully: " + file.getAbsolutePath());
	            return file.getAbsolutePath();  // Return stored file path

	        } catch (IOException e) {
	            System.err.println("Error saving file: " + fileName);
	            e.printStackTrace();
	            return null;
	        }
	    }

}
