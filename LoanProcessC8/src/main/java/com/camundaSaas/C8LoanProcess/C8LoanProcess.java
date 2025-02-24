package com.camundaSaas.C8LoanProcess;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.camunda.zeebe.spring.client.EnableZeebeClient;

@SpringBootApplication
@EnableZeebeClient
public class C8LoanProcess {

	public static void main(String[] args) {
		SpringApplication.run(C8LoanProcess.class, args);
	}

}
