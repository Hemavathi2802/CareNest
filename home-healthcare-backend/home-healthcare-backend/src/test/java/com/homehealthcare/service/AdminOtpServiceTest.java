package com.homehealthcare.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminOtpServiceTest {

    private JavaMailSender mailSender;
    private AdminOtpService adminOtpService;

    @BeforeEach
    void setUp() {
        mailSender = mock(JavaMailSender.class);
        adminOtpService = new AdminOtpService(mailSender);
    }

    @Test
    void sendsSixDigitOtpAndCreatesSessionOnlyAfterVerification() {
        String challengeId = adminOtpService.startChallenge();
        verify(mailSender, never()).send(any(SimpleMailMessage.class));
        adminOtpService.sendChallenge(challengeId);
        SimpleMailMessage message = captureLastMessage();
        String otp = findOtp(message);

        assertArrayEquals(new String[]{AdminOtpService.ADMIN_EMAIL}, message.getTo());
        assertEquals(6, otp.length());
        assertNull(adminOtpService.verify(challengeId, "wrong!").accessToken());

        AdminOtpService.VerificationResult result =
                adminOtpService.verify(challengeId, otp);

        assertEquals(AdminOtpService.VerificationStatus.VERIFIED, result.status());
        assertNotNull(result.accessToken());
        assertTrue(adminOtpService.isValidSession(result.accessToken()));
    }

    @Test
    void resendInvalidatesThePreviousOtp() {
        String challengeId = adminOtpService.startChallenge();
        adminOtpService.sendChallenge(challengeId);
        String oldOtp = findOtp(captureLastMessage());

        adminOtpService.resend(challengeId);
        String newOtp = findOtp(captureLastMessage());

        assertNotEquals(oldOtp, newOtp);
        assertEquals(
                AdminOtpService.VerificationStatus.INCORRECT,
                adminOtpService.verify(challengeId, oldOtp).status()
        );
        assertEquals(
                AdminOtpService.VerificationStatus.VERIFIED,
                adminOtpService.verify(challengeId, newOtp).status()
        );
    }

    @Test
    void invalidatesChallengeAfterFiveIncorrectAttempts() {
        String challengeId = adminOtpService.startChallenge();
        adminOtpService.sendChallenge(challengeId);
        String otp = findOtp(captureLastMessage());
        String incorrectOtp = otp.equals("000000") ? "000001" : "000000";

        for (int attempt = 0; attempt < 5; attempt++) {
            AdminOtpService.VerificationResult result =
                    adminOtpService.verify(challengeId, incorrectOtp);
            AdminOtpService.VerificationStatus expected =
                    attempt == 4
                            ? AdminOtpService.VerificationStatus.LOCKED
                            : AdminOtpService.VerificationStatus.INCORRECT;
            assertEquals(expected, result.status());
        }

        assertEquals(
                AdminOtpService.VerificationStatus.NOT_FOUND,
                adminOtpService.verify(challengeId, otp).status()
        );
    }

    private SimpleMailMessage captureLastMessage() {
        ArgumentCaptor<SimpleMailMessage> messageCaptor =
                ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender, atLeastOnce()).send(messageCaptor.capture());
        return messageCaptor.getValue();
    }

    private String findOtp(SimpleMailMessage message) {
        Matcher matcher = Pattern.compile("\\b\\d{6}\\b")
                .matcher(message.getText());
        assertTrue(matcher.find(), "The email should contain a 6-digit OTP.");
        return matcher.group();
    }
}
