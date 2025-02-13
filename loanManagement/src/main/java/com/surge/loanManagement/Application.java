package com.surge.loanManagement;

import org.camunda.bpm.client.ExternalTaskClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {

  public static void main(String... args) {
    SpringApplication.run(Application.class, args);
  }
	@Bean
	public ExternalTaskClient externalTaskClient() {
	    return ExternalTaskClient.create()
	        .baseUrl("http://localhost:8080/engine-rest")
	        .build();
	}
}