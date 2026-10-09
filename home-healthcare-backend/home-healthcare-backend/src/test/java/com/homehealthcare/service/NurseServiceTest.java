package com.homehealthcare.service;

import com.homehealthcare.entity.Nurse;
import com.homehealthcare.entity.User;
import com.homehealthcare.repository.NurseRepository;
import com.homehealthcare.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class NurseServiceTest {

    private NurseRepository nurseRepository;
    private UserRepository userRepository;
    private NurseService nurseService;

    @BeforeEach
    void setUp() {
        nurseRepository = mock(NurseRepository.class);
        userRepository = mock(UserRepository.class);
        nurseService = new NurseService(nurseRepository, userRepository);
    }

    @Test
    void combinesUserAndNurseProfileDetailsAndKeepsIncompleteNurses() {
        User completeNurse = nurseUser(1L, "Alex Nurse", "alex@example.com");
        User incompleteNurse = nurseUser(2L, "Sam Nurse", "sam@example.com");
        Nurse profile = new Nurse();
        profile.setUserId(1L);
        profile.setPhone("555-0101");
        profile.setSpecialization("Home Care");
        profile.setExperience("5 years");
        profile.setAddress("12 Care Street");

        when(userRepository.findByRoleIgnoreCase("NURSE"))
                .thenReturn(List.of(completeNurse, incompleteNurse));
        when(nurseRepository.findByUserIdIn(List.of(1L, 2L)))
                .thenReturn(List.of(profile));

        List<NurseService.AdminNurseProfile> result =
                nurseService.getAllNurseProfiles();

        assertEquals(2, result.size());
        assertEquals("Alex Nurse", result.get(0).name());
        assertEquals("alex@example.com", result.get(0).email());
        assertEquals("555-0101", result.get(0).phone());
        assertEquals("Home Care", result.get(0).specialization());
        assertEquals("5 years", result.get(0).experience());
        assertEquals("12 Care Street", result.get(0).address());
        assertEquals("Sam Nurse", result.get(1).name());
        assertNull(result.get(1).phone());
        assertNull(result.get(1).specialization());
    }

    private User nurseUser(Long id, String name, String email) {
        User user = new User();
        user.setId(id);
        user.setName(name);
        user.setEmail(email);
        user.setRole("NURSE");
        return user;
    }
}
