package com.camundaSaas.C8LoanProcess.service;

import com.camundaSaas.C8LoanProcess.Repository.LoanDetailsRepository;
import com.camundaSaas.C8LoanProcess.Repository.RepaymentScheduleRepository;
import com.camundaSaas.C8LoanProcess.model.Loan;
import com.camundaSaas.C8LoanProcess.model.LoanTransactionDetails;
import com.camundaSaas.C8LoanProcess.model.RepaymentSchedule;
import com.camundaSaas.C8LoanProcess.model.RepaymentScheduleDetailsDto;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RepaymentScheduleService {

    @Autowired
    private RepaymentScheduleRepository repaymentScheduleRepository;

    @Autowired
    private LoanDetailsRepository loanDetailsRepository;

    public RepaymentSchedule saveRepaymentSchedule(RepaymentSchedule repaymentSchedule) {
        return repaymentScheduleRepository.save(repaymentSchedule);
    }

    public List<RepaymentSchedule> getRepaymentScheduleByLoanAccountNumber(String loanAccountNumber) {
         return repaymentScheduleRepository.findByLoanAccountNumber(loanAccountNumber);
    }

    public List<RepaymentScheduleDetailsDto> getRepaymentScheduleByLoanAccountNum(String loanAccountNumber) {
        List<RepaymentSchedule> repaymentSchedules = repaymentScheduleRepository.findByLoanAccountNumber(loanAccountNumber);
        List<RepaymentScheduleDetailsDto> listData=new ArrayList<>();
        ModelMapper modelMapper=new ModelMapper();
        for(RepaymentSchedule repaymentSchedule : repaymentSchedules){

            Optional<Loan> byLoanAccountNumber = loanDetailsRepository.findByLoanAccountNumber(repaymentSchedule.getLoanAccountNumber());
            if(byLoanAccountNumber.isPresent()){
                RepaymentScheduleDetailsDto dto = modelMapper.map(repaymentSchedule, RepaymentScheduleDetailsDto.class);
                dto.setTenure(byLoanAccountNumber.get().getTenure());
                listData.add(dto);
            }
        }

        return listData;
    }

    public byte[] generatePdf(List<RepaymentSchedule> schedules) {
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

            PdfPCell titleCell = new PdfPCell(new Phrase("Amortisation Schedule", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
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

            // Repayment Schedule Table
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{2, 3, 3, 3, 3, 3});

            // Table Header
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            table.addCell(new PdfPCell(new Phrase("Installment No", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Date", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Amount", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Principal", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Interest", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Closing Principal", smallFont)));

            // Table Data
            for (RepaymentSchedule schedule : schedules) {
                table.addCell(new PdfPCell(new Phrase(String.valueOf(schedule.getInstallmentNo()), smallFont)));
                table.addCell(new PdfPCell(new Phrase(schedule.getInstallmentDate().toString(), smallFont)));
                table.addCell(new PdfPCell(new Phrase(schedule.getInstallmentAmount().toString(), smallFont)));
                table.addCell(new PdfPCell(new Phrase(schedule.getPrincipal().toString(), smallFont)));
                table.addCell(new PdfPCell(new Phrase(schedule.getInterest().toString(), smallFont)));
                table.addCell(new PdfPCell(new Phrase(schedule.getClosingPrincipal().toString(), smallFont)));
            }

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return out.toByteArray();
    }

    public byte[] generateLoanClosurePdf(List<RepaymentSchedule> schedules) {
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

            PdfPCell titleCell = new PdfPCell(new Phrase("Loan Closure Statement", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
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


            // Loan Closure Details
            boolean isLoanClosed = schedules.get(schedules.size() - 1).getClosingPrincipal() == 0;
            LocalDate closureDate = isLoanClosed ? schedules.get(schedules.size() - 1).getInstallmentDate() : null;

            // Compute total interest paid
            double totalInterestPaid = schedules.stream().mapToDouble(RepaymentSchedule::getInterest).sum();

            rightTable.addCell(getCell("Loan Closure Status", smallFont));
            rightTable.addCell(getCell(isLoanClosed ? ": YES" : ": NO", smallFont));
            rightTable.addCell(getCell("Loan Closure Date", smallFont));
            rightTable.addCell(getCell(closureDate != null ? ": " + closureDate.toString() : ": N/A", smallFont));
            rightTable.addCell(getCell("Final Settlement Amount", smallFont));
            rightTable.addCell(getCell(": " + (isLoanClosed ? schedules.get(schedules.size() - 1).getInstallmentAmount().toString() : "N/A"), smallFont));
            rightTable.addCell(getCell("Closure Method", smallFont));
            rightTable.addCell(getCell(": EMI Completion", smallFont)); // You can modify this based on logic
            rightTable.addCell(getCell("Closure Remarks", smallFont));
            rightTable.addCell(getCell(": Loan successfully closed", smallFont)); // You can customize this
            rightTable.addCell(getCell("Total Interest Paid", smallFont));
            rightTable.addCell(getCell(": " + String.format("%.2f", totalInterestPaid), smallFont));


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

            // Repayment Schedule Table
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{2, 3, 3, 3, 3, 3});

            // Table Header
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            table.addCell(new PdfPCell(new Phrase("Installment No", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Date", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Amount Paid", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Principal", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Interest", smallFont)));
            table.addCell(new PdfPCell(new Phrase("Closing Principal", smallFont)));

            // Table Data
            for (RepaymentSchedule schedule : schedules) {
                table.addCell(new PdfPCell(new Phrase(String.valueOf(schedule.getInstallmentNo()), smallFont)));
                table.addCell(new PdfPCell(new Phrase(schedule.getInstallmentDate().toString(), smallFont)));
                table.addCell(new PdfPCell(new Phrase(schedule.getInstallmentAmount().toString(), smallFont)));
                table.addCell(new PdfPCell(new Phrase(schedule.getPrincipal().toString(), smallFont)));
                table.addCell(new PdfPCell(new Phrase(schedule.getInterest().toString(), smallFont)));
                table.addCell(new PdfPCell(new Phrase(schedule.getClosingPrincipal().toString(), smallFont)));
            }

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return out.toByteArray();
    }

    public byte[] generateLoanClosureReport(List<RepaymentSchedule> schedules) {
        Document document = new Document(new Rectangle(PageSize.A4.getWidth(), PageSize.A4.getHeight() / 2), 10, 10, 10, 10);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Report Header
            Paragraph header = new Paragraph("Loan Closure Report", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);
            document.add(new Paragraph("Generated Date: " + LocalDate.now(), FontFactory.getFont(FontFactory.HELVETICA, 10)));
            document.add(new Paragraph("Reference No: LCR-2025-001", FontFactory.getFont(FontFactory.HELVETICA, 10)));
            document.add(new Paragraph(" "));

            // Loan Summary Table
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(100);
            summaryTable.setWidths(new int[]{3, 5});

            summaryTable.addCell(getCell("LAN Number", true));
            summaryTable.addCell(getCell(": LPCHE23452145874", false));
            summaryTable.addCell(getCell("Borrower Name", true));
            summaryTable.addCell(getCell(": John Doe", false));
            summaryTable.addCell(getCell("Loan Amount", true));
            summaryTable.addCell(getCell(": 50,000", false));
            summaryTable.addCell(getCell("Interest Rate", true));
            summaryTable.addCell(getCell(": 11.45%", false));
            summaryTable.addCell(getCell("Tenure (Months)", true));
            summaryTable.addCell(getCell(": 5", false));
            summaryTable.addCell(getCell("Start Date", true));
            summaryTable.addCell(getCell(": 05 May 2025", false));
            summaryTable.addCell(getCell("Repayment Mode", true));
            summaryTable.addCell(getCell(": CES", false));

            document.add(summaryTable);
            document.add(new Paragraph(" "));

            // Compute closure details
            boolean isLoanClosed = schedules.get(schedules.size() - 1).getClosingPrincipal() == 0;
            LocalDate closureDate = isLoanClosed ? schedules.get(schedules.size() - 1).getInstallmentDate() : null;
            double totalInterestPaid = schedules.stream().mapToDouble(RepaymentSchedule::getInterest).sum();

            // Loan Closure Details
            PdfPTable closureTable = new PdfPTable(2);
            closureTable.setWidthPercentage(100);
            closureTable.setWidths(new int[]{3, 5});

            closureTable.addCell(getCell("Loan Closure Status", true));
            closureTable.addCell(getCell(isLoanClosed ? ": YES" : ": NO", false));
            closureTable.addCell(getCell("Loan Closure Date", true));
            closureTable.addCell(getCell(closureDate != null ? ": " + closureDate.toString() : ": N/A", false));
            closureTable.addCell(getCell("Total Interest Paid", true));
            closureTable.addCell(getCell(": " + String.format("%.2f", totalInterestPaid), false));
            closureTable.addCell(getCell("Final Settlement Amount", true));
            closureTable.addCell(getCell(isLoanClosed ? ": " + schedules.get(schedules.size() - 1).getInstallmentAmount().toString() : ": N/A", false));
            closureTable.addCell(getCell("Closure Method", true));
            closureTable.addCell(getCell(": EMI Completion", false));

            document.add(closureTable);
            document.add(new Paragraph(" "));

            // Repayment Schedule Table
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{2, 3, 3, 3, 3, 3});

            String[] headers = {"Installment No", "Date", "Amount Paid", "Principal", "Interest", "Closing Principal"};
            for (String headerText : headers) {
                PdfPCell headerCell = new PdfPCell(new Phrase(headerText, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9)));
                table.addCell(headerCell);
            }

            for (RepaymentSchedule schedule : schedules) {
                table.addCell(new PdfPCell(new Phrase(String.valueOf(schedule.getInstallmentNo()))));
                table.addCell(new PdfPCell(new Phrase(schedule.getInstallmentDate().toString())));
                table.addCell(new PdfPCell(new Phrase(schedule.getInstallmentAmount().toString())));
                table.addCell(new PdfPCell(new Phrase(schedule.getPrincipal().toString())));
                table.addCell(new PdfPCell(new Phrase(schedule.getInterest().toString())));
                table.addCell(new PdfPCell(new Phrase(schedule.getClosingPrincipal().toString())));
            }
            document.add(table);
            document.add(new Paragraph(" "));

            // Loan Closure Certificate (Only if Loan is Fully Paid)
            if (isLoanClosed) {
                Paragraph certificate = new Paragraph("\nCERTIFICATE OF LOAN CLOSURE\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14));
                certificate.setAlignment(Element.ALIGN_CENTER);
                document.add(certificate);
                document.add(new Paragraph("This is to certify that the loan with LAN Number LPCHE23452145874 has been successfully closed as of " + closureDate + "."));
                document.add(new Paragraph("No further dues are pending, and the borrower has fulfilled all financial obligations."));
                document.add(new Paragraph("\nAuthorized Signatory: ___________"));
            }

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return out.toByteArray();
    }

    public byte[] generateComplianceAuditReport(Loan loan, List<RepaymentSchedule> schedules) {
        Document document = new Document(PageSize.A4, 20, 20, 20, 20);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Report Header
            Paragraph header = new Paragraph("Compliance & Audit Report", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);
            document.add(new Paragraph("Generated Date: " + LocalDate.now(), FontFactory.getFont(FontFactory.HELVETICA, 10)));
            document.add(new Paragraph("Reference No: CAR-2025-001", FontFactory.getFont(FontFactory.HELVETICA, 10)));
            document.add(new Paragraph(" "));

            // Loan Summary
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(100);
            summaryTable.setWidths(new int[]{3, 5});

            summaryTable.addCell(getCell("Loan ID", true));
            summaryTable.addCell(getCell(": " + loan.getLoanId(), false));
            summaryTable.addCell(getCell("Borrower Name", true));
            summaryTable.addCell(getCell(": JOHN DOE", false));
            summaryTable.addCell(getCell("Loan Amount", true));
            summaryTable.addCell(getCell(": " + 50000.0, false));
            summaryTable.addCell(getCell("Interest Rate (%)", true));
            summaryTable.addCell(getCell(": " + 11.45, false));
            summaryTable.addCell(getCell("Tenure (Months)", true));
            summaryTable.addCell(getCell(": " + 5, false));
            summaryTable.addCell(getCell("Start Date", true));
            summaryTable.addCell(getCell(": 27-06-2024" , false));
            summaryTable.addCell(getCell("Compliance Status", true));
            summaryTable.addCell(getCell(": Non-Compliant", false));

            document.add(summaryTable);
            document.add(new Paragraph(" "));

            // Financial Audit
            PdfPTable auditTable = new PdfPTable(2);
            auditTable.setWidthPercentage(100);
            auditTable.setWidths(new int[]{3, 5});

            double totalPaid = schedules.stream().mapToDouble(RepaymentSchedule::getInstallmentAmount).sum();
            double totalInterestPaid = schedules.stream().mapToDouble(RepaymentSchedule::getInterest).sum();
            double outstandingBalance = schedules.get(schedules.size() - 1).getClosingPrincipal();
            boolean isLoanClosed = outstandingBalance == 0;

            auditTable.addCell(getCell("Total Amount Paid", true));
            auditTable.addCell(getCell(": " + 51482.07, false));
            auditTable.addCell(getCell("Total Interest Paid", true));
            auditTable.addCell(getCell(": " + totalInterestPaid, false));
            auditTable.addCell(getCell("Outstanding Balance", true));
            auditTable.addCell(getCell(": " + outstandingBalance, false));
            auditTable.addCell(getCell("Loan Closure Status", true));
            auditTable.addCell(getCell(": " + (isLoanClosed ? "Closed" : "Active"), false));

            document.add(auditTable);
            document.add(new Paragraph(" "));

            // Risk Assessment
            PdfPTable riskTable = new PdfPTable(2);
            riskTable.setWidthPercentage(100);
            riskTable.setWidths(new int[]{3, 5});

            riskTable.addCell(getCell("Missed Payments", true));
            riskTable.addCell(getCell(": 0", false));
            riskTable.addCell(getCell("Overdue EMIs", true));
            riskTable.addCell(getCell(": No", false));
            riskTable.addCell(getCell("Fraud Checks", true));
            riskTable.addCell(getCell(": Clear", false));

            document.add(riskTable);
            document.add(new Paragraph(" "));

            // Compliance & Audit Conclusion
            Paragraph conclusion = new Paragraph("Final Compliance & Audit Status: PASS",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12));
            document.add(conclusion);

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return out.toByteArray();
    }

    private PdfPCell getCell(String text, boolean isBold) {
        Font font = isBold ? FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9) : FontFactory.getFont(FontFactory.HELVETICA, 9);
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        return cell;
    }


    private static PdfPCell getCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }


    // Helper method to add a row to the loan details table
    private void addLoanInfoRow(PdfPTable table, String label, String value) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 12);

        PdfPCell cell1 = new PdfPCell(new Phrase(label, font));
        cell1.setBackgroundColor(BaseColor.LIGHT_GRAY);
        table.addCell(cell1);

        PdfPCell cell2 = new PdfPCell(new Phrase(value, font));
        table.addCell(cell2);
    }

}
