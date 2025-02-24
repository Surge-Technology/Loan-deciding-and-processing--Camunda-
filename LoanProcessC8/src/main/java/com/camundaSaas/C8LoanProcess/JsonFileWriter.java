package com.camundaSaas.C8LoanProcess;
 
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
 
import io.camunda.tasklist.dto.Task;
 
import java.io.File;
import java.io.IOException;
import java.util.List;
 
public class JsonFileWriter {
 
    public static void writeTasksToJsonFile(List<Task> tasks) {
    	String filePath = "D:\\migrationloan\\LoanProcessC8\\src\\jsonFile\\assigned_tasks.json";
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT); 
 
        try {
            objectMapper.writeValue(new File(filePath), tasks);
            System.out.println("JSON file created successfully: " + filePath);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error writing JSON file.");
        }
    }
}