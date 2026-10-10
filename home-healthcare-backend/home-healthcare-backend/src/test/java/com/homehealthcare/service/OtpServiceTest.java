package com.homehealthcare.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OtpServiceTest {

    private ResendEmailService emailService;
    private OtpService otpService;

    @BeforeEach
    void setUp() {
        emailService = mock(ResendEmailService.class);
        otpService = new OtpService(emailService);
    }

    @Test
    void sendsSixDigitOtpAndVerifiesItOnce() {
        String email = "patient@example.com";

        otpService.sendOtp(email);

        ArgumentCaptor<String> recipientCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> subjectCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> textCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).send(
                recipientCaptor.capture(),
                subjectCaptor.capture(),
                textCaptor.capture()
        );

        Matcher matcher = Pattern.compile("\\b\\d{6}\\b")
                .matcher(textCaptor.getValue());
        assertTrue(matcher.find());
        String otp = matcher.group();

        assertEquals(email, recipientCaptor.getValue());
        assertEquals("CareNest Email Verification OTP", subjectCaptor.getValue());
        assertTrue(otpService.verifyOtp(email, otp));
        assertFalse(otpService.verifyOtp(email, otp));
    }

    @Test
    void doesNotStoreOtpWhenEmailSendingFails() {
        String email = "patient@example.com";
        doThrow(new IllegalStateException("Email API unavailable"))
                .when(emailService)
                .send(anyString(), anyString(), anyString());

        assertThrows(IllegalStateException.class, () -> otpService.sendOtp(email));
        assertFalse(otpService.verifyOtp(email, "123456"));
    }
}
