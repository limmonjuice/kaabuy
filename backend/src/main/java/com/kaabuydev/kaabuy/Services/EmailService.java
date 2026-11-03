package com.kaabuydev.kaabuy.Services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendWelcomeEmail(String to, String username, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@kaabuy.com");
        message.setTo(to);
        message.setSubject("Welcome to Kaabuy - Your Login Credentials");
        message.setText("Welcome to Kaabuy!\n\n" +
                "Your account has been created. Please log in with the following credentials:\n\n" +
                "Username: " + username + "\n" +
                "Password: " + password + "\n\n" +
                "For security reasons, you will be required to change your password upon your first login.\n\n" +
                "Best regards,\nKaabuy Team");

        try {
            emailSender.send(message);
        } catch (Exception e) {
            // Log credentials to console if email fails (for development/testing)
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
            System.out.println("=== GENERATED CREDENTIALS (Email failed) ===");
            System.out.println("Email: " + to);
            System.out.println("Username: " + username);
            System.out.println("Password: " + password);
            System.out.println("=============================================");
        }
    }
}
