package com.camundaSaas.C8LoanProcess.service;

import com.camundaSaas.C8LoanProcess.Repository.RepaymentScheduleRepository;
import com.camundaSaas.C8LoanProcess.model.RepaymentSchedule;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class RepaymentScheduleService {

    @Autowired
    private RepaymentScheduleRepository repaymentScheduleRepository;

    public RepaymentSchedule saveRepaymentSchedule(RepaymentSchedule repaymentSchedule) {
        return repaymentScheduleRepository.save(repaymentSchedule);
    }

    public List<RepaymentSchedule> getRepaymentScheduleByLoanAccountNumber(String loanAccountNumber) {
        return repaymentScheduleRepository.findByLoanAccountNumber(loanAccountNumber);
    }

    public byte[] generatePdf(List<RepaymentSchedule> schedules) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Paragraph title = new Paragraph("Repayment Schedule", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{2, 3, 3, 3, 3, 3});

            // Table Header
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            table.addCell(new PdfPCell(new Phrase("Installment No", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Date", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Amount", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Principal", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Interest", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Closing Principal", headerFont)));

            // Table Data
            for (RepaymentSchedule schedule : schedules) {
                table.addCell(String.valueOf(schedule.getInstallmentNo()));
                table.addCell(schedule.getInstallmentDate().toString());
                table.addCell(schedule.getInstallmentAmount().toString());
                table.addCell(schedule.getPrincipal().toString());
                table.addCell(schedule.getInterest().toString());
                table.addCell(schedule.getClosingPrincipal().toString());
            }

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return out.toByteArray();
    }
}
