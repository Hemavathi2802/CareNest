package com.homehealthcare.controller;

import com.homehealthcare.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(
            ScheduleService scheduleService) {

        this.scheduleService = scheduleService;
    }

    // ==============================
    // PATIENT SCHEDULE
    // ==============================

    @GetMapping("/{userId}/schedule")
    public ResponseEntity<List<Map<String, Object>>>
    getPatientSchedule(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                scheduleService.getPatientSchedule(userId)
        );
    }
}