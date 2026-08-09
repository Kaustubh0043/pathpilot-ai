package com.pathpilot.backend.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseKeepAliveScheduler {

    private final JdbcTemplate jdbcTemplate;

    // Run every 4 minutes (240,000 milliseconds) to prevent Neon DB compute sleep
    @Scheduled(fixedDelay = 240000)
    public void keepDatabaseAlive() {
        try {
            jdbcTemplate.execute("SELECT 1");
            log.info("Neon database keep-alive connection ping successful.");
        } catch (Exception e) {
            log.error("Failed to ping database for keep-alive: {}", e.getMessage());
        }
    }
}
