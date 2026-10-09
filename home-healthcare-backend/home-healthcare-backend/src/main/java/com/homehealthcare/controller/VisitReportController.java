package com.homehealthcare.controller;

import com.homehealthcare.entity.VisitReport;
import com.homehealthcare.service.VisitReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visit-reports")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class VisitReportController {

    private final VisitReportService visitReportService;

    public VisitReportController(VisitReportService visitReportService) {
        this.visitReportService = visitReportService;
    }

    @PostMapping
    public ResponseEntity<VisitReport> createVisitReport(
            @RequestBody VisitReport visitReport) {

        return ResponseEntity.ok(
                visitReportService.createVisitReport(visitReport)
        );
    }

    @GetMapping
    public ResponseEntity<List<VisitReport>> getAllVisitReports() {

        return ResponseEntity.ok(
                visitReportService.getAllVisitReports()
        );
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<VisitReport>> getPatientVisitReports(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                visitReportService.getPatientVisitReports(patientId)
        );
    }

    @GetMapping("/nurse/{nurseId}")
    public ResponseEntity<List<VisitReport>> getNurseVisitReports(
            @PathVariable Long nurseId) {

        return ResponseEntity.ok(
                visitReportService.getNurseVisitReports(nurseId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<VisitReport> getVisitReportById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                visitReportService.getVisitReportById(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisitReport(
            @PathVariable Long id) {

        visitReportService.deleteVisitReport(id);

        return ResponseEntity.noContent().build();
    }
}