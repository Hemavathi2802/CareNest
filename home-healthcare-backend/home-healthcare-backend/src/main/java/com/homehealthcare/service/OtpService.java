package com.homehealthcare.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final JavaMailSender mailSender;

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    private final SecureRandom secureRandom = new SecureRandom();

    public OtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String email) {
        String otp = String.format("%06d", secureRandom.nextInt(1000000));

        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

        otpStorage.put(email, new OtpData(otp, expiryTime));

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("CareNest Email Verification OTP");
        message.setText(
                "Hello,\n\n" +
                "Your CareNest verification OTP is: " + otp + "\n\n" +
                "This OTP is valid for 5 minutes.\n\n" +
                "Do not share this OTP with anyone.\n\n" +
                "Regards,\n" +
                "CareNest Team"
        );

        mailSender.send(message);
    }

    public boolean verifyOtp(String email, String enteredOtp) {
        OtpData otpData = otpStorage.get(email);

        if (otpData == null) {
            return false;
        }

        if (LocalDateTime.now().isAfter(otpData.expiryTime())) {
            otpStorage.remove(email);
            return false;
        }

        if (!otpData.otp().equals(enteredOtp)) {
            return false;
        }

        otpStorage.remove(email);

        return true;
    }

    private record OtpData(String otp, LocalDateTime expiryTime) {
    }
}