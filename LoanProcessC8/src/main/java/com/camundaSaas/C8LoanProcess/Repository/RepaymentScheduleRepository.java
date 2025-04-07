package com.camundaSaas.C8LoanProcess.Repository;

import com.camundaSaas.C8LoanProcess.model.RepaymentSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepaymentScheduleRepository extends JpaRepository<RepaymentSchedule, Long> {

    List<RepaymentSchedule> findByLoanAccountNumber(String loanAccountNumber);
    void deleteAllByLoanAccountNumber(String loanAccountNumber);
    
}
