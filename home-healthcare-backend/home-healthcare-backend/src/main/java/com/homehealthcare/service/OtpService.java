package com.homehealthcare.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final ResendEmailService emailService;

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    private final SecureRandom secureRandom = new SecureRandom();

    public OtpService(ResendEmailService emailService) {
        this.emailService = emailService;
    }

    public void sendOtp(String email) {
        String otp = String.format("%06d", secureRandom.nextInt(1000000));

        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

        emailService.send(
                email,
                "CareNest Email Verification OTP",
                "Hello,\n\n" +
                "Your CareNest verification OTP is: " + otp + "\n\n" +
                "This OTP is valid for 5 minutes.\n\n" +
                "Do not share this OTP with anyone.\n\n" +
                "Regards,\n" +
                "CareNest Team"
        );

        otpStorage.put(email, new OtpData(otp, expiryTime));
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