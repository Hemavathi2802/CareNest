package com.homehealthcare.controller;

import com.homehealthcare.entity.MedicalRecord;
import com.homehealthcare.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    // CREATE MEDICAL RECORD
    @PostMapping
    public MedicalRecord createMedicalRecord(
            @RequestBody MedicalRecord medicalRecord) {

        return medicalRecordService.createMedicalRecord(medicalRecord);
    }

    // GET MEDICAL RECORDS BY PATIENT ID
    @GetMapping("/patient/{patientId}")
    public List<MedicalRecord> getMedicalRecordsByPatientId(
            @PathVariable Long patientId) {

        return medicalRecordService
                .getMedicalRecordsByPatientId(patientId);
    }

    // GET ONE MEDICAL RECORD BY ID
    @GetMapping("/{recordId}")
    public MedicalRecord getMedicalRecordById(
            @PathVariable Long recordId) {

        return medicalRecordService
                .getMedicalRecordById(recordId);
    }
}