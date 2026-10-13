
package com.homehealthcare.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OtpServiceTest {

    private BrevoEmailService emailService;
    private OtpService otpService;

    @BeforeEach
    void setUp() {
        emailService = mock(BrevoEmailService.class);
        otpService = new OtpService(emailService);
    }

    @Test
    void sendsSixDigitOtpToEmail() {
        String email = "test@example.com";

        otpService.sendOtp(email);

        ArgumentCaptor<String> recipientCaptor =
                ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> subjectCaptor =
                ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> messageCaptor =
                ArgumentCaptor.forClass(String.class);

        verify(emailService).send(
                recipientCaptor.capture(),
                subjectCaptor.capture(),
                messageCaptor.capture()
        );

        assertEquals(email, recipientCaptor.getValue());
        assertEquals(
                "CareNest Email Verification OTP",
                subjectCaptor.getValue()
        );

        Matcher matcher = Pattern.compile("\\b\\d{6}\\b")
                .matcher(messageCaptor.getValue());

        assertTrue(matcher.find(), "Email should contain a 6-digit OTP.");
    }

    @Test
    void verifiesCorrectOtp() {
        String email = "test@example.com";

        otpService.sendOtp(email);

        ArgumentCaptor<String> messageCaptor =
                ArgumentCaptor.forClass(String.class);

        verify(emailService).send(
                eq(email),
                eq("CareNest Email Verification OTP"),
                messageCaptor.capture()
        );

        Matcher matcher = Pattern.compile("\\b\\d{6}\\b")
                .matcher(messageCaptor.getValue());

        assertTrue(matcher.find());

        String otp = matcher.group();

        assertTrue(otpService.verifyOtp(email, otp));
    }

    @Test
    void rejectsIncorrectOtp() {
        String email = "test@example.com";

        otpService.sendOtp(email);

        assertFalse(otpService.verifyOtp(email, "wrong"));
    }

    @Test
    void rejectsOtpAfterSuccessfulVerification() {
        String email = "test@example.com";

        otpService.sendOtp(email);

        ArgumentCaptor<String> messageCaptor =
                ArgumentCaptor.forClass(String.class);

        verify(emailService).send(
                eq(email),
                eq("CareNest Email Verification OTP"),
                messageCaptor.capture()
        );

        Matcher matcher = Pattern.compile("\\b\\d{6}\\b")
                .matcher(messageCaptor.getValue());

        assertTrue(matcher.find());

        String otp = matcher.group();

        assertTrue(otpService.verifyOtp(email, otp));
        assertFalse(otpService.verifyOtp(email, otp));
    }

    @Test
    void verifiesEmailIgnoringCase() {
        String email = "test@example.com";

        otpService.sendOtp(email);

        ArgumentCaptor<String> messageCaptor =
                ArgumentCaptor.forClass(String.class);

        verify(emailService).send(
                eq(email),
                eq("CareNest Email Verification OTP"),
                messageCaptor.capture()
        );

        Matcher matcher = Pattern.compile("\\b\\d{6}\\b")
                .matcher(messageCaptor.getValue());

        assertTrue(matcher.find());

        String otp = matcher.group();

        assertTrue(otpService.verifyOtp("TEST@example.com", otp));
    }
}