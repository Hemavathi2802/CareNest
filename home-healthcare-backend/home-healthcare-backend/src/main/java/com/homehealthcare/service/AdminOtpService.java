package com.homehealthcare.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class AdminOtpService {

    public static final String ADMIN_EMAIL = "hemavathisb28@gmail.com";

    private static final long OTP_LIFETIME_SECONDS = 5 * 60;
    private static final long SESSION_LIFETIME_SECONDS = 8 * 60 * 60;
    private static final int MAX_OTP_ATTEMPTS = 5;

    private final ResendEmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, OtpEntry> challenges = new ConcurrentHashMap<>();
    private final Map<String, Instant> adminSessions = new ConcurrentHashMap<>();

    public AdminOtpService(ResendEmailService emailService) {
        this.emailService = emailService;
    }

    public String startChallenge() {
        String challengeId = UUID.randomUUID().toString();
        String otp = generateOtp(null);
        challenges.put(
                challengeId,
                new OtpEntry(otp, Instant.now().plusSeconds(OTP_LIFETIME_SECONDS), 0)
        );
        return challengeId;
    }

    public void sendChallenge(String challengeId) {
        OtpEntry current = challenges.get(challengeId);
        if (current == null) {
            throw new IllegalArgumentException("OTP challenge not found. Please log in again.");
        }

        sendOtp(current.otp());
        challenges.replace(
                challengeId,
                current,
                new OtpEntry(
                        current.otp(),
                        Instant.now().plusSeconds(OTP_LIFETIME_SECONDS),
                        current.attempts()
                )
        );
    }

    public void resend(String challengeId) {
        OtpEntry current = challenges.get(challengeId);
        if (current == null) {
            throw new IllegalArgumentException("OTP challenge not found. Please log in again.");
        }

        String otp = generateOtp(current.otp());
        sendOtp(otp);
        challenges.replace(
                challengeId,
                current,
                new OtpEntry(otp, Instant.now().plusSeconds(OTP_LIFETIME_SECONDS), 0)
        );
    }

    public VerificationResult verify(String challengeId, String enteredOtp) {
        AtomicReference<VerificationStatus> status = new AtomicReference<>();
        challenges.compute(challengeId, (id, entry) -> {
            if (entry == null) {
                status.set(VerificationStatus.NOT_FOUND);
                return null;
            }

            if (!Instant.now().isBefore(entry.expiresAt())) {
                status.set(VerificationStatus.EXPIRED);
                return entry;
            }

            if (enteredOtp == null || !entry.otp().equals(enteredOtp)) {
                if (entry.attempts() + 1 >= MAX_OTP_ATTEMPTS) {
                    status.set(VerificationStatus.LOCKED);
                    return null;
                }

                status.set(VerificationStatus.INCORRECT);
                return new OtpEntry(entry.otp(), entry.expiresAt(), entry.attempts() + 1);
            }

            status.set(VerificationStatus.VERIFIED);
            return null;
        });

        if (status.get() != VerificationStatus.VERIFIED) {
            return new VerificationResult(status.get(), null);
        }

        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        String accessToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(tokenBytes);
        adminSessions.put(
                accessToken,
                Instant.now().plusSeconds(SESSION_LIFETIME_SECONDS)
        );

        return new VerificationResult(VerificationStatus.VERIFIED, accessToken);
    }

    public boolean isValidSession(String accessToken) {
        if (accessToken == null || accessToken.isBlank()) {
            return false;
        }

        Instant expiresAt = adminSessions.get(accessToken);
        if (expiresAt == null) {
            return false;
        }

        if (!Instant.now().isBefore(expiresAt)) {
            adminSessions.remove(accessToken, expiresAt);
            return false;
        }

        return true;
    }

    private String generateOtp(String previousOtp) {
        String otp;
        do {
            otp = String.format("%06d", secureRandom.nextInt(1_000_000));
        } while (otp.equals(previousOtp));
        return otp;
    }

    private void sendOtp(String otp) {
        emailService.send(
                ADMIN_EMAIL,
                "CareNest Admin Login OTP",
                "Your CareNest admin login OTP is: " + otp
                        + "\n\nThis OTP is valid for 5 minutes."
        );
    }

    private record OtpEntry(String otp, Instant expiresAt, int attempts) {
    }

    public enum VerificationStatus {
        VERIFIED,
        INCORRECT,
        LOCKED,
        EXPIRED,
        NOT_FOUND
    }

    public record VerificationResult(
            VerificationStatus status,
            String accessToken) {
    }
}
