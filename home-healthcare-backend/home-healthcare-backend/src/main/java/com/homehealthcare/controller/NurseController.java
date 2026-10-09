
package com.homehealthcare.controller;

import com.homehealthcare.entity.Nurse;
import com.homehealthcare.service.NurseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class NurseController {

    private final NurseService nurseService;

    public NurseController(NurseService nurseService) {
        this.nurseService = nurseService;
    }

    @GetMapping("/nurses/profiles")
    public ResponseEntity<List<NurseService.AdminNurseProfile>> getNurseProfiles() {
        return ResponseEntity.ok(nurseService.getAllNurseProfiles());
    }

    @GetMapping("/nurse/{userId}")
    public ResponseEntity<Nurse> getNurseProfile(
            @PathVariable Long userId) {

        Nurse nurse = nurseService.getNurseProfile(userId);

        return ResponseEntity.ok(nurse);
    }

    @PutMapping("/nurse/{userId}")
    public ResponseEntity<Nurse> updateNurseProfile(
            @PathVariable Long userId,
            @RequestBody Nurse profile) {

        Nurse updatedNurse =
                nurseService.updateNurseProfile(userId, profile);

        return ResponseEntity.ok(updatedNurse);
    }
}