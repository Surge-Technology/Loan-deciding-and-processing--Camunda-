package com.camundaSaas.C8LoanProcess;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

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
