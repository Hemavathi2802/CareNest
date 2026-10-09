package com.homehealthcare.controller;

import com.homehealthcare.entity.Patient;
import com.homehealthcare.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class PatientController {

    private final PatientService patientService;

    public PatientController(
            PatientService patientService) {
        this.patientService = patientService;
    }

    // =====================================================
    // CREATE PATIENT PROFILE
    // =====================================================

    @PostMapping
    public ResponseEntity<Patient> addPatient(
            @RequestBody Patient patient) {

        Patient savedPatient =
                patientService.addPatient(patient);

        return ResponseEntity.ok(savedPatient);
    }


    // =====================================================
    // GET ALL PATIENTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {

        return ResponseEntity.ok(
                patientService.getAllPatients()
        );
    }


    // =====================================================
    // GET PATIENT USING USER ID
    // =====================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<Patient> getPatientByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                patientService.getPatientByUserId(userId)
        );
    }


    // =====================================================
    // UPDATE PATIENT USING USER ID
    // =====================================================

    @PutMapping("/user/{userId}")
    public ResponseEntity<Patient> updatePatientByUserId(
            @PathVariable Long userId,
            @RequestBody Patient patient) {

        return ResponseEntity.ok(
                patientService.updatePatientByUserId(
                        userId,
                        patient
                )
        );
    }


    // =====================================================
    // GET PATIENT USING PATIENT ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                patientService.getPatientById(id)
        );
    }


    // =====================================================
    // UPDATE PATIENT USING PATIENT ID
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long id,
            @RequestBody Patient patient) {

        return ResponseEntity.ok(
                patientService.updatePatient(
                        id,
                        patient
                )
        );
    }
}