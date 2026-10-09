package com.homehealthcare.controller;

import com.homehealthcare.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class AdminScheduleController {

    private final ScheduleService scheduleService;

    public AdminScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping("/schedule")
    public ResponseEntity<List<Map<String, Object>>> getAdminSchedule() {
        return ResponseEntity.ok(
                scheduleService.getAdminSchedule()
        );
    }
}