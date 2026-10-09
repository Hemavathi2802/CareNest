package com.homehealthcare.service;

import com.homehealthcare.entity.Nurse;
import com.homehealthcare.entity.User;
import com.homehealthcare.repository.NurseRepository;
import com.homehealthcare.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NurseService {

    private final NurseRepository nurseRepository;
    private final UserRepository userRepository;

    public NurseService(
            NurseRepository nurseRepository,
            UserRepository userRepository) {
        this.nurseRepository = nurseRepository;
        this.userRepository = userRepository;
    }

    public Nurse getNurseProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!"NURSE".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Only nurses can access nurse profile");
        }

        Nurse nurse = nurseRepository.findByUserId(userId)
                .orElseGet(Nurse::new);

        nurse.setUserId(userId);
        nurse.setName(user.getName());
        nurse.setEmail(user.getEmail());

        return nurseRepository.save(nurse);
    }

    public Nurse updateNurseProfile(Long userId, Nurse profile) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!"NURSE".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Only nurses can update nurse profile");
        }

        Nurse nurse = nurseRepository.findByUserId(userId)
                .orElseGet(Nurse::new);

        nurse.setUserId(userId);
        nurse.setName(user.getName());
        nurse.setEmail(user.getEmail());
        nurse.setPhone(profile.getPhone());
        nurse.setSpecialization(profile.getSpecialization());
        nurse.setExperience(profile.getExperience());
        nurse.setAddress(profile.getAddress());

        return nurseRepository.save(nurse);
    }

    public List<AdminNurseProfile> getAllNurseProfiles() {
        List<User> nurseUsers = userRepository.findByRoleIgnoreCase("NURSE");
        if (nurseUsers.isEmpty()) {
            return List.of();
        }

        List<Long> userIds = nurseUsers.stream()
                .map(User::getId)
                .toList();
        Map<Long, Nurse> profilesByUserId = new HashMap<>();
        nurseRepository.findByUserIdIn(userIds).forEach(
                profile -> profilesByUserId.put(profile.getUserId(), profile)
        );

        return nurseUsers.stream()
                .map(user -> {
                    Nurse profile = profilesByUserId.get(user.getId());
                    return new AdminNurseProfile(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            profile == null ? null : profile.getPhone(),
                            profile == null ? null : profile.getSpecialization(),
                            profile == null ? null : profile.getExperience(),
                            profile == null ? null : profile.getAddress()
                    );
                })
                .toList();
    }

    public record AdminNurseProfile(
            Long id,
            String name,
            String email,
            String phone,
            String specialization,
            String experience,
            String address) {
    }
}