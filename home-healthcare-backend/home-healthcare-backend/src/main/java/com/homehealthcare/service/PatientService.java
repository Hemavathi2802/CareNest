package com.homehealthcare.service;

import com.homehealthcare.entity.Patient;
import com.homehealthcare.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(
            PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // =====================================================
    // CREATE PATIENT PROFILE
    // =====================================================

    public Patient addPatient(Patient patient) {

        if (patient.getUserId() == null) {
            throw new RuntimeException(
                    "User ID is required"
            );
        }

        if (patientRepository
                .findByUserId(patient.getUserId())
                .isPresent()) {

            throw new RuntimeException(
                    "Patient profile already exists for this user"
            );
        }

        return patientRepository.save(patient);
    }


    // =====================================================
    // GET ALL PATIENTS
    // =====================================================

    public List<Patient> getAllPatients() {

        return patientRepository.findAll();
    }


    // =====================================================
    // GET PATIENT USING USER ID
    // =====================================================

    public Patient getPatientByUserId(Long userId) {

        return patientRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient profile not found for user: "
                                        + userId
                        )
                );
    }


    // =====================================================
    // GET PATIENT USING PATIENT ID
    // =====================================================

    public Patient getPatientById(Long patientId) {

        return patientRepository
                .findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found with id: "
                                        + patientId
                        )
                );
    }


    // =====================================================
    // UPDATE PATIENT USING USER ID
    // =====================================================

    public Patient updatePatientByUserId(
            Long userId,
            Patient patientDetails) {

        Patient existingPatient =
                patientRepository
                        .findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found for user: "
                                                + userId
                                )
                        );

        existingPatient.setName(
                patientDetails.getName()
        );

        existingPatient.setAge(
                patientDetails.getAge()
        );

        existingPatient.setGender(
                patientDetails.getGender()
        );

        existingPatient.setPhone(
                patientDetails.getPhone()
        );

        existingPatient.setAddress(
                patientDetails.getAddress()
        );

        return patientRepository.save(
                existingPatient
        );
    }


    // =====================================================
    // UPDATE PATIENT USING PATIENT ID
    // =====================================================

    public Patient updatePatient(
            Long patientId,
            Patient patientDetails) {

        Patient existingPatient =
                patientRepository
                        .findById(patientId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient not found with id: "
                                                + patientId
                                )
                        );

        existingPatient.setName(
                patientDetails.getName()
        );

        existingPatient.setAge(
                patientDetails.getAge()
        );

        existingPatient.setGender(
                patientDetails.getGender()
        );

        existingPatient.setPhone(
                patientDetails.getPhone()
        );

        existingPatient.setAddress(
                patientDetails.getAddress()
        );

        return patientRepository.save(
                existingPatient
        );
    }
}