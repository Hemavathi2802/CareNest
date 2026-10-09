
package com.homehealthcare.controller;

import com.homehealthcare.entity.PatientCare;
import com.homehealthcare.service.PatientCareService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient-care")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class PatientCareController {

    private final PatientCareService patientCareService;

    public PatientCareController(
            PatientCareService patientCareService) {

        this.patientCareService = patientCareService;
    }

    @PostMapping
    public ResponseEntity<PatientCare> createPatientCare(
            @RequestBody PatientCare patientCare) {

        return ResponseEntity.ok(
                patientCareService.createPatientCare(patientCare)
        );
    }

    @GetMapping
    public ResponseEntity<List<PatientCare>> getAllPatientCare() {

        return ResponseEntity.ok(
                patientCareService.getAllPatientCare()
        );
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PatientCare>> getPatientCareByPatientId(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                patientCareService.getPatientCareByPatientId(patientId)
        );
    }

    
@GetMapping("/nurse/{nurseId}")
public ResponseEntity<List<PatientCare>> getPatientCareByNurseId(
        @PathVariable Long nurseId) {

    return ResponseEntity.ok(
            patientCareService.getPatientCareByNurseId(nurseId)
    );
}
    @GetMapping("/{id}")
    public ResponseEntity<PatientCare> getPatientCareById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                patientCareService.getPatientCareById(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatientCare(
            @PathVariable Long id) {

        patientCareService.deletePatientCare(id);

        return ResponseEntity.noContent().build();
    }
}