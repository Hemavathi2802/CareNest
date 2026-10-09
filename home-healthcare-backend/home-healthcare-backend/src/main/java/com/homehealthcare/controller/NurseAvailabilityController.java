package com.homehealthcare.controller;

import com.homehealthcare.entity.NurseAvailability;
import com.homehealthcare.service.NurseAvailabilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nurse")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class NurseAvailabilityController {

    private final NurseAvailabilityService service;

    public NurseAvailabilityController(NurseAvailabilityService service) {
        this.service = service;
    }

    @PutMapping("/availability")
    public ResponseEntity<?> saveAvailability(
            @RequestBody NurseAvailability availability) {

        try {

            System.out.println("========== AVAILABILITY SAVE ==========");
            System.out.println("Nurse ID: " + availability.getNurseId());
            System.out.println("Monday: " + availability.isMonday());
            System.out.println("Tuesday: " + availability.isTuesday());
            System.out.println("Wednesday: " + availability.isWednesday());
            System.out.println("Thursday: " + availability.isThursday());
            System.out.println("Friday: " + availability.isFriday());
            System.out.println("Saturday: " + availability.isSaturday());
            System.out.println("Sunday: " + availability.isSunday());
            System.out.println("Start Time: " + availability.getStartTime());
            System.out.println("End Time: " + availability.getEndTime());

            NurseAvailability saved =
                    service.saveAvailability(availability);

            System.out.println("Saved successfully. ID: " + saved.getId());
            System.out.println("=======================================");

            return ResponseEntity.ok(saved);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(Map.of(
                            "message",
                            e.getMessage() != null
                                    ? e.getMessage()
                                    : "Unknown server error"
                    ));
        }
    }

    @GetMapping("/availability/{nurseId}")
    public ResponseEntity<NurseAvailability> getAvailability(
            @PathVariable String nurseId) {

        return service.getAvailability(nurseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/availability")
    public ResponseEntity<List<NurseAvailability>> getAllAvailability() {

        return ResponseEntity.ok(
                service.getAllAvailability()
        );
    }
}