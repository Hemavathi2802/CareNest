package com.homehealthcare.controller;

import com.homehealthcare.entity.PatientNotification;
import com.homehealthcare.service.PatientNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications/patient")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class PatientNotificationController {

    private final PatientNotificationService notificationService;

    public PatientNotificationController(
            PatientNotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<List<PatientNotification>> getNotifications(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(
                notificationService.getPatientNotifications(patientId)
        );
    }

    @PutMapping("/{patientId}/{notificationId}/read")
    public ResponseEntity<PatientNotification> markAsRead(
            @PathVariable Long patientId,
            @PathVariable Long notificationId) {
        return ResponseEntity.ok(
                notificationService.markAsRead(patientId, notificationId)
        );
    }
}
