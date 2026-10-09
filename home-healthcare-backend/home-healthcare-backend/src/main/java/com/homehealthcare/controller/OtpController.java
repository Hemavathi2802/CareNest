package com.homehealthcare.controller;

import com.homehealthcare.service.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class OtpController {

    private final OtpService otpService;

    public OtpController(OtpService otpService) {
        this.otpService = otpService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        try {
            otpService.sendOtp(email);

            return ResponseEntity.ok("OTP sent successfully to your email");
        } catch (Exception exception) {
            return ResponseEntity.internalServerError()
                    .body("Failed to send OTP: " + exception.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(
            @RequestParam String email,
            @RequestParam String otp
    ) {
        boolean verified = otpService.verifyOtp(email, otp);

        if (verified) {
            return ResponseEntity.ok("OTP verified successfully");
        }

        return ResponseEntity.badRequest()
                .body("Invalid or expired OTP");
    }
}