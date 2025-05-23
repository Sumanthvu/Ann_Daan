package com.anndaan.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        try {
            // For testing - just log the OTP to console
            System.out.println("=================================");
            System.out.println("OTP for " + to + ": " + otp);
            System.out.println("=================================");
            
            // Uncomment below code when you have proper email configuration
            /*
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setTo(to);
            helper.setSubject("Your OTP for Ann Daan");
            
            String emailContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;'>"
                    + "<h2 style='color: #4caf50; text-align: center;'>Ann Daan Authentication</h2>"
                    + "<p style='font-size: 16px; line-height: 1.5;'>Hello,</p>"
                    + "<p style='font-size: 16px; line-height: 1.5;'>Your One-Time Password (OTP) for Ann Daan is:</p>"
                    + "<div style='text-align: center; margin: 30px 0;'>"
                    + "<div style='font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background-color: #f5f5f5; padding: 15px; border-radius: 5px;'>" + otp + "</div>"
                    + "</div>"
                    + "<p style='font-size: 16px; line-height: 1.5;'>This OTP is valid for 10 minutes. Please do not share this OTP with anyone.</p>"
                    + "<p style='font-size: 16px; line-height: 1.5;'>If you did not request this OTP, please ignore this email.</p>"
                    + "<p style='font-size: 16px; line-height: 1.5; margin-top: 30px;'>Regards,<br>Ann Daan Team</p>"
                    + "</div>";
            
            helper.setText(emailContent, true);
            
            mailSender.send(message);
            */
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // For testing, we'll just log the error but not throw exception
            // throw new RuntimeException("Failed to send email", e);
        }
    }
}
