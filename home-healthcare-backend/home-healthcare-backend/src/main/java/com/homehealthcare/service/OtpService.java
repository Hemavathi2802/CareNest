
package com.homehealthcare.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final BrevoEmailService emailService;
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    public OtpService(BrevoEmailService emailService) {
        this.emailService = emailService;
    }

    public void sendOtp(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        String otp = String.format("%06d", secureRandom.nextInt(1000000));
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

        emailService.send(
                normalizedEmail,
                "CareNest Email Verification OTP",
                "Hello,\n\n" +
                "Your CareNest verification OTP is: " + otp + "\n\n" +
                "This OTP is valid for 5 minutes.\n\n" +
                "Do not share this OTP with anyone.\n\n" +
                "Regards,\nCareNest Team"
        );

        otpStorage.put(normalizedEmail, new OtpData(otp, expiryTime));
    }

    public boolean verifyOtp(String email, String enteredOtp) {
        String normalizedEmail = email.trim().toLowerCase();
        OtpData otpData = otpStorage.get(normalizedEmail);

        if (otpData == null) {
            return false;
        }

        if (LocalDateTime.now().isAfter(otpData.expiryTime())) {
            otpStorage.remove(normalizedEmail);
            return false;
        }

        if (!otpData.otp().equals(enteredOtp)) {
            return false;
        }

        otpStorage.remove(normalizedEmail);
        return true;
    }

    private record OtpData(String otp, LocalDateTime expiryTime) {
    }
}
