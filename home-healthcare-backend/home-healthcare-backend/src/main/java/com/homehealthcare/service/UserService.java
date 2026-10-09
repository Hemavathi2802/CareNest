
package com.homehealthcare.service;

import com.homehealthcare.entity.User;
import com.homehealthcare.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private static final String ADMIN_PASSWORD = "Hemav@2802";

    private final UserRepository userRepository;
    private final AdminOtpService adminOtpService;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserService(
            UserRepository userRepository,
            AdminOtpService adminOtpService) {
        this.userRepository = userRepository;
        this.adminOtpService = adminOtpService;
    }

    public boolean isAdminCredentials(String email, String password) {
        return email != null
                && password != null
                && AdminOtpService.ADMIN_EMAIL.equalsIgnoreCase(email.trim())
                && ADMIN_PASSWORD.equals(password);
    }

    public String startAdminLogin() {
        return adminOtpService.startChallenge();
    }

    public User register(User user) {

        if (user == null) {
            throw new RuntimeException("User details are required");
        }

        if (user.getName() == null ||
                user.getName().trim().isEmpty()) {

            throw new RuntimeException("Name is required");
        }

        if (user.getEmail() == null ||
                user.getEmail().trim().isEmpty()) {

            throw new RuntimeException("Email is required");
        }

        if (user.getPassword() == null ||
                user.getPassword().trim().isEmpty()) {

            throw new RuntimeException("Password is required");
        }

        if (user.getPassword().length() < 8) {

            throw new RuntimeException(
                    "Password must contain at least 8 characters"
            );
        }

        String email = user.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        String role = user.getRole();

        if (role == null ||
                role.trim().isEmpty()) {

            throw new RuntimeException(
                    "Role is required"
            );
        }

        role = role.trim().toUpperCase();

        if (!role.equals("PATIENT") &&
                !role.equals("NURSE")) {

            throw new RuntimeException(
                    "Only PATIENT and NURSE registration is allowed"
            );
        }

        user.setName(user.getName().trim());

        user.setEmail(email);

        user.setRole(role);

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    public User login(String email, String password) {

        if (email == null ||
                email.trim().isEmpty()) {

            throw new RuntimeException("Email is required");
        }

        if (password == null ||
                password.trim().isEmpty()) {

            throw new RuntimeException("Password is required");
        }

        User user = userRepository
                .findByEmail(email.trim().toLowerCase())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        return user;
    }

    public User resetPassword(
            String email,
            String newPassword) {

        if (email == null ||
                email.trim().isEmpty()) {

            throw new RuntimeException("Email is required");
        }

        if (newPassword == null ||
                newPassword.trim().isEmpty()) {

            throw new RuntimeException(
                    "New password is required"
            );
        }

        if (newPassword.length() < 8) {

            throw new RuntimeException(
                    "Password must contain at least 8 characters"
            );
        }

        User user = userRepository
                .findByEmail(email.trim().toLowerCase())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Email not registered"
                        )
                );

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        return userRepository.save(user);
    }

    public User updateRole(
            Long userId,
            String role) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (role == null ||
                role.trim().isEmpty()) {

            throw new RuntimeException("Role is required");
        }

        String selectedRole = role
                .trim()
                .toUpperCase();

        if (!selectedRole.equals("PATIENT") &&
                !selectedRole.equals("NURSE")) {

            throw new RuntimeException(
                    "Invalid role"
            );
        }

        user.setRole(selectedRole);

        return userRepository.save(user);
    }

    public User getUserById(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }

    public User updateUserProfile(
            Long userId,
            User updatedUser) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (updatedUser.getName() != null &&
                !updatedUser.getName().trim().isEmpty()) {

            user.setName(
                    updatedUser.getName().trim()
            );
        }

        if (updatedUser.getEmail() != null &&
                !updatedUser.getEmail().trim().isEmpty()) {

            String email = updatedUser.getEmail()
                    .trim()
                    .toLowerCase();

            if (!email.equalsIgnoreCase(user.getEmail()) &&
                    userRepository.existsByEmail(email)) {

                throw new RuntimeException(
                        "Email already registered"
                );
            }

            user.setEmail(email);
        }

        return userRepository.save(user);
    }

    public List<User> getNurses() {

        return userRepository
                .findByRoleIgnoreCase("NURSE");
    }
}