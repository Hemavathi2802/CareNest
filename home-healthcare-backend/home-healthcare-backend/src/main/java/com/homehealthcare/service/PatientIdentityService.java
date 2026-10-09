package com.homehealthcare.service;

import com.homehealthcare.entity.Patient;
import com.homehealthcare.entity.User;
import com.homehealthcare.repository.PatientRepository;
import com.homehealthcare.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PatientIdentityService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientIdentityService(
            PatientRepository patientRepository,
            UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Patient getOrCreateForUser(Long userId) {
        User user = userRepository.findById(userId)
                .filter(candidate -> "PATIENT".equalsIgnoreCase(candidate.getRole()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Patient account not found."
                ));

        return patientRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Patient patient = new Patient();
                    patient.setUserId(userId);
                    patient.setName(user.getName());
                    return patientRepository.save(patient);
                });
    }

    @Transactional(readOnly = true)
    public Patient findByReferenceOrUser(Long patientReference) {
        return findByLegacyUserReference(patientReference);
    }

    @Transactional(readOnly = true)
    public Patient findByUserId(Long userId) {
        return patientRepository.findByUserId(userId)
                .orElseGet(() -> userRepository.findById(userId)
                        .filter(user -> "PATIENT".equalsIgnoreCase(user.getRole()))
                        .map(user -> toPatientProfile(user, userId))
                        .orElse(null));
    }

    @Transactional(readOnly = true)
    public Patient findForAppointment(Long patientId) {
        if (patientId == null) {
            return null;
        }
        return patientRepository.findById(patientId).orElse(null);
    }

    private Patient findByLegacyUserReference(Long reference) {
        if (reference == null) {
            return null;
        }

        return patientRepository.findByUserId(reference)
                .or(() -> patientRepository.findById(reference))
                .orElseGet(() -> userRepository.findById(reference)
                        .filter(user -> "PATIENT".equalsIgnoreCase(user.getRole()))
                        .map(user -> toPatientProfile(user, reference))
                        .orElse(null));
    }

    private Patient toPatientProfile(User user, Long patientId) {
        Patient patient = new Patient();
        patient.setPatientId(patientId);
        patient.setUserId(user.getId());
        patient.setName(user.getName());
        return patient;
    }

    @Transactional(readOnly = true)
    public Patient findByUserReference(Long userId) {
        return findByUserId(userId);
    }
}
