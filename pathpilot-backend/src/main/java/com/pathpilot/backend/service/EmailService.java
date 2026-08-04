package com.pathpilot.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendVerificationEmail(String toEmail, String code) {
        log.info("--------------------------------------------------");
        log.info("VERIFICATION CODE FOR {}: {}", toEmail, code);
        log.info("--------------------------------------------------");
        
        if (fromEmail == null || fromEmail.isBlank()) {
            log.warn("SMTP email username is not configured. Skipping sending actual email.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("PathPilot.AI - Verify Your Account");
            message.setText("Welcome to PathPilot.AI!\n\n" +
                    "Your verification code is: " + code + "\n\n" +
                    "This code will expire in 15 minutes.\n\n" +
                    "Best regards,\n" +
                    "The PathPilot.AI Team");
            mailSender.send(message);
            log.info("Verification email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", toEmail, e.getMessage());
        }
    }
}
