package com.homehealthcare.service;

import com.homehealthcare.entity.Appointment;
import com.homehealthcare.entity.Patient;
import com.homehealthcare.entity.User;
import com.homehealthcare.repository.AppointmentRepository;
import com.homehealthcare.repository.PatientRepository;
import com.homehealthcare.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ScheduleService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PatientIdentityService patientIdentityService;

    public ScheduleService(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            UserRepository userRepository,
            PatientIdentityService patientIdentityService) {

        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.patientIdentityService = patientIdentityService;
    }

    // ==============================
    // PATIENT SCHEDULE
    // ==============================

    public List<Map<String, Object>> getPatientSchedule(Long userId) {

        Patient patient = patientRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found for user ID: " + userId
                        )
                );

        Long patientId = patient.getPatientId();

        List<Appointment> appointments =
                appointmentRepository.findByPatientId(patientId);

        List<Map<String, Object>> schedule =
                new ArrayList<>();

        for (Appointment appointment : appointments) {

            // Only accepted appointments appear in schedule
            if (!"ACCEPTED".equalsIgnoreCase(
                    appointment.getStatus())) {

                continue;
            }

            Map<String, Object> item =
                    new HashMap<>();

            // Appointment information
            item.put(
                    "id",
                    appointment.getId()
            );

            item.put(
                    "date",
                    appointment.getDate()
            );

            item.put(
                    "time",
                    appointment.getTime()
            );

            // Service / visit title
            item.put(
                    "title",
                    appointment.getService() != null
                            ? appointment.getService()
                            : "Healthcare Visit"
            );

            // Nurse ID
            item.put(
                    "nurseId",
                    appointment.getNurseId()
            );

            // Nurse name
            String nurseName =
                    "Healthcare Nurse";

            if (appointment.getNurseId() != null) {

                User nurse =
                        userRepository
                                .findById(
                                        appointment.getNurseId()
                                )
                                .orElse(null);

                if (nurse != null &&
                        nurse.getName() != null &&
                        !nurse.getName().isBlank()) {

                    nurseName =
                            nurse.getName();
                }
            }

            item.put(
                    "nurseName",
                    nurseName
            );

            // Patient schedule location
            item.put(
                    "location",
                    "Home Visit"
            );

            // Schedule status
            item.put(
                    "status",
                    "Scheduled"
            );

            schedule.add(item);
        }

        return schedule;
    }


    // ==============================
    // NURSE SCHEDULE
    // ==============================

    public List<Map<String, Object>> getNurseSchedule(
            Long nurseId) {

        List<Appointment> appointments =
                appointmentRepository.findByNurseId(nurseId);

        List<Map<String, Object>> schedule =
                new ArrayList<>();

        for (Appointment appointment : appointments) {

            // Only accepted appointments appear in schedule
            if (!"ACCEPTED".equalsIgnoreCase(
                    appointment.getStatus())) {

                continue;
            }

            Map<String, Object> item =
                    new HashMap<>();


            // ==============================
            // APPOINTMENT INFORMATION
            // ==============================

            item.put(
                    "id",
                    appointment.getId()
            );

            item.put(
                    "date",
                    appointment.getDate()
            );

            item.put(
                    "time",
                    appointment.getTime()
            );


            // ==============================
            // PATIENT INFORMATION
            // ==============================

            item.put(
                    "patientId",
                    appointment.getPatientId()
            );

            String patientName =
                    "Patient";

            String patientAddress =
                    "Home Visit";


            if (appointment.getPatientId() != null) {

                Patient patient = patientIdentityService.findForAppointment(
                        appointment.getPatientId()
                );

                if (patient != null) {

                    // Patient Name
                    if (patient.getName() != null &&
                            !patient.getName().isBlank()) {

                        patientName =
                                patient.getName();
                    }

                    // Patient Address
                    if (patient.getAddress() != null &&
                            !patient.getAddress().isBlank()) {

                        patientAddress =
                                patient.getAddress();
                    }
                }
            }


            item.put(
                    "patientName",
                    patientName
            );


            // ==============================
            // VISIT INFORMATION
            // ==============================

            item.put(
                    "visitType",
                    "Home Visit"
            );


            // Patient's actual address
            item.put(
                    "location",
                    patientAddress
            );


            // ==============================
            // ORIGINAL APPOINTMENT SERVICE
            // ==============================

            item.put(
                    "service",
                    appointment.getService()
            );


            // ==============================
            // SCHEDULE STATUS
            // ==============================

            item.put(
                    "status",
                    "Scheduled"
            );


            schedule.add(item);
        }

        return schedule;
    }


    // ==============================
    // ADMIN SCHEDULE
    // ==============================

    public List<Map<String, Object>> getAdminSchedule() {

        List<Appointment> appointments =
                appointmentRepository.findAll();

        List<Map<String, Object>> schedule =
                new ArrayList<>();

        for (Appointment appointment : appointments) {

            // Only accepted appointments appear
            if (!"ACCEPTED".equalsIgnoreCase(
                    appointment.getStatus())) {

                continue;
            }

            Map<String, Object> item =
                    new HashMap<>();


            // ==============================
            // APPOINTMENT INFORMATION
            // ==============================

            item.put(
                    "id",
                    appointment.getId()
            );

            item.put(
                    "date",
                    appointment.getDate()
            );

            item.put(
                    "time",
                    appointment.getTime()
            );

            item.put(
                    "service",
                    appointment.getService()
            );


            // ==============================
            // PATIENT INFORMATION
            // ==============================

            item.put(
                    "patientId",
                    appointment.getPatientId()
            );

            String patientName =
                    "Patient";

            String patientAddress =
                    "Patient Address";


            if (appointment.getPatientId() != null) {

                Patient patient = patientIdentityService.findForAppointment(
                        appointment.getPatientId()
                );

                if (patient != null) {

                    // Patient Name
                    if (patient.getName() != null &&
                            !patient.getName().isBlank()) {

                        patientName =
                                patient.getName();
                    }

                    // Patient Address
                    if (patient.getAddress() != null &&
                            !patient.getAddress().isBlank()) {

                        patientAddress =
                                patient.getAddress();
                    }
                }
            }


            item.put(
                    "patientName",
                    patientName
            );

            // Patient's actual address
            item.put(
                    "location",
                    patientAddress
            );


            // ==============================
            // NURSE INFORMATION
            // ==============================

            item.put(
                    "nurseId",
                    appointment.getNurseId()
            );

            String nurseName =
                    "Healthcare Nurse";


            if (appointment.getNurseId() != null) {

                User nurse =
                        userRepository
                                .findById(
                                        appointment.getNurseId()
                                )
                                .orElse(null);

                if (nurse != null &&
                        nurse.getName() != null &&
                        !nurse.getName().isBlank()) {

                    nurseName =
                            nurse.getName();
                }
            }


            item.put(
                    "nurseName",
                    nurseName
            );


            // ==============================
            // VISIT INFORMATION
            // ==============================

            item.put(
                    "visitType",
                    "Home Visit"
            );


            // ==============================
            // SCHEDULE STATUS
            // ==============================

            item.put(
                    "status",
                    "Scheduled"
            );


            schedule.add(item);
        }

        return schedule;
    }
}