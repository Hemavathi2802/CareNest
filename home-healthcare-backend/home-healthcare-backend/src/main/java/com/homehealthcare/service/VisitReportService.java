package com.homehealthcare.service;

import com.homehealthcare.entity.Appointment;
import com.homehealthcare.entity.Patient;
import com.homehealthcare.entity.User;
import com.homehealthcare.entity.VisitReport;
import com.homehealthcare.repository.AppointmentRepository;
import com.homehealthcare.repository.UserRepository;
import com.homehealthcare.repository.VisitReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitReportService {

    private final VisitReportRepository visitReportRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final PatientIdentityService patientIdentityService;

    public VisitReportService(
            VisitReportRepository visitReportRepository,
            AppointmentRepository appointmentRepository,
            UserRepository userRepository,
            PatientIdentityService patientIdentityService) {

        this.visitReportRepository = visitReportRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.patientIdentityService = patientIdentityService;
    }

    public VisitReport createVisitReport(VisitReport visitReport) {

        if (visitReport.getAppointmentId() == null) {
            throw new RuntimeException("Appointment ID is required");
        }

        Appointment appointment = appointmentRepository
                .findById(visitReport.getAppointmentId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Appointment not found with id: "
                                        + visitReport.getAppointmentId()
                        )
                );

        // Automatically get patient and nurse from appointment
        visitReport.setPatientId(appointment.getPatientId());
        visitReport.setNurseId(appointment.getNurseId());

        // Get service type from appointment
        visitReport.setService(appointment.getService());

        // Use appointment date if visit date is not provided
        if (visitReport.getVisitDate() == null ||
                visitReport.getVisitDate().isBlank()) {

            visitReport.setVisitDate(appointment.getDate());
        }

        // Use appointment time if visit time is not provided
        if (visitReport.getVisitTime() == null ||
                visitReport.getVisitTime().isBlank()) {

            visitReport.setVisitTime(appointment.getTime());
        }

        // Visit report is completed
        visitReport.setStatus("COMPLETED");

        // Add patient and nurse names
        addNames(visitReport);

        // Save visit report
        VisitReport savedReport = visitReportRepository.save(visitReport);

        // -----------------------------------------
        // IMPORTANT:
        // After Visit Report is submitted,
        // mark the related Appointment as COMPLETED
        // -----------------------------------------
        appointment.setStatus("COMPLETED");
        appointmentRepository.save(appointment);

        return savedReport;
    }

    public List<VisitReport> getAllVisitReports() {

        List<VisitReport> reports =
                visitReportRepository.findAll();

        for (VisitReport report : reports) {
            addServiceFromAppointment(report);
            addNames(report);
        }

        return reports;
    }

    public List<VisitReport> getPatientVisitReports(Long patientId) {

        List<VisitReport> reports =
                visitReportRepository.findByPatientId(patientId);

        for (VisitReport report : reports) {
            addServiceFromAppointment(report);
            addNames(report);
        }

        return reports;
    }

    public List<VisitReport> getNurseVisitReports(Long nurseId) {

        List<VisitReport> reports =
                visitReportRepository.findByNurseId(nurseId);

        for (VisitReport report : reports) {
            addServiceFromAppointment(report);
            addNames(report);
        }

        return reports;
    }

    public VisitReport getVisitReportById(Long id) {

        VisitReport report = visitReportRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Visit report not found with id: " + id
                        )
                );

        addServiceFromAppointment(report);
        addNames(report);

        return report;
    }

    public void deleteVisitReport(Long id) {

        if (!visitReportRepository.existsById(id)) {
            throw new RuntimeException(
                    "Visit report not found with id: " + id
            );
        }

        visitReportRepository.deleteById(id);
    }

    // Get actual patient name and nurse name
    private void addNames(VisitReport report) {

        // Patient name
        if (report.getPatientId() != null) {

            Patient patient = report.getAppointmentId() == null
                    ? patientIdentityService.findByReferenceOrUser(
                            report.getPatientId()
                    )
                    : appointmentRepository.findById(report.getAppointmentId())
                            .map(appointment -> patientIdentityService.findForAppointment(
                                    appointment.getPatientId()
                            ))
                            .orElse(null);

            if (patient != null &&
                    patient.getName() != null &&
                    !patient.getName().isBlank()) {

                report.setPatientName(patient.getName());

            } else {
                report.setPatientName(
                        "Patient #" + report.getPatientId()
                );
            }

        } else {
            report.setPatientName("Unknown Patient");
        }

        // Nurse name
        if (report.getNurseId() != null) {

            User nurse = userRepository
                    .findById(report.getNurseId())
                    .orElse(null);

            if (nurse != null &&
                    nurse.getName() != null &&
                    !nurse.getName().isBlank()) {

                report.setNurseName(nurse.getName());

            } else {
                report.setNurseName(
                        "Nurse #" + report.getNurseId()
                );
            }

        } else {
            report.setNurseName("Unknown Nurse");
        }
    }

    // Get actual service type from Appointment
    private void addServiceFromAppointment(VisitReport report) {

        if (report.getAppointmentId() == null) {
            report.setService("Healthcare Visit");
            return;
        }

        Appointment appointment = appointmentRepository
                .findById(report.getAppointmentId())
                .orElse(null);

        if (appointment != null &&
                appointment.getService() != null &&
                !appointment.getService().isBlank()) {

            report.setService(
                    appointment.getService()
            );

        } else {
            report.setService("Healthcare Visit");
        }

        if (appointment != null) {
            if (report.getVisitDate() == null || report.getVisitDate().isBlank()) {
                report.setVisitDate(appointment.getDate());
            }
            if (report.getVisitTime() == null || report.getVisitTime().isBlank()) {
                report.setVisitTime(appointment.getTime());
            }
        }
    }
}