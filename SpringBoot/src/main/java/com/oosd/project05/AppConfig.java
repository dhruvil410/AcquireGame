package com.oosd.project05;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.google.gson.Gson;
@Configuration
public class AppConfig {

    @Bean
    public Gson gson() {
        return new Gson();
    }
}
