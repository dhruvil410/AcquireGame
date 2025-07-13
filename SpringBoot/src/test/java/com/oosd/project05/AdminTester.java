package com.oosd.project05;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import com.oosd.project05.CommandProcessorServiceImpl;

import java.io.FileReader;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.assertEquals;

@EnableAutoConfiguration(exclude={DataSourceAutoConfiguration.class})
@SpringBootTest
public class AdminTester {

    @Autowired
    private CommandProcessorServiceImpl commandProcessorService;

    @BeforeEach
    public void setUp() {
        // Instantiate the CommandProcessor class
        commandProcessorService = new CommandProcessorServiceImpl(new Gson());
    }


    public void runTests(String inputFileName, String outputFileName) {
        Gson gson = new Gson();
        try (FileReader inputFileReader = new FileReader(inputFileName);
             FileReader outputFileReader = new FileReader(outputFileName)) {

            JsonObject inputJson = JsonParser.parseReader(inputFileReader).getAsJsonObject();
            JsonObject expectedOutputJson = JsonParser.parseReader(outputFileReader).getAsJsonObject();

            String requestType = inputJson.get("request").getAsString();
            String actualOutput;
            switch (requestType) {
                case "setup":
                    actualOutput = commandProcessorService.executeSetup(inputJson.toString());
                    break;
                case "place":
                    actualOutput = commandProcessorService.executePlace(inputJson.toString());
                    break;
                case "buy":
                    actualOutput = commandProcessorService.executeBuy(inputJson.toString());
                    break;
                case "done":
                    actualOutput = commandProcessorService.executeDone(inputJson.toString());
                    break;
                default:
                    actualOutput = "Invalid request type";
            }

            assertEquals(expectedOutputJson, gson.fromJson(actualOutput, JsonObject.class));

        }catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void runTest1() {
        runTests("src/test/java/com/oosd/project05/state-tests/in0.json", "src/test/java/com/oosd/project05/state-tests/out0.json");
    }

    @Test
    public void runTest2(){
        runTests("src/test/java/com/oosd/project05/state-tests/in1.json", "src/test/java/com/oosd/project05/state-tests/out1.json");
    }

    @Test
    public void runTest3(){
        runTests("src/test/java/com/oosd/project05/state-tests/in2.json", "src/test/java/com/oosd/project05/state-tests/out2.json");
    }


}
