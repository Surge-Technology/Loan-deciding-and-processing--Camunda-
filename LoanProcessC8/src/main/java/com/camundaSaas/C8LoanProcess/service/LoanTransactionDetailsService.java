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
import java.util.UUID;

@Service
public class LoanTransactionDetailsService {

    @Autowired
    private LoanTransactionDetailsRepository loanTransactionDetailsRepository;
    public LoanTransactionDetails saveLoanTransaction(LoanTransactionDetails loanTransactionDetails) {

        String uanId= "UAN"+UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        loanTransactionDetails.setUanId(uanId);
        loanTransactionDetails.setTransactionStatus("Success");

        return loanTransactionDetailsRepository.save(loanTransactionDetails);
    }

    public List<LoanTransactionDetails> getAllTransactions() {
        return loanTransactionDetailsRepository.findAll();
    }

    public List<LoanTransactionDetails> getTransactionByAccountLoanNumber(String id) {
        return loanTransactionDetailsRepository.findByLoanAccountNumber(id)
                .orElseThrow(() -> new ResourceNotFoundException("LoanTransaction with AccountLoanNumber: " + id + " not found"));
    }

    public LoanTransactionDetails getTransactionByLoanId(Long id) {
        return loanTransactionDetailsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LoanTransaction with Loan Id: " + id + " not found"));
    }

    public List<LoanTransactionDetails> getTransactionByEmail(String email) {
        return loanTransactionDetailsRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("LoanTransaction with AccountLoanNumber: " + email + " not found"));
    }

    public byte[] generatePdfForTransactionTable(List<LoanTransactionDetails> transactions) {
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


    public byte[] generateTransactionPdf(List<LoanTransactionDetails> transactions) {
        // Set custom page size with reduced height (Half of A4 Landscape)
        Document document = new Document(new Rectangle(PageSize.A4.getWidth(), PageSize.A4.getHeight() / 2), 10, 10, 10, 10);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Define table for loan information
            PdfPTable loanInfoTable = new PdfPTable(2);
            loanInfoTable.setWidthPercentage(100);
            loanInfoTable.setWidths(new int[]{3, 3});

            PdfPCell titleCell = new PdfPCell(new Phrase("Generate Loan Statement", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            titleCell.setColspan(2);
            titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            titleCell.setPadding(10);
            titleCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            loanInfoTable.addCell(titleCell);

            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
            PdfPTable leftTable = new PdfPTable(2);
            leftTable.setWidthPercentage(100);
            leftTable.setWidths(new float[]{3, 5});  // Column 1: Labels, Column 2: Values

            leftTable.addCell(getCell("LAN Number", smallFont));
            leftTable.addCell(getCell(": LPCHE23452145874", smallFont));
            leftTable.addCell(getCell("Location", smallFont));
            leftTable.addCell(getCell(": CHENNAI", smallFont));
            leftTable.addCell(getCell("Name", smallFont));
            leftTable.addCell(getCell(": JOHN DOE", smallFont));
            leftTable.addCell(getCell("Address", smallFont));
            leftTable.addCell(getCell(": 3rd Floor, 55/5, Vijaya Raghava Rd, T. Nagar, Chennai, Tamil Nadu 600017", smallFont));

            PdfPTable rightTable = new PdfPTable(2);
            rightTable.setWidthPercentage(100);
            rightTable.setWidths(new float[]{3, 5});  // Column 1: Labels, Column 2: Values

            rightTable.addCell(getCell("Loan Amount", smallFont));
            rightTable.addCell(getCell(": 50,000", smallFont));
            rightTable.addCell(getCell("No Of Advanced EMI", smallFont));
            rightTable.addCell(getCell(": 0", smallFont));
            rightTable.addCell(getCell("Tenure (Months)", smallFont));
            rightTable.addCell(getCell(": 5", smallFont));
            rightTable.addCell(getCell("Installment", smallFont));
            rightTable.addCell(getCell(": 10,000", smallFont));
            rightTable.addCell(getCell("Start Date", smallFont));
            rightTable.addCell(getCell(": 05 May 2025", smallFont));
            rightTable.addCell(getCell("Repayment Mode", smallFont));
            rightTable.addCell(getCell(": CES", smallFont));
            rightTable.addCell(getCell("Rate of Interest(%)", smallFont));
            rightTable.addCell(getCell(": 11.45", smallFont));


            PdfPCell leftColumn = new PdfPCell(leftTable);
            leftColumn.setPadding(5);

            PdfPCell rightColumn = new PdfPCell(rightTable);
            rightColumn.setPadding(5);

            loanInfoTable.addCell(leftColumn);
            loanInfoTable.addCell(rightColumn);

            PdfPCell emptyCell = new PdfPCell(new Phrase(" "));
//            emptyCell.setBorder(Rectangle.NO_BORDER);

            PdfPCell principalCell = new PdfPCell(new Phrase("Principal Amount (less) Adv. EMIs: Rs 50,000",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9)));
            principalCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            principalCell.setPadding(5);

            loanInfoTable.addCell(emptyCell);
            loanInfoTable.addCell(principalCell);

            // Add Loan Info Table to Document
            document.add(loanInfoTable);
            document.add(new Paragraph(" ")); // Space before next table


            // Loan Transaction Details Table
            PdfPTable transactionTable = new PdfPTable(12);
            transactionTable.setWidthPercentage(100);
            transactionTable.setWidths(new int[]{3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3});

            transactionTable.addCell(new PdfPCell(new Phrase("Transaction ID", smallFont)));
            transactionTable.addCell(new PdfPCell(new Phrase("UAN ID", smallFont)));
            transactionTable.addCell(new PdfPCell(new Phrase("Transaction Status", smallFont)));
            transactionTable.addCell(new PdfPCell(new Phrase("Date", smallFont)));
            transactionTable.addCell(new PdfPCell(new Phrase("Loan Account Number", smallFont)));
            transactionTable.addCell(new PdfPCell(new Phrase("Loan Amount", smallFont)));
            transactionTable.addCell(new PdfPCell(new Phrase("Payment Type", smallFont)));
            transactionTable.addCell(new PdfPCell(new Phrase("Transaction Amount", smallFont)));
            transactionTable.addCell(new PdfPCell(new Phrase("Balance Amount", smallFont)));
            transactionTable.addCell(new PdfPCell(new Phrase("Email", smallFont)));
            transactionTable.addCell(new PdfPCell(new Phrase("Payment Method", smallFont)));
            transactionTable.addCell(new PdfPCell(new Phrase("Version", smallFont)));

            for (LoanTransactionDetails transaction : transactions) {
                transactionTable.addCell(new PdfPCell(new Phrase(String.valueOf(transaction.getLoanId()), smallFont)));
                transactionTable.addCell(new PdfPCell(new Phrase(transaction.getUanId(), smallFont)));
                transactionTable.addCell(new PdfPCell(new Phrase(transaction.getTransactionStatus(), smallFont)));
                transactionTable.addCell(new PdfPCell(new Phrase(transaction.getDate().toString(), smallFont)));
                transactionTable.addCell(new PdfPCell(new Phrase(transaction.getLoanAccountNumber(), smallFont)));
                transactionTable.addCell(new PdfPCell(new Phrase(String.valueOf(transaction.getLoanAmount()), smallFont)));
                transactionTable.addCell(new PdfPCell(new Phrase(transaction.getPaymentType(), smallFont)));
                transactionTable.addCell(new PdfPCell(new Phrase(String.valueOf(transaction.getTransactionAmount()), smallFont)));
                transactionTable.addCell(new PdfPCell(new Phrase(String.valueOf(transaction.getBalanceAmount()), smallFont)));
                transactionTable.addCell(new PdfPCell(new Phrase(transaction.getEmail(), smallFont)));
                transactionTable.addCell(new PdfPCell(new Phrase(transaction.getPaymentMethod(), smallFont)));
                transactionTable.addCell(new PdfPCell(new Phrase(String.valueOf(transaction.getVersion()), smallFont)));
            }
            document.add(transactionTable);

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return out.toByteArray();
    }

    private static PdfPCell getCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }


}
