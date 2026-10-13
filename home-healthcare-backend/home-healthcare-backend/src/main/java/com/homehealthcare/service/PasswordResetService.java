package com.homehealthcare.service;

import com.homehealthcare.entity.User;
import com.homehealthcare.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetService {

    private static final long OTP_VALIDITY_SECONDS = 300;
    private static final int MAX_ATTEMPTS = 5;

    private final UserRepository userRepository;
    private final BrevoEmailService brevoEmailService;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();
    private final SecureRandom secureRandom = new SecureRandom();

    private final Map<String, OtpData> otpStore =
            new ConcurrentHashMap<>();

    private final Map<String, ResetGrant> verifiedStore =
            new ConcurrentHashMap<>();

    public PasswordResetService(
            UserRepository userRepository,
            BrevoEmailService brevoEmailService) {
        this.userRepository = userRepository;
        this.brevoEmailService = brevoEmailService;
    }

    public void sendOtp(String email) {
        String normalizedEmail = normalizeEmail(email);

        userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "If the email is registered, an OTP can be sent."
                        ));

        String otp = String.format("%06d", secureRandom.nextInt(1_000_000));

        otpStore.put(normalizedEmail,
                new OtpData(otp, Instant.now().plusSeconds(OTP_VALIDITY_SECONDS)));

        verifiedStore.remove(normalizedEmail);

        try {
            brevoEmailService.send(
                    normalizedEmail,
                    "CareNest Password Reset OTP",
                    "Your CareNest password reset OTP is: " + otp
                            + "\nThis OTP expires in 5 minutes."
                            + "\nIf you did not request this, ignore this email."
            );
        } catch (RuntimeException exception) {
            otpStore.remove(normalizedEmail);
            throw exception;
        }
    }

    public String verifyOtp(String email, String otp) {
        String normalizedEmail = normalizeEmail(email);

        if (otp == null || !otp.matches("\\d{6}")) {
            throw new IllegalArgumentException("Enter a valid 6-digit OTP.");
        }

        OtpData data = otpStore.get(normalizedEmail);

        if (data == null) {
            throw new IllegalArgumentException(
                    "Request a new OTP and try again.");
        }

        synchronized (data) {
            if (Instant.now().isAfter(data.expiresAt)) {
                otpStore.remove(normalizedEmail, data);
                throw new IllegalArgumentException(
                        "OTP expired. Request a new OTP.");
            }

            if (data.attempts >= MAX_ATTEMPTS) {
                otpStore.remove(normalizedEmail, data);
                throw new IllegalArgumentException(
                        "Too many attempts. Request a new OTP.");
            }

            data.attempts++;

            if (!data.otp.equals(otp)) {
                throw new IllegalArgumentException("Incorrect OTP.");
            }

            otpStore.remove(normalizedEmail, data);

            String resetToken = java.util.UUID.randomUUID().toString();
            verifiedStore.put(normalizedEmail,
                    new ResetGrant(resetToken,
                            Instant.now().plusSeconds(OTP_VALIDITY_SECONDS)));

            return resetToken;
        }
    }

    public void resetPassword(
            String email, String resetToken, String newPassword) {
        String normalizedEmail = normalizeEmail(email);

        if (newPassword == null || newPassword.length() < 8) {
            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters.");
        }

        ResetGrant grant = verifiedStore.get(normalizedEmail);

        if (grant == null
                || resetToken == null
                || !grant.token.equals(resetToken)
                || Instant.now().isAfter(grant.expiresAt)) {
            throw new IllegalArgumentException(
                    "Verify your OTP again before resetting the password.");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Email not registered."));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        verifiedStore.remove(normalizedEmail, grant);
    }

    private String normalizeEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required.");
        }

        return email.trim().toLowerCase();
    }

    private static class OtpData {
        private final String otp;
        private final Instant expiresAt;
        private int attempts;

        private OtpData(String otp, Instant expiresAt) {
            this.otp = otp;
            this.expiresAt = expiresAt;
        }
    }

    private static class ResetGrant {
        private final String token;
        private final Instant expiresAt;

        private ResetGrant(String token, Instant expiresAt) {
            this.token = token;
            this.expiresAt = expiresAt;
        }
    }
}
