package com.camundaSaas.C8LoanProcess.service;

import com.camundaSaas.C8LoanProcess.Repository.LoanTransactionDetailsRepository;
import com.camundaSaas.C8LoanProcess.exception.ResourceNotFoundException;
import com.camundaSaas.C8LoanProcess.model.LoanTransactionDetails;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class LoanTransactionDetailsService {

    @Autowired
    private LoanTransactionDetailsRepository loanTransactionDetailsRepository;
    public LoanTransactionDetails saveLoanTransaction(LoanTransactionDetails loanTransactionDetails) {
        return loanTransactionDetailsRepository.save(loanTransactionDetails);
    }

    public List<LoanTransactionDetails> getAllTransactions() {
        return loanTransactionDetailsRepository.findAll();
    }

    public List<LoanTransactionDetails> getTransactionByAccountLoanNumber(String id) {
        return loanTransactionDetailsRepository.findByLoanAccountNumber(id)
                .orElseThrow(() -> new ResourceNotFoundException("LoanTransaction with AccountLoanNumber: " + id + " not found"));
    }

    public List<LoanTransactionDetails> getTransactionByEmail(String email) {
        return loanTransactionDetailsRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("LoanTransaction with AccountLoanNumber: " + email + " not found"));
    }

    public byte[] generateTransactionPdf(List<LoanTransactionDetails> transactions) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Paragraph title = new Paragraph("Loan Transaction Details", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(8); // Updated to 8 columns to include email
            table.setWidthPercentage(100);
            table.setWidths(new int[]{2, 3, 3, 3, 3, 3, 3, 4}); // Adjusted for 8 columns

            // Table Header
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            table.addCell(new PdfPCell(new Phrase("Transaction ID", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Date", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Status", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Loan Amount", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Transaction Amount", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Balance Amount", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Payment Type", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Email", headerFont))); // Added Email

            // Table Data
            for (LoanTransactionDetails transaction : transactions) {
                table.addCell(String.valueOf(transaction.getLoanId()));
                table.addCell(transaction.getDate().toString());
                table.addCell(transaction.getTransactionStatus());
                table.addCell(transaction.getLoanAmount().toString());
                table.addCell(transaction.getTransactionAmount().toString());
                table.addCell(transaction.getBalanceAmount().toString());
                table.addCell(transaction.getPaymentType());
                table.addCell(transaction.getEmail()); // Added Email
            }

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return out.toByteArray();
    }

}
