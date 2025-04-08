package com.camundaSaas.C8LoanProcess.service;

import java.io.ByteArrayOutputStream;
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
import com.camundaSaas.C8LoanProcess.model.LoanApplicantDetails;
import com.camundaSaas.C8LoanProcess.model.RepaymentSchedule;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

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

		return loanDetailsRepository.findByLoanAccountNumber(loanAccountNumber).orElseThrow(
				() -> new ResourceNotFoundException("Loan not found for account number: " + loanAccountNumber));
	}

	public Optional<Loan> getLoanDetails(String loanAccountNumber) {
		return loanDetailsRepository.findByLoanAccountNumber(loanAccountNumber);
	}

//    public List<RepaymentSchedule> getRepaymentSchedule(String loanAccountNumber) {
//        return repaymentScheduleRepository.findByLoanAccountNumber(loanAccountNumber);
//    }

	private PdfPCell getCell(String text, boolean isBold) {
		Font font = isBold ? FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9)
				: FontFactory.getFont(FontFactory.HELVETICA, 9);
		PdfPCell cell = new PdfPCell(new Phrase(text, font));
		return cell;
	}

	private static PdfPCell getCell(String text, Font font) {
		PdfPCell cell = new PdfPCell(new Phrase(text, font));
		cell.setBorder(Rectangle.NO_BORDER);
		return cell;
	}

	public List<RepaymentSchedule> calculateAmortizationSchedule(Loan loan) {
		double principal = Double.parseDouble(loan.getLoanAmount());
		double monthlyInterestRate = loan.getInterest() / 100 / 12;
		int totalPayments = loan.getTenure() * 12;

		double monthlyPayment = (principal * monthlyInterestRate)
				/ (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

		double remainingBalance = principal;
		// LocalDate installmentDate = LocalDate.now().plusMonths(1);

		List<RepaymentSchedule> schedule = new ArrayList<>();

		for (int i = 1; i <= totalPayments; i++) {
			LocalDate installmentDate = LocalDate.now().plusMonths(i);
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

//    public byte[] generatePdf(List<RepaymentSchedule> schedules) {
//    	 Document document = new Document(new Rectangle(PageSize.A4.getWidth(), PageSize.A4.getHeight() / 2), 10, 10, 10, 10);
//
//         ByteArrayOutputStream out = new ByteArrayOutputStream();
//
//         try {
//             PdfWriter.getInstance(document, out);
//             document.open();
//             PdfPTable loanInfoTable = new PdfPTable(2);
//             loanInfoTable.setWidthPercentage(100);
//             loanInfoTable.setWidths(new int[]{3, 3});
//
//             PdfPCell titleCell = new PdfPCell(new Phrase("Amortisation Schedule", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
//             titleCell.setColspan(2);
//             titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
//             titleCell.setPadding(10);
//             titleCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
//             loanInfoTable.addCell(titleCell);
//
//             Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
//             PdfPTable leftTable = new PdfPTable(2);
//             leftTable.setWidthPercentage(100);
//             leftTable.setWidths(new float[]{3, 5}); 
//             
//             
//
//             leftTable.addCell(getCell("LAN Number", smallFont));
//             leftTable.addCell(getCell(": LPCHE23452145874", smallFont));
//             leftTable.addCell(getCell("Location", smallFont));
//             leftTable.addCell(getCell(": CHENNAI", smallFont));
//             leftTable.addCell(getCell("Name", smallFont));
//             leftTable.addCell(getCell(": JOHN DOE", smallFont));
//             leftTable.addCell(getCell("Address", smallFont));
//             leftTable.addCell(getCell(": 3rd Floor, 55/5, Vijaya Raghava Rd, T. Nagar, Chennai, Tamil Nadu 600017", smallFont));
//
//             PdfPTable rightTable = new PdfPTable(2);
//             rightTable.setWidthPercentage(100);
//             rightTable.setWidths(new float[]{3, 5});  
//
//             rightTable.addCell(getCell("Loan Amount", smallFont));
//             rightTable.addCell(getCell(": 50,000", smallFont));
//             rightTable.addCell(getCell("No Of Advanced EMI", smallFont));
//             rightTable.addCell(getCell(": 0", smallFont));
//             rightTable.addCell(getCell("Tenure (Months)", smallFont));
//             rightTable.addCell(getCell(": 5", smallFont));
//             rightTable.addCell(getCell("Installment", smallFont));
//             rightTable.addCell(getCell(": 10,000", smallFont));
//             rightTable.addCell(getCell("Start Date", smallFont));
//             rightTable.addCell(getCell(": 05 May 2025", smallFont));
//             rightTable.addCell(getCell("Repayment Mode", smallFont));
//             rightTable.addCell(getCell(": CES", smallFont));
//             rightTable.addCell(getCell("Rate of Interest(%)", smallFont));
//             rightTable.addCell(getCell(": 11.45", smallFont));
//
//             PdfPCell leftColumn = new PdfPCell(leftTable);
//             leftColumn.setPadding(5);
//
//             PdfPCell rightColumn = new PdfPCell(rightTable);
//             rightColumn.setPadding(5);
//
//             loanInfoTable.addCell(leftColumn);
//             loanInfoTable.addCell(rightColumn);
//
//             PdfPCell emptyCell = new PdfPCell(new Phrase(" "));
////             emptyCell.setBorder(Rectangle.NO_BORDER);
//
//             PdfPCell principalCell = new PdfPCell(new Phrase("Principal Amount (less) Adv. EMIs: Rs 50,000",
//                     FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9)));
//             principalCell.setHorizontalAlignment(Element.ALIGN_LEFT);
//             principalCell.setPadding(5);
//
//             loanInfoTable.addCell(emptyCell);
//             loanInfoTable.addCell(principalCell);
//             document.add(loanInfoTable);
//             document.add(new Paragraph(" "));
//
//             PdfPTable table = new PdfPTable(6);
//             table.setWidthPercentage(100);
//             table.setWidths(new int[]{2, 3, 3, 3, 3, 3});
//             
//         
////        try (
////        	ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
////            PdfDocument pdfDoc = new PdfDocument(new PdfWriter(outputStream));
////            Document document = new Document(pdfDoc);
////
////            // Title
////            document.add(new Paragraph("Repayment Schedule").setBold().setFontSize(16));
////
////            // Create Table
////            float[] columnWidths = {50F, 100F, 100F, 100F, 100F, 100F};
////            Table table = new Table(columnWidths);
////            table.addHeaderCell("No.");
////            table.addHeaderCell("Date");
////            table.addHeaderCell("Installment Amount");
////            table.addHeaderCell("Principal");
////            table.addHeaderCell("Interest");
////            table.addHeaderCell("Closing Balance");
////
//             
////            // Populate Table
////            for (RepaymentSchedule schedule : schedules) {
////                table.addCell(String.valueOf(schedule.getInstallmentNo()));
////                table.addCell(schedule.getInstallmentDate().toString());
////                table.addCell(String.format("%.2f", schedule.getInstallmentAmount()));
////                table.addCell(String.format("%.2f", schedule.getPrincipal()));
////                table.addCell(String.format("%.2f", schedule.getInterest()));
////                table.addCell(String.format("%.2f", schedule.getClosingPrincipal()));
////            }
////
////            document.add(table);
////            document.close();
////            return outputStream.toByteArray();
////        } catch (Exception e) {
////            throw new RuntimeException("Error generating PDF", e);
////        }
//             Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
//             table.addCell(new PdfPCell(new Phrase("Installment No", smallFont)));
//             table.addCell(new PdfPCell(new Phrase("Date", smallFont)));
//             table.addCell(new PdfPCell(new Phrase("Amount", smallFont)));
//             table.addCell(new PdfPCell(new Phrase("Principal", smallFont)));
//             table.addCell(new PdfPCell(new Phrase("Interest", smallFont)));
//             table.addCell(new PdfPCell(new Phrase("Closing Principal", smallFont)));
//           for (RepaymentSchedule schedule : schedules) {
//           table.addCell(String.valueOf(schedule.getInstallmentNo()));
//           table.addCell(schedule.getInstallmentDate().toString());
//           table.addCell(String.format("%.2f", schedule.getInstallmentAmount()));
//           table.addCell(String.format("%.2f", schedule.getPrincipal()));
//           table.addCell(String.format("%.2f", schedule.getInterest()));
//           table.addCell(String.format("%.2f", schedule.getClosingPrincipal()));
//       }
//        
//           document.add(table);
//           document.close();
//       } catch (DocumentException e) {
//           e.printStackTrace();
//       }
//       return out.toByteArray();
//    }

	public byte[] generatePdf(List<RepaymentSchedule> schedules, LoanApplicantDetails loanApplicantDetails)
			throws JsonMappingException, JsonProcessingException {
		Document document = new Document(new Rectangle(PageSize.A4.getWidth(), PageSize.A4.getHeight() / 2), 10, 10, 10,
				10);
		ByteArrayOutputStream out = new ByteArrayOutputStream();

		try {
			PdfWriter.getInstance(document, out);
			document.open();

			PdfPTable loanInfoTable = new PdfPTable(2);
			loanInfoTable.setWidthPercentage(100);
			loanInfoTable.setWidths(new int[] { 3, 3 });

			PdfPCell titleCell = new PdfPCell(
					new Phrase("Amortization Schedule", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
			titleCell.setColspan(2);
			titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
			titleCell.setPadding(10);
			titleCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
			loanInfoTable.addCell(titleCell);

			Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
			PdfPTable leftTable = new PdfPTable(2);
			leftTable.setWidthPercentage(100);
			leftTable.setWidths(new float[] { 3, 5 });

			leftTable.addCell(getCell("LAN Number", smallFont));
			leftTable.addCell(getCell(": " + loanApplicantDetails.getLoanAccountNumber(), smallFont));
			String data = loanApplicantDetails.getData();

			/*ObjectMapper objectMapper = new ObjectMapper();
			JsonNode rootNode = objectMapper.readTree(data);


			JsonNode personalDataNode = rootNode.path("personalData");

			// Extract "addressInfo" node
			JsonNode addressInfoNode = personalDataNode.path("addressInfo");*/

			// Step 1: Parse the outer JSON
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode outerNode = objectMapper.readTree(data);

// Step 2: Extract and parse the "updated" string
			String updatedJsonString = outerNode.path("updated").asText();
			JsonNode rootNode = objectMapper.readTree(updatedJsonString);

// Step 3: Now access inner fields
			JsonNode personalDataNode = rootNode.path("personalData");
			JsonNode addressInfoNode = personalDataNode.path("addressInfo");
			String zip = addressInfoNode.path("zip").asText();
			String city = addressInfoNode.path("city").asText();
			String state = addressInfoNode.path("state").asText();
			String streetLine1 = addressInfoNode.path("streetLine1").asText();
			String streetLine2 = addressInfoNode.path("streetLine2").asText();
			int yearsAtAddress = addressInfoNode.path("yearsAtAddress").asInt();

			String address = streetLine1.concat(streetLine2);

			leftTable.addCell(getCell("Name", smallFont));
			leftTable.addCell(getCell(": " + loanApplicantDetails.getApplicantName(), smallFont));
			leftTable.addCell(getCell("Address", smallFont));
			leftTable.addCell(getCell(": " + address, smallFont));
			leftTable.addCell(getCell("City", smallFont));
			leftTable.addCell(getCell(": " + city, smallFont));
			leftTable.addCell(getCell("State", smallFont));
			leftTable.addCell(getCell(": " + state, smallFont));

			PdfPTable rightTable = new PdfPTable(2);
			rightTable.setWidthPercentage(100);
			rightTable.setWidths(new float[] { 3, 5 });

			rightTable.addCell(getCell("Loan Amount", smallFont));
			rightTable.addCell(getCell(": " + loanApplicantDetails.getLoanAmount(), smallFont));
//            rightTable.addCell(getCell("No Of Advanced EMI", smallFont));
//            rightTable.addCell(getCell(": " + loanApplicantDetails.getTenure(), smallFont));
//            rightTable.addCell(getCell("Installment", smallFont));
//            rightTable.addCell(getCell(": " + loanApplicantDetails.getInstallmentAmount(), smallFont));
			rightTable.addCell(getCell("Loan Type", smallFont));
			rightTable.addCell(getCell(": " + loanApplicantDetails.getLoanType(), smallFont));
			rightTable.addCell(getCell("Start Date", smallFont));
			rightTable.addCell(getCell(": " + loanApplicantDetails.getCreatedDate(), smallFont));

			PdfPCell leftColumn = new PdfPCell(leftTable);
			leftColumn.setPadding(5);
			PdfPCell rightColumn = new PdfPCell(rightTable);
			rightColumn.setPadding(5);

			loanInfoTable.addCell(leftColumn);
			loanInfoTable.addCell(rightColumn);

			PdfPCell emptyCell = new PdfPCell(new Phrase(" "));
			PdfPCell principalCell = new PdfPCell(
					new Phrase("Principal Amount (less) Adv. EMIs: Rs " + loanApplicantDetails.getLoanAmount(),
							FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9)));
			principalCell.setHorizontalAlignment(Element.ALIGN_LEFT);
			principalCell.setPadding(5);

			loanInfoTable.addCell(emptyCell);
			loanInfoTable.addCell(principalCell);
			document.add(loanInfoTable);
			document.add(new Paragraph(" "));

			// Table for repayment schedule
			PdfPTable table = new PdfPTable(6);
			table.setWidthPercentage(100);
			table.setWidths(new int[] { 2, 3, 3, 3, 3, 3 });

			Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9);
			table.addCell(new PdfPCell(new Phrase("Installment No", smallFont)));
			table.addCell(new PdfPCell(new Phrase("Date", smallFont)));
			table.addCell(new PdfPCell(new Phrase("Amount", smallFont)));
			table.addCell(new PdfPCell(new Phrase("Principal", smallFont)));
			table.addCell(new PdfPCell(new Phrase("Interest", smallFont)));
			table.addCell(new PdfPCell(new Phrase("Closing Principal", smallFont)));
			for (RepaymentSchedule schedule : schedules) {
				table.addCell(new PdfPCell(new Phrase(String.valueOf(schedule.getInstallmentNo()), smallFont)));
				table.addCell(new PdfPCell(new Phrase(schedule.getInstallmentDate().toString(), smallFont)));
				table.addCell(
						new PdfPCell(new Phrase(String.format("%.2f", schedule.getInstallmentAmount()), smallFont)));
				table.addCell(new PdfPCell(new Phrase(String.format("%.2f", schedule.getPrincipal()), smallFont)));
				table.addCell(new PdfPCell(new Phrase(String.format("%.2f", schedule.getInterest()), smallFont)));
				table.addCell(
						new PdfPCell(new Phrase(String.format("%.2f", schedule.getClosingPrincipal()), smallFont)));
			}
//            for (RepaymentSchedule schedule : schedules) {
//                table.addCell(String.valueOf(schedule.getInstallmentNo()));
//                table.addCell(schedule.getInstallmentDate().toString());
//                table.addCell(String.format("%.2f", schedule.getInstallmentAmount()));
//                table.addCell(String.format("%.2f", schedule.getPrincipal()));
//                table.addCell(String.format("%.2f", schedule.getInterest()));
//                table.addCell(String.format("%.2f", schedule.getClosingPrincipal()));
//            }

			document.add(table);
			document.close();
		} catch (DocumentException e) {
			e.printStackTrace();
		}
		return out.toByteArray();
	}

}
