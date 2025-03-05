package com.camundaSaas.C8LoanProcess.model;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "repayment_schedule")
public class RepaymentSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long repaymentScheduleId;

    private Integer installmentNo;

    private LocalDate installmentDate;

    private Double installmentAmount;

    private Double principal;

    private Double interest;

    private Double closingPrincipal;

    @Column(nullable = false)
    private String loanAccountNumber;

    public Long getRepaymentScheduleId() {
        return repaymentScheduleId;
    }

    public void setRepaymentScheduleId(Long repaymentScheduleId) {
        this.repaymentScheduleId = repaymentScheduleId;
    }

    public Integer getInstallmentNo() {
        return installmentNo;
    }

    public void setInstallmentNo(Integer installmentNo) {
        this.installmentNo = installmentNo;
    }

    public LocalDate getInstallmentDate() {
        return installmentDate;
    }

    public void setInstallmentDate(LocalDate installmentDate) {
        this.installmentDate = installmentDate;
    }

    public Double getInstallmentAmount() {
        return installmentAmount;
    }

    public void setInstallmentAmount(Double installmentAmount) {
        this.installmentAmount = installmentAmount;
    }

    public Double getPrincipal() {
        return principal;
    }

    public void setPrincipal(Double principal) {
        this.principal = principal;
    }

    public Double getInterest() {
        return interest;
    }

    public void setInterest(Double interest) {
        this.interest = interest;
    }

    public Double getClosingPrincipal() {
        return closingPrincipal;
    }

    public void setClosingPrincipal(Double closingPrincipal) {
        this.closingPrincipal = closingPrincipal;
    }

    public String getLoanAccountNumber() {
        return loanAccountNumber;
    }

    public void setLoanAccountNumber(String loanAccountNumber) {
        this.loanAccountNumber = loanAccountNumber;
    }
}
