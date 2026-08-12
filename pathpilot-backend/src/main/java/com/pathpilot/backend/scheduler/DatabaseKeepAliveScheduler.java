package com.pathpilot.backend.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Component
@Slf4j
public class DatabaseKeepAliveScheduler {

    private final JdbcTemplate jdbcTemplate;
    private final HttpClient httpClient;
    private final String aiServiceUrl;

    public DatabaseKeepAliveScheduler(JdbcTemplate jdbcTemplate, @Value("${ai.service.url}") String aiServiceUrl) {
        this.jdbcTemplate = jdbcTemplate;
        this.aiServiceUrl = aiServiceUrl;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    // Run every 4 minutes (240,000 milliseconds) to prevent database and AI service sleep
    @Scheduled(fixedDelay = 240000)
    public void keepServicesAlive() {
        // 1. Keep Neon DB Warm
        try {
            jdbcTemplate.execute("SELECT 1");
            log.info("Neon database keep-alive connection ping successful.");
        } catch (Exception e) {
            log.error("Failed to ping database for keep-alive: {}", e.getMessage());
        }

        // 2. Keep FastAPI AI Service on Render Warm
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(aiServiceUrl + "/docs"))
                    .GET()
                    .timeout(Duration.ofSeconds(10))
                    .build();
            
            log.info("Sending keep-alive ping to FastAPI AI service: {}/docs", aiServiceUrl);
            httpClient.sendAsync(request, HttpResponse.BodyHandlers.discarding())
                    .thenAccept(response -> {
                        if (response.statusCode() == 200) {
                            log.info("FastAPI AI service keep-alive ping successful (Status: 200).");
                        } else {
                            log.warn("FastAPI AI service keep-alive ping returned status: {}", response.statusCode());
                        }
                    })
                    .exceptionally(ex -> {
                        log.error("Failed to async ping FastAPI AI service: {}", ex.getMessage());
                        return null;
                    });
        } catch (Exception e) {
            log.error("Error initiating FastAPI keep-alive: {}", e.getMessage());
        }
    }
}
