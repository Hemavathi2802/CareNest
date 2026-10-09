package com.homehealthcare.controller;

import com.homehealthcare.entity.NurseNotification;
import com.homehealthcare.service.NurseNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications/nurse")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class NurseNotificationController {

    private final NurseNotificationService notificationService;

    public NurseNotificationController(
            NurseNotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/{nurseId}")
    public ResponseEntity<List<NurseNotification>> getNotifications(
            @PathVariable Long nurseId) {
        return ResponseEntity.ok(notificationService.getNotifications(nurseId));
    }

    @PutMapping("/{nurseId}/{notificationId}/read")
    public ResponseEntity<NurseNotification> markAsRead(
            @PathVariable Long nurseId,
            @PathVariable Long notificationId) {
        return ResponseEntity.ok(
                notificationService.markAsRead(nurseId, notificationId)
        );
    }
}
