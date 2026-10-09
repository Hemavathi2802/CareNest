package com.homehealthcare.service;

import com.homehealthcare.entity.Appointment;
import com.homehealthcare.entity.NurseAvailability;
import com.homehealthcare.entity.NurseNotification;
import com.homehealthcare.entity.Patient;
import com.homehealthcare.entity.User;
import com.homehealthcare.repository.AppointmentRepository;
import com.homehealthcare.repository.NurseAvailabilityRepository;
import com.homehealthcare.repository.NurseNotificationRepository;
import com.homehealthcare.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.Set;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private static final DateTimeFormatter DISPLAY_TIME =
            DateTimeFormatter.ofPattern("h:mm a", java.util.Locale.ENGLISH);

    private final AppointmentRepository appointmentRepository;
    private final NurseAvailabilityRepository nurseAvailabilityRepository;
    private final UserRepository userRepository;
    private final PatientIdentityService patientIdentityService;
    private final NurseNotificationRepository nurseNotificationRepository;
    private final AppointmentEmailService appointmentEmailService;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            NurseAvailabilityRepository nurseAvailabilityRepository,
            UserRepository userRepository,
            PatientIdentityService patientIdentityService,
            NurseNotificationRepository nurseNotificationRepository,
            AppointmentEmailService appointmentEmailService) {

        this.appointmentRepository = appointmentRepository;
        this.nurseAvailabilityRepository = nurseAvailabilityRepository;
        this.userRepository = userRepository;
        this.patientIdentityService = patientIdentityService;
        this.nurseNotificationRepository = nurseNotificationRepository;
        this.appointmentEmailService = appointmentEmailService;
    }

    // =====================================================
    // CREATE / BOOK APPOINTMENT
    // =====================================================

    @Transactional
    public Appointment createAppointment(
            Appointment appointment) {

        if (appointment.getPatientId() == null
                || appointment.getService() == null
                || appointment.getService().isBlank()
                || appointment.getDate() == null
                || appointment.getTime() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Patient, service, date and time are required."
            );
        }

        LocalDate appointmentDate;
        LocalTime appointmentTime;
        try {
            appointmentDate = LocalDate.parse(appointment.getDate());
            appointmentTime = LocalTime.parse(appointment.getTime());
        } catch (DateTimeParseException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Appointment date or time is invalid."
            );
        }

        Patient patient = patientIdentityService.getOrCreateForUser(
                appointment.getPatientId()
        );
        appointment.setPatientId(patient.getPatientId());

        Long nurseId = findAvailableNurse(
                appointmentDate,
                appointmentTime
        );
        appointment.setNurseId(nurseId);
        appointment.setStatus("PENDING");

        Appointment saved =
                appointmentRepository.save(appointment);

        Appointment response = addNames(saved);
        User nurse = notifyAssignedNurse(response);
        User patientUser = patient.getUserId() == null
                ? null
                : userRepository.findById(patient.getUserId()).orElse(null);
        appointmentEmailService.sendBookingEmails(
                response,
                patientUser == null ? null : patientUser.getEmail(),
                patientUser == null ? null : patientUser.getName(),
                nurse == null ? null : nurse.getEmail(),
                nurse == null ? null : nurse.getName()
        );
        return response;
    }

    private User notifyAssignedNurse(Appointment appointment) {
        User nurse = appointment.getNurseId() == null
                ? null
                : userRepository.findById(appointment.getNurseId()).orElse(null);

        String notificationText = "New appointment assigned: "
                + appointment.getPatientName() + " - "
                + appointment.getService() + ", "
                + appointment.getDate() + " at "
                + LocalTime.parse(appointment.getTime())
                        .format(DISPLAY_TIME) + ".";

        if (appointment.getNurseId() != null
                && !nurseNotificationRepository.existsByAppointmentId(appointment.getId())) {
            NurseNotification notification = new NurseNotification();
            notification.setNurseId(appointment.getNurseId());
            notification.setAppointmentId(appointment.getId());
            notification.setMessage(notificationText);
            notification.setCreatedAt(LocalDateTime.now());
            nurseNotificationRepository.save(notification);
        }

        return nurse;
    }

    private Long findAvailableNurse(
            LocalDate appointmentDate,
            LocalTime appointmentTime) {

        Set<Long> nurseUserIds = userRepository
                .findNursesForAppointmentAssignment("NURSE")
                .stream()
                .map(User::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<Appointment> existingAppointments =
                appointmentRepository.findAll();

        List<Long> availableNurseIds =
                nurseAvailabilityRepository.findAll()
                        .stream()
                        .filter(availability ->
                                isAvailableAt(
                                        availability,
                                        appointmentDate.getDayOfWeek(),
                                        appointmentTime
                                )
                        )
                        .map(NurseAvailability::getNurseId)
                        .filter(Objects::nonNull)
                        .map(nurseId -> {
                            try {
                                return Long.valueOf(nurseId);
                            } catch (NumberFormatException exception) {
                                return null;
                            }
                        })
                        .filter(Objects::nonNull)
                        .filter(nurseUserIds::contains)
                        .distinct()
                        .filter(nurseId -> existingAppointments.stream()
                                .noneMatch(existing ->
                                        nurseId.equals(existing.getNurseId())
                                                && appointmentDate.toString().equals(existing.getDate())
                                                && appointmentTime.equals(parseTime(existing.getTime()))
                                                && occupiesTimeSlot(existing.getStatus())
                                )
                        )
                        .sorted(Comparator
                                .comparingLong((Long nurseId) ->
                                        countAppointmentsOnDate(
                                                existingAppointments,
                                                nurseId,
                                                appointmentDate
                                        )
                                )
                                .thenComparingLong(nurseId ->
                                        countActiveAppointments(
                                                existingAppointments,
                                                nurseId
                                        )
                                )
                                .thenComparing(Comparator.naturalOrder()))
                        .toList();

        if (availableNurseIds.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No nurse is available for the selected date and time."
            );
        }

        return availableNurseIds.get(0);
    }

    private boolean isAvailableAt(
            NurseAvailability availability,
            DayOfWeek dayOfWeek,
            LocalTime appointmentTime) {

        boolean availableOnDay = switch (dayOfWeek) {
            case MONDAY -> availability.isMonday();
            case TUESDAY -> availability.isTuesday();
            case WEDNESDAY -> availability.isWednesday();
            case THURSDAY -> availability.isThursday();
            case FRIDAY -> availability.isFriday();
            case SATURDAY -> availability.isSaturday();
            case SUNDAY -> availability.isSunday();
        };

        LocalTime startTime = parseTime(availability.getStartTime());
        LocalTime endTime = parseTime(availability.getEndTime());

        return availableOnDay
                && startTime != null
                && endTime != null
                && !appointmentTime.isBefore(startTime)
                && appointmentTime.isBefore(endTime);
    }

    private LocalTime parseTime(String time) {
        if (time == null || time.isBlank()) {
            return null;
        }

        try {
            return LocalTime.parse(time);
        } catch (DateTimeParseException exception) {
            return null;
        }
    }

    private boolean occupiesTimeSlot(String status) {
        return !"CANCELLED".equalsIgnoreCase(status)
                && !"REJECTED".equalsIgnoreCase(status)
                && !"COMPLETED".equalsIgnoreCase(status);
    }

    private long countAppointmentsOnDate(
            List<Appointment> appointments,
            Long nurseId,
            LocalDate date) {

        return appointments.stream()
                .filter(appointment ->
                        nurseId.equals(appointment.getNurseId())
                                && date.toString().equals(appointment.getDate())
                                && occupiesTimeSlot(appointment.getStatus())
                )
                .count();
    }

    private long countActiveAppointments(
            List<Appointment> appointments,
            Long nurseId) {

        return appointments.stream()
                .filter(appointment ->
                        nurseId.equals(appointment.getNurseId())
                                && occupiesTimeSlot(appointment.getStatus())
                )
                .count();
    }

    // =====================================================
    // GET ALL APPOINTMENTS - ADMIN
    // =====================================================

    public List<Appointment> getAllAppointments() {

        List<Appointment> appointments =
                appointmentRepository.findAll();

        return addNamesToList(appointments);
    }

    // =====================================================
    // GET PATIENT APPOINTMENTS
    // =====================================================

    public List<Appointment> getPatientAppointments(
            Long patientId) {

        Patient patient = patientIdentityService.findByUserReference(patientId);
        Long resolvedPatientId = patient == null
                ? patientId
                : patient.getPatientId();
        List<Appointment> appointments =
                appointmentRepository.findByPatientId(resolvedPatientId);

        return addNamesToList(appointments);
    }

    // =====================================================
    // GET NURSE APPOINTMENTS
    // =====================================================

    public List<Appointment> getNurseAppointments(
            Long nurseId) {

        List<Appointment> appointments =
                appointmentRepository.findByNurseId(nurseId);

        return addNamesToList(appointments);
    }

    // =====================================================
    // GET NURSE PATIENTS
    // =====================================================

    public List<Patient> getNursePatients(Long nurseId) {

        if (nurseId == null) {
            throw new RuntimeException(
                    "Nurse ID is required"
            );
        }

        List<Appointment> appointments =
                appointmentRepository.findByNurseId(nurseId);

        List<Patient> patients =
                new ArrayList<>();

        for (Appointment appointment : appointments) {

            if (appointment.getPatientId() == null) {
                continue;
            }

            Patient patient = patientIdentityService.findForAppointment(
                    appointment.getPatientId()
            );

            if (patient == null) {
                continue;
            }

            // Avoid duplicate patients
            boolean alreadyExists =
                    patients.stream()
                            .anyMatch(existing ->
                                    existing.getPatientId()
                                            .equals(
                                                    patient.getPatientId()
                                            )
                            );

            if (!alreadyExists) {
                patients.add(patient);
            }
        }

        return patients;
    }

    // =====================================================
    // ACCEPT APPOINTMENT
    // =====================================================

    public Appointment acceptAppointment(
            Long appointmentId) {

        Appointment appointment =
                getAppointment(appointmentId);

        appointment.setStatus("ACCEPTED");

        Appointment updated =
                appointmentRepository.save(appointment);

        return addNames(updated);
    }

    // =====================================================
    // REJECT APPOINTMENT
    // =====================================================

    public Appointment rejectAppointment(
            Long appointmentId) {

        Appointment appointment =
                getAppointment(appointmentId);

        appointment.setStatus("REJECTED");

        Appointment updated =
                appointmentRepository.save(appointment);

        return addNames(updated);
    }

    // =====================================================
    // CANCEL APPOINTMENT
    // =====================================================

    public Appointment cancelAppointment(
            Long appointmentId) {

        Appointment appointment =
                getAppointment(appointmentId);

        appointment.setStatus("CANCELLED");

        Appointment updated =
                appointmentRepository.save(appointment);

        return addNames(updated);
    }

    // =====================================================
    // DELETE APPOINTMENT
    // =====================================================

    public void deleteAppointment(Long appointmentId) {

        if (!appointmentRepository.existsById(appointmentId)) {

            throw new RuntimeException(
                    "Appointment not found with id: "
                            + appointmentId
            );
        }

        appointmentRepository.deleteById(
                appointmentId
        );
    }

    // =====================================================
    // FIND APPOINTMENT
    // =====================================================

    private Appointment getAppointment(
            Long appointmentId) {

        return appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Appointment not found with id: "
                                        + appointmentId
                        )
                );
    }

    // =====================================================
    // ADD PATIENT NAME + NURSE NAME
    // =====================================================

    private Appointment addNames(
            Appointment appointment) {

        // -------------------------------------------------
        // PATIENT
        // -------------------------------------------------

        if (appointment.getPatientId() != null) {

            Patient patient = patientIdentityService.findForAppointment(
                    appointment.getPatientId()
            );

            if (patient != null) {
                appointment.setPatientName(
                        patient.getName()
                );

            } else {

                appointment.setPatientName(
                        "Unknown Patient"
                );
            }

        } else {

            appointment.setPatientName(
                    "Unknown Patient"
            );
        }

        // -------------------------------------------------
        // NURSE
        // -------------------------------------------------

        if (appointment.getNurseId() != null) {

            User nurse =
                    userRepository.findById(
                            appointment.getNurseId()
                    ).orElse(null);

            if (nurse != null) {

                appointment.setNurseName(
                        nurse.getName()
                );

            } else {

                appointment.setNurseName(
                        "Unknown Nurse"
                );
            }

        } else {

            appointment.setNurseName(
                    "Unknown Nurse"
            );
        }

        return appointment;
    }

    // =====================================================
    // ADD NAMES TO ALL APPOINTMENTS
    // =====================================================

    private List<Appointment> addNamesToList(
            List<Appointment> appointments) {

        for (Appointment appointment : appointments) {
            addNames(appointment);
        }

        return appointments;
    }
}