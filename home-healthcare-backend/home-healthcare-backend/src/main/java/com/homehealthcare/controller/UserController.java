
package com.homehealthcare.controller;

import com.homehealthcare.entity.User;
import com.homehealthcare.service.AdminOtpService;
import com.homehealthcare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminOtpService adminOtpService;

    @GetMapping("/test")
    public String test() {

        return "User Controller Working";
    }

    @PostMapping("/register")
    public User register(
            @RequestBody User user) {

        return userService.register(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestParam String email,
            @RequestParam String password) {

        if (userService.isAdminCredentials(email, password)) {
            String challengeId = userService.startAdminLogin();
            return ResponseEntity.ok(
                    new AdminOtpChallengeResponse("ADMIN", true, challengeId)
            );
        }

        return ResponseEntity.ok(userService.login(email, password));
    }

    @PostMapping("/admin/otp/verify")
    public ResponseEntity<?> verifyAdminOtp(
            @RequestParam String challengeId,
            @RequestParam String otp) {
        if (!otp.matches("\\d{6}")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Enter a valid 6-digit OTP."));
        }

        AdminOtpService.VerificationResult result =
                adminOtpService.verify(challengeId, otp);

        return switch (result.status()) {
            case VERIFIED -> ResponseEntity.ok(
                    new AdminLoginResponse("ADMIN", result.accessToken())
            );
            case INCORRECT -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "The OTP is incorrect. Please try again."));
            case LOCKED -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Too many incorrect OTP attempts. Request a new OTP."));
            case EXPIRED -> ResponseEntity.status(HttpStatus.GONE)
                    .body(Map.of("message", "The OTP has expired. Resend a new OTP."));
            case NOT_FOUND -> ResponseEntity.badRequest()
                    .body(Map.of("message", "This OTP request is no longer valid. Please log in again."));
        };
    }

    @PostMapping("/admin/otp/send")
    public ResponseEntity<?> sendAdminOtp(
            @RequestParam String challengeId) {
        try {
            adminOtpService.sendChallenge(challengeId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", exception.getMessage()));
        } catch (MailException exception) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("message", "Unable to send the OTP email. Please try again."));
        }
    }

    @PostMapping("/admin/otp/resend")
    public ResponseEntity<?> resendAdminOtp(
            @RequestParam String challengeId) {
        try {
            adminOtpService.resend(challengeId);
            return ResponseEntity.ok(
                    Map.of("message", "A new OTP was sent to the admin email address.")
            );
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", exception.getMessage()));
        }
    }

    @GetMapping("/admin/session")
    public ResponseEntity<Void> validateAdminSession(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String accessToken = authorization.substring("Bearer ".length());
        if (!adminOtpService.isValidSession(accessToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{userId}/role")
    public User updateRole(
            @PathVariable Long userId,
            @RequestBody User user) {

        return userService.updateRole(
                userId,
                user.getRole()
        );
    }

    @GetMapping("/{userId}")
    public User getUserById(
            @PathVariable Long userId) {

        return userService.getUserById(userId);
    }

    @PutMapping("/{userId}")
    public User updateUserProfile(
            @PathVariable Long userId,
            @RequestBody User user) {

        return userService.updateUserProfile(
                userId,
                user
        );
    }

    @GetMapping("/nurses")
    public List<User> getNurses() {

        return userService.getNurses();
    }

    public record AdminOtpChallengeResponse(
            String role,
            boolean otpRequired,
            String challengeId) {
    }

    public record AdminLoginResponse(String role, String accessToken) {
    }
}