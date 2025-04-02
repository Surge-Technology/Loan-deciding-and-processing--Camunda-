package com.camundaSaas.C8LoanProcess.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.camundaSaas.C8LoanProcess.Repository.LoanDetailsRepository;
import com.camundaSaas.C8LoanProcess.Repository.RepaymentScheduleRepository;
import com.camundaSaas.C8LoanProcess.exception.ResourceNotFoundException;
import com.camundaSaas.C8LoanProcess.model.Loan;
import com.camundaSaas.C8LoanProcess.model.RepaymentSchedule;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;

@Service
public class LoanDetailsService {

    @Autowired
    private LoanDetailsRepository loanDetailsRepository;
    
    @Autowired
    private RepaymentScheduleRepository repaymentScheduleRepository;
    

    public Loan saveLoan(Loan loan) {
        return loanDetailsRepository.save(loan);
    }

    public List<Loan> getAllLoans() {
        return loanDetailsRepository.findAll();
    }

    public Optional<Loan> getLoanById(Long id) {
        return loanDetailsRepository.findById(id);
    }

    public Loan getLoanByAccountNumber(String loanAccountNumber) {

        return loanDetailsRepository.findByLoanAccountNumber(loanAccountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found for account number: " + loanAccountNumber));
    }
    
    public Optional<Loan> getLoanDetails(String loanAccountNumber) {
        return loanDetailsRepository.findByLoanAccountNumber(loanAccountNumber);
    }

//    public List<RepaymentSchedule> getRepaymentSchedule(String loanAccountNumber) {
//        return repaymentScheduleRepository.findByLoanAccountNumber(loanAccountNumber);
//    }

    public List<RepaymentSchedule> calculateAmortizationSchedule(Loan loan) {
        double principal = Double.parseDouble(loan.getLoanAmount());
        double monthlyInterestRate = loan.getInterest() / 100 / 12;
        int totalPayments = loan.getTenure() * 12;

        // Calculate EMI using amortization formula
        double monthlyPayment = (principal * monthlyInterestRate) /
                (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

        double remainingBalance = principal;
        LocalDate installmentDate = LocalDate.now().plusMonths(1);

        List<RepaymentSchedule> schedule = new ArrayList<>();

        for (int i = 1; i <= totalPayments; i++) {
            double interestPayment = remainingBalance * monthlyInterestRate;
            double principalPayment = monthlyPayment - interestPayment;
            remainingBalance -= principalPayment;

            RepaymentSchedule installment = new RepaymentSchedule();
            installment.setInstallmentNo(i);
            installment.setInstallmentDate(installmentDate);
            installment.setInstallmentAmount(monthlyPayment);
            installment.setPrincipal(principalPayment);
            installment.setInterest(interestPayment);
            installment.setClosingPrincipal(Math.max(0, remainingBalance));
            installment.setLoanAccountNumber(loan.getLoanAccountNumber());

            schedule.add(installment);
            installmentDate = installmentDate.plusMonths(1);
        }

        repaymentScheduleRepository.saveAll(schedule);
        return schedule;
    }
    
    

    public List<RepaymentSchedule> getRepaymentSchedule(String loanAccountNumber) {
        return repaymentScheduleRepository.findByLoanAccountNumber(loanAccountNumber);
    }
    
    

    public byte[] generatePdf(List<RepaymentSchedule> schedules) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfDocument pdfDoc = new PdfDocument(new PdfWriter(outputStream));
            Document document = new Document(pdfDoc);

            // Title
            document.add(new Paragraph("Repayment Schedule").setBold().setFontSize(16));

            // Create Table
            float[] columnWidths = {50F, 100F, 100F, 100F, 100F, 100F};
            Table table = new Table(columnWidths);
            table.addHeaderCell("No.");
            table.addHeaderCell("Date");
            table.addHeaderCell("Installment Amount");
            table.addHeaderCell("Principal");
            table.addHeaderCell("Interest");
            table.addHeaderCell("Closing Balance");

            // Populate Table
            for (RepaymentSchedule schedule : schedules) {
                table.addCell(String.valueOf(schedule.getInstallmentNo()));
                table.addCell(schedule.getInstallmentDate().toString());
                table.addCell(String.format("%.2f", schedule.getInstallmentAmount()));
                table.addCell(String.format("%.2f", schedule.getPrincipal()));
                table.addCell(String.format("%.2f", schedule.getInterest()));
                table.addCell(String.format("%.2f", schedule.getClosingPrincipal()));
            }

            document.add(table);
            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }
}