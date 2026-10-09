package com.homehealthcare.service;

import com.homehealthcare.entity.MedicalRecord;
import com.homehealthcare.repository.MedicalRecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;

    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
    }

    public MedicalRecord createMedicalRecord(MedicalRecord medicalRecord) {

        if (medicalRecord == null) {
            throw new RuntimeException("Medical record details are required");
        }

        if (medicalRecord.getPatientId() == null) {
            throw new RuntimeException("Patient ID is required");
        }

        medicalRecord.setCreatedAt(
                LocalDateTime.now(ZoneId.of("Asia/Kolkata"))
        );

        return medicalRecordRepository.save(medicalRecord);
    }

    public List<MedicalRecord> getMedicalRecordsByPatientId(Long patientId) {

        if (patientId == null) {
            throw new RuntimeException("Patient ID is required");
        }

        return medicalRecordRepository
                .findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public MedicalRecord getMedicalRecordById(Long recordId) {

        return medicalRecordRepository.findById(recordId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medical record not found with id: " + recordId
                        ));
    }
}