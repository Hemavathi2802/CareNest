
package com.homehealthcare.controller;

import com.homehealthcare.service.PasswordResetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/password-reset")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(
            PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        try {
            passwordResetService.sendOtp(body.get("email"));
            return ResponseEntity.ok(
                    Map.of("message", "OTP sent to your registered email."));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", exception.getMessage()));
        } catch (RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(
                    Map.of("message", "Unable to send OTP. Check email service configuration."));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        try {
            String token = passwordResetService.verifyOtp(
                    body.get("email"), body.get("otp"));
            return ResponseEntity.ok(Map.of(
                    "message", "OTP verified.",
                    "resetToken", token));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", exception.getMessage()));
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        try {
            passwordResetService.resetPassword(
                    body.get("email"),
                    body.get("resetToken"),
                    body.get("newPassword"));
            return ResponseEntity.ok(
                    Map.of("message", "Password reset successfully."));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", exception.getMessage()));
        }
    }
}
