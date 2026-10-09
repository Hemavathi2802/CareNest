package com.homehealthcare.controller;

import com.homehealthcare.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nurse")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class NurseScheduleController {

    private final ScheduleService scheduleService;

    public NurseScheduleController(
            ScheduleService scheduleService) {

        this.scheduleService = scheduleService;
    }

    @GetMapping("/{nurseId}/schedule")
    public ResponseEntity<List<Map<String, Object>>>
    getNurseSchedule(
            @PathVariable Long nurseId) {

        return ResponseEntity.ok(
                scheduleService.getNurseSchedule(nurseId)
        );
    }
}