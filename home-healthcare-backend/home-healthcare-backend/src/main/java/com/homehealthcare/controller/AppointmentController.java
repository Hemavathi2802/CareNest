package com.homehealthcare.controller;

import com.homehealthcare.entity.Appointment;
import com.homehealthcare.entity.Patient;
import com.homehealthcare.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService) {

        this.appointmentService = appointmentService;
    }

    // =====================================================
    // BOOK APPOINTMENT
    // =====================================================

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(
            @RequestBody Appointment appointment) {

        return ResponseEntity.ok(
                appointmentService.createAppointment(
                        appointment
                )
        );
    }

    // =====================================================
    // ADMIN - ALL APPOINTMENTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {

        return ResponseEntity.ok(
                appointmentService.getAllAppointments()
        );
    }

    // =====================================================
    // PATIENT - APPOINTMENTS
    // =====================================================

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>>
    getPatientAppointments(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                appointmentService.getPatientAppointments(
                        patientId
                )
        );
    }

    // =====================================================
    // NURSE - APPOINTMENTS
    // =====================================================

    @GetMapping("/nurse/{nurseId}")
    public ResponseEntity<List<Appointment>>
    getNurseAppointments(
            @PathVariable Long nurseId) {

        return ResponseEntity.ok(
                appointmentService.getNurseAppointments(
                        nurseId
                )
        );
    }

    // =====================================================
    // NURSE - PATIENTS
    // =====================================================

    @GetMapping("/nurse/{nurseId}/patients")
    public ResponseEntity<List<Patient>>
    getNursePatients(
            @PathVariable Long nurseId) {

        return ResponseEntity.ok(
                appointmentService.getNursePatients(
                        nurseId
                )
        );
    }

    // =====================================================
    // ACCEPT APPOINTMENT
    // =====================================================

    @PutMapping("/{id}/accept")
    public ResponseEntity<Appointment>
    acceptAppointment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                appointmentService.acceptAppointment(id)
        );
    }

    // =====================================================
    // REJECT APPOINTMENT
    // =====================================================

    @PutMapping("/{id}/reject")
    public ResponseEntity<Appointment>
    rejectAppointment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                appointmentService.rejectAppointment(id)
        );
    }

    // =====================================================
    // CANCEL APPOINTMENT
    // =====================================================

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment>
    cancelAppointment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                appointmentService.cancelAppointment(id)
        );
    }

    // =====================================================
    // DELETE APPOINTMENT
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteAppointment(
            @PathVariable Long id) {

        appointmentService.deleteAppointment(id);

        return ResponseEntity.noContent().build();
    }
}