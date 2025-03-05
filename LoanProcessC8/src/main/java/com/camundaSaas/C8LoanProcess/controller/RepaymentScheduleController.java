package com.camundaSaas.C8LoanProcess.controller;

import com.camundaSaas.C8LoanProcess.model.RepaymentSchedule;
import com.camundaSaas.C8LoanProcess.service.RepaymentScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RepaymentScheduleController {

    @Autowired
    private RepaymentScheduleService repaymentScheduleService;

    @PostMapping("/repaymentSchedule/save")
    public ResponseEntity<RepaymentSchedule> save(@RequestBody RepaymentSchedule repaymentSchedule){

        RepaymentSchedule repaymentScheduleCreated = repaymentScheduleService.saveRepaymentSchedule(repaymentSchedule);
        return ResponseEntity.status(HttpStatus.OK).body(repaymentScheduleCreated);
    }

    @GetMapping("/repaymentSchedule/loanAccountNumber/{loanAccountNumber}")
    public ResponseEntity<List<RepaymentSchedule>> getRepaymentScheduleByLoanAccountNumber(@PathVariable String loanAccountNumber) {
        List<RepaymentSchedule> schedules = repaymentScheduleService.getRepaymentScheduleByLoanAccountNumber(loanAccountNumber);

        if (schedules.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(schedules, HttpStatus.OK);
    }

}
