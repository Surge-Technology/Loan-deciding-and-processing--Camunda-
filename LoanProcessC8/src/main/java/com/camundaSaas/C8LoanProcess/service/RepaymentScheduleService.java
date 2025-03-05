package com.camundaSaas.C8LoanProcess.service;

import com.camundaSaas.C8LoanProcess.Repository.RepaymentScheduleRepository;
import com.camundaSaas.C8LoanProcess.model.RepaymentSchedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
