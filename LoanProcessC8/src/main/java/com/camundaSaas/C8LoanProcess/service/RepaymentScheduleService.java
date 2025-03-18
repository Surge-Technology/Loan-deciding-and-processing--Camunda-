package com.camundaSaas.C8LoanProcess.service;

import com.camundaSaas.C8LoanProcess.Repository.LoanDetailsRepository;
import com.camundaSaas.C8LoanProcess.Repository.RepaymentScheduleRepository;
import com.camundaSaas.C8LoanProcess.model.Loan;
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
