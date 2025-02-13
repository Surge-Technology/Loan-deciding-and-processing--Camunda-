package com.surge.loanManagement;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
 
@Configuration
public class AppConfig {
 
    @Value("${app.filesystem.path}")
    private String fileSystemPath;
 
    @Value("${app.loans.pdf.path}")
    private String loanPdfPath;
 
    public String getFileSystemPath() {
        return fileSystemPath;
    }
 
    public String getLoanPdfPath() {
        return loanPdfPath;
    }
}