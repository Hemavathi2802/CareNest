
package com.homehealthcare.service;

import com.homehealthcare.entity.Appointment;
import com.homehealthcare.entity.Patient;
import com.homehealthcare.entity.PatientCare;
import com.homehealthcare.repository.AppointmentRepository;
import com.homehealthcare.repository.PatientCareRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PatientCareService {

    private final PatientCareRepository patientCareRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientIdentityService patientIdentityService;

    public PatientCareService(
            PatientCareRepository patientCareRepository,
            AppointmentRepository appointmentRepository,
            PatientIdentityService patientIdentityService) {

        this.patientCareRepository = patientCareRepository;
        this.appointmentRepository = appointmentRepository;
        this.patientIdentityService = patientIdentityService;
    }

    @Transactional
    public PatientCare createPatientCare(
            PatientCare patientCare) {

        Appointment appointment = patientCare.getAppointmentId() == null
                ? null
                : appointmentRepository.findById(patientCare.getAppointmentId())
                        .orElseThrow(() -> new RuntimeException(
                                "Appointment not found with id: "
                                        + patientCare.getAppointmentId()
                        ));

        if (appointment != null) {
            patientCare.setPatientId(appointment.getPatientId());
            patientCare.setNurseId(appointment.getNurseId());
        }

        if (patientCare.getPatientId() == null) {
            throw new RuntimeException("Patient ID is required");
        }

        if (patientCare.getNurseId() == null) {
            throw new RuntimeException("Nurse ID is required");
        }

        if (patientCare.getVisitDate() == null) {
            throw new RuntimeException("Visit date is required");
        }

        if (patientCare.getCareNotes() == null ||
                patientCare.getCareNotes().trim().isEmpty()) {

            throw new RuntimeException("Care notes are required");
        }

        PatientCare savedCare =
                patientCareRepository.save(patientCare);

        setPatientName(savedCare);

        return savedCare;
    }

    public List<PatientCare> getAllPatientCare() {

        List<PatientCare> records =
                patientCareRepository.findAll();

        setPatientNames(records);

        return records;
    }

    public List<PatientCare> getPatientCareByPatientId(
            Long patientId) {

        List<PatientCare> records =
                patientCareRepository.findByPatientId(patientId);

        setPatientNames(records);

        return records;
    }

    public List<PatientCare> getPatientCareByNurseId(
            Long nurseId) {

        List<PatientCare> records =
                patientCareRepository.findByNurseId(nurseId);

        setPatientNames(records);

        return records;
    }

    public PatientCare getPatientCareById(Long id) {

        PatientCare record =
                patientCareRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException(
                                "Patient care record not found"));

        setPatientName(record);

        return record;
    }

    @Transactional
    public void deletePatientCare(Long id) {

        if (!patientCareRepository.existsById(id)) {

            throw new RuntimeException(
                    "Patient care record not found");
        }

        patientCareRepository.deleteById(id);
    }

    private void setPatientName(
            PatientCare patientCare) {

        if (patientCare == null ||
                patientCare.getPatientId() == null) {

            return;
        }

        Patient patient = patientCare.getAppointmentId() == null
                ? patientIdentityService.findByReferenceOrUser(
                        patientCare.getPatientId()
                )
                : appointmentRepository.findById(patientCare.getAppointmentId())
                        .map(appointment -> patientIdentityService.findForAppointment(
                                appointment.getPatientId()
                        ))
                        .orElse(null);
        if (patient != null
                && patient.getName() != null
                && !patient.getName().isBlank()) {
            patientCare.setPatientName(patient.getName());
        } else {
            patientCare.setPatientName("Unknown Patient");
        }
    }

    private void setPatientNames(
            List<PatientCare> records) {

        if (records == null ||
                records.isEmpty()) {

            return;
        }

        for (PatientCare record : records) {

            setPatientName(record);
        }
    }
}