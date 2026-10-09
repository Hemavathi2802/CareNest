package com.homehealthcare.service;

import com.homehealthcare.entity.Appointment;
import com.homehealthcare.entity.NurseAvailability;
import com.homehealthcare.entity.NurseNotification;
import com.homehealthcare.entity.Patient;
import com.homehealthcare.entity.User;
import com.homehealthcare.repository.AppointmentRepository;
import com.homehealthcare.repository.NurseAvailabilityRepository;
import com.homehealthcare.repository.NurseNotificationRepository;
import com.homehealthcare.repository.PatientRepository;
import com.homehealthcare.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AppointmentServiceTest {

    private AppointmentRepository appointmentRepository;
    private NurseAvailabilityRepository nurseAvailabilityRepository;
    private PatientRepository patientRepository;
    private NurseNotificationRepository nurseNotificationRepository;
    private UserRepository userRepository;
    private JavaMailSender mailSender;
    private AppointmentService appointmentService;
    private final Map<Long, User> nurseUsers = new HashMap<>();

    @BeforeEach
    void setUp() {
        appointmentRepository = mock(AppointmentRepository.class);
        nurseAvailabilityRepository = mock(NurseAvailabilityRepository.class);
        patientRepository = mock(PatientRepository.class);
        nurseNotificationRepository = mock(NurseNotificationRepository.class);
        userRepository = mock(UserRepository.class);
        mailSender = mock(JavaMailSender.class);
        PatientIdentityService patientIdentityService =
                new PatientIdentityService(patientRepository, userRepository);
        appointmentService = new AppointmentService(
                appointmentRepository,
                nurseAvailabilityRepository,
                userRepository,
                patientIdentityService,
                nurseNotificationRepository,
                new AppointmentEmailService(mailSender)
        );

        when(appointmentRepository.findAll()).thenReturn(List.of());
        when(appointmentRepository.save(any(Appointment.class)))
                .thenAnswer(invocation -> {
                    Appointment appointment = invocation.getArgument(0);
                    if (appointment.getId() == null) {
                        appointment.setId(123L);
                    }
                    return appointment;
                });
        when(nurseNotificationRepository.existsByAppointmentId(anyLong()))
                .thenReturn(false);
        when(userRepository.findNursesForAppointmentAssignment("NURSE"))
                .thenReturn(List.of());
        when(userRepository.findById(anyLong()))
                .thenAnswer(invocation ->
                        Optional.ofNullable(nurseUsers.get(invocation.getArgument(0))));
        User patientUser = new User();
        patientUser.setId(1L);
        patientUser.setRole("PATIENT");
        when(userRepository.findById(1L)).thenReturn(Optional.of(patientUser));
        Patient patient = new Patient();
        patient.setPatientId(1L);
        patient.setUserId(1L);
        when(patientRepository.findByUserId(1L)).thenReturn(Optional.of(patient));
        when(patientRepository.findById(1L)).thenReturn(Optional.of(patient));
    }

    @Test
    void resolvesPatientFromCanonicalPatientId() {
        Appointment appointment = new Appointment();
        appointment.setId(123L);
        appointment.setPatientId(2L);
        appointment.setNurseId(11L);
        appointment.setService("Nursing Care");
        appointment.setDate("2026-10-09");
        appointment.setTime("11:30");
        Patient patient = new Patient();
        patient.setPatientId(2L);
        patient.setUserId(51L);
        patient.setName("Patient One");
        when(patientRepository.findById(2L)).thenReturn(Optional.of(patient));
        nurseUsers.put(11L, nurseUser(11L));
        when(appointmentRepository.findByNurseId(11L))
                .thenReturn(List.of(appointment));

        List<Appointment> result =
                appointmentService.getNurseAppointments(11L);

        assertEquals(2L, result.get(0).getPatientId());
        assertEquals("Patient One", result.get(0).getPatientName());
        verify(appointmentRepository, org.mockito.Mockito.never()).save(appointment);
    }

    @Test
    void emailsAssignedNurseWithAppointmentDetails() {
        User nurse = nurseUser(11L);
        nurse.setName("Nurse One");
        nurse.setEmail("nurse@example.com");
        when(userRepository.findNursesForAppointmentAssignment("NURSE"))
                .thenReturn(List.of(nurse));
        when(nurseAvailabilityRepository.findAll())
                .thenReturn(List.of(availability("11", true, "09:00", "17:00")));

        Appointment result = appointmentService.createAppointment(
                appointmentRequest("2026-10-05", "10:00")
        );

        ArgumentCaptor<SimpleMailMessage> mailCaptor =
                ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(mailCaptor.capture());
        SimpleMailMessage sentMail = mailCaptor.getValue();

        assertEquals("nurse@example.com", sentMail.getTo()[0]);
        assertEquals(
                "New CareNest appointment assigned to you",
                sentMail.getSubject()
        );
        assertTrue(sentMail.getText().contains("Nursing Care"));
        assertTrue(sentMail.getText().contains("2026-10-05"));
        assertTrue(sentMail.getText().contains("10:00"));
        assertTrue(sentMail.getText().contains("10:00 AM"));
        assertEquals(11L, result.getNurseId());
        ArgumentCaptor<NurseNotification> notificationCaptor =
                ArgumentCaptor.forClass(NurseNotification.class);
        verify(nurseNotificationRepository).save(notificationCaptor.capture());
        assertEquals(11L, notificationCaptor.getValue().getNurseId());
        assertEquals(123L, notificationCaptor.getValue().getAppointmentId());
        assertTrue(notificationCaptor.getValue().getMessage()
                .contains("Nursing Care"));
        assertTrue(notificationCaptor.getValue().getMessage()
                .contains("10:00 AM"));
    }

    @Test
    void emailsPatientConfirmationAndNurseAssignmentWithAppointmentDetails() {
        User patient = new User();
        patient.setId(1L);
        patient.setName("Patient One");
        patient.setRole("PATIENT");
        patient.setEmail("patient@example.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(patient));
        Patient patientProfile = new Patient();
        patientProfile.setPatientId(1L);
        patientProfile.setUserId(1L);
        patientProfile.setName("Patient One");
        when(patientRepository.findByUserId(1L))
                .thenReturn(Optional.of(patientProfile));
        when(patientRepository.findById(1L))
                .thenReturn(Optional.of(patientProfile));

        User nurse = nurseUser(11L);
        nurse.setName("Nurse One");
        nurse.setEmail("nurse@example.com");
        when(userRepository.findNursesForAppointmentAssignment("NURSE"))
                .thenReturn(List.of(nurse));
        when(nurseAvailabilityRepository.findAll())
                .thenReturn(List.of(availability("11", true, "09:00", "17:00")));

        appointmentService.createAppointment(
                appointmentRequest("2026-10-05", "10:00")
        );

        ArgumentCaptor<SimpleMailMessage> mailCaptor =
                ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender, times(2)).send(mailCaptor.capture());

        List<SimpleMailMessage> sentMails = mailCaptor.getAllValues();
        SimpleMailMessage patientMail = sentMails.stream()
                .filter(message -> "patient@example.com".equals(message.getTo()[0]))
                .findFirst()
                .orElseThrow();
        SimpleMailMessage nurseMail = sentMails.stream()
                .filter(message -> "nurse@example.com".equals(message.getTo()[0]))
                .findFirst()
                .orElseThrow();

        assertEquals(
                "CareNest appointment confirmation",
                patientMail.getSubject()
        );
        assertTrue(patientMail.getText().contains("booked successfully"));
        assertTrue(patientMail.getText().contains("Nurse: Nurse One"));
        assertTrue(patientMail.getText().contains("Nursing Care"));
        assertTrue(patientMail.getText().contains("2026-10-05"));
        assertTrue(patientMail.getText().contains("10:00"));
        assertTrue(patientMail.getText().contains("10:00 AM"));
        assertTrue(nurseMail.getText().contains("Patient: Patient One"));
        assertTrue(nurseMail.getText().contains("Nursing Care"));
        assertTrue(nurseMail.getText().contains("2026-10-05"));
        assertTrue(nurseMail.getText().contains("10:00"));
        assertTrue(nurseMail.getText().contains("10:00 AM"));
    }

    @Test
    void bookingSucceedsWhenNurseAssignmentEmailFails() {
        User nurse = nurseUser(11L);
        nurse.setEmail("nurse@example.com");
        when(userRepository.findNursesForAppointmentAssignment("NURSE"))
                .thenReturn(List.of(nurse));
        when(nurseAvailabilityRepository.findAll())
                .thenReturn(List.of(availability("11", true, "09:00", "17:00")));
        doThrow(new MailSendException("SMTP unavailable"))
                .when(mailSender).send(any(SimpleMailMessage.class));

        Appointment result = appointmentService.createAppointment(
                appointmentRequest("2026-10-05", "10:00")
        );

        assertEquals(11L, result.getNurseId());
        assertEquals("PENDING", result.getStatus());
        verify(nurseNotificationRepository).save(any(NurseNotification.class));
    }

    @Test
    void assignsNurseAvailableOnRequestedDayAndTimeInsteadOfClientNurseId() {
        when(userRepository.findNursesForAppointmentAssignment("NURSE"))
                .thenReturn(List.of(nurseUser(11L)));
        when(nurseAvailabilityRepository.findAll())
                .thenReturn(List.of(availability("11", true, "09:00", "17:00")));

        Appointment appointment = appointmentRequest("2026-10-05", "10:00");
        appointment.setNurseId(999L);
        appointment.setStatus("ACCEPTED");

        Appointment result = appointmentService.createAppointment(appointment);

        assertEquals(11L, result.getNurseId());
        assertEquals("PENDING", result.getStatus());
    }

    @Test
    void convertsLoggedInUserIdToPatientProfileIdWhenBooking() {
        User secondPatientUser = new User();
        secondPatientUser.setId(2L);
        secondPatientUser.setRole("PATIENT");
        when(userRepository.findById(2L))
                .thenReturn(Optional.of(secondPatientUser));

        Patient patientProfile = new Patient();
        patientProfile.setPatientId(42L);
        patientProfile.setUserId(2L);
        patientProfile.setName("Patient Two");
        when(patientRepository.findByUserId(2L))
                .thenReturn(Optional.of(patientProfile));
        when(patientRepository.findById(42L))
                .thenReturn(Optional.of(patientProfile));

        when(userRepository.findNursesForAppointmentAssignment("NURSE"))
                .thenReturn(List.of(nurseUser(11L)));
        when(nurseAvailabilityRepository.findAll())
                .thenReturn(List.of(availability("11", true, "09:00", "17:00")));

        Appointment request = appointmentRequest("2026-10-05", "10:00");
        request.setPatientId(2L);

        Appointment result = appointmentService.createAppointment(request);

        assertEquals(42L, result.getPatientId());
        assertEquals("Patient Two", result.getPatientName());
    }

    @Test
    void skipsNurseAlreadyBookedForTheSelectedDateAndTime() {
        when(userRepository.findNursesForAppointmentAssignment("NURSE"))
                .thenReturn(List.of(nurseUser(11L), nurseUser(12L)));
        when(nurseAvailabilityRepository.findAll())
                .thenReturn(List.of(
                        availability("11", true, "09:00", "17:00"),
                        availability("12", true, "09:00", "17:00")
                ));

        Appointment existingAppointment =
                appointmentRequest("2026-10-05", "10:00");
        existingAppointment.setNurseId(11L);
        existingAppointment.setStatus("PENDING");
        when(appointmentRepository.findAll())
                .thenReturn(List.of(existingAppointment));

        Appointment result = appointmentService.createAppointment(
                appointmentRequest("2026-10-05", "10:00")
        );

        assertEquals(12L, result.getNurseId());
    }

    @Test
    void assignsDifferentNursesToSequentialBookingsForTheSameSlot() {
        when(userRepository.findNursesForAppointmentAssignment("NURSE"))
                .thenReturn(List.of(nurseUser(11L), nurseUser(12L)));
        when(nurseAvailabilityRepository.findAll())
                .thenReturn(List.of(
                        availability("11", true, "09:00", "17:00"),
                        availability("12", true, "09:00", "17:00")
                ));

        List<Appointment> savedAppointments = new ArrayList<>();
        when(appointmentRepository.findAll())
                .thenAnswer(invocation -> List.copyOf(savedAppointments));
        when(appointmentRepository.save(any(Appointment.class)))
                .thenAnswer(invocation -> {
                    Appointment saved = invocation.getArgument(0);
                    savedAppointments.add(saved);
                    return saved;
                });

        Appointment first = appointmentService.createAppointment(
                appointmentRequest("2026-10-05", "10:00")
        );
        Appointment second = appointmentService.createAppointment(
                appointmentRequest("2026-10-05", "10:00")
        );

        assertEquals(11L, first.getNurseId());
        assertEquals(12L, second.getNurseId());
    }

    @Test
    void doesNotBlockTimeSlotForCompletedAppointment() {
        when(userRepository.findNursesForAppointmentAssignment("NURSE"))
                .thenReturn(List.of(nurseUser(11L)));
        when(nurseAvailabilityRepository.findAll())
                .thenReturn(List.of(availability("11", true, "09:00", "17:00")));

        Appointment completedAppointment =
                appointmentRequest("2026-10-05", "10:00");
        completedAppointment.setNurseId(11L);
        completedAppointment.setStatus("COMPLETED");
        when(appointmentRepository.findAll())
                .thenReturn(List.of(completedAppointment));

        Appointment result = appointmentService.createAppointment(
                appointmentRequest("2026-10-05", "10:00")
        );

        assertEquals(11L, result.getNurseId());
    }

    @Test
    void balancesAssignmentsAcrossNursesForDifferentDates() {
        when(userRepository.findNursesForAppointmentAssignment("NURSE"))
                .thenReturn(List.of(nurseUser(11L), nurseUser(12L)));
        when(nurseAvailabilityRepository.findAll())
                .thenReturn(List.of(
                        availability("11", true, "09:00", "17:00"),
                        availability("12", true, "09:00", "17:00")
                ));

        Appointment existingAppointment =
                appointmentRequest("2026-10-06", "10:00");
        existingAppointment.setNurseId(11L);
        existingAppointment.setStatus("PENDING");
        when(appointmentRepository.findAll())
                .thenReturn(List.of(existingAppointment));

        Appointment result = appointmentService.createAppointment(
                appointmentRequest("2026-10-05", "10:00")
        );

        assertEquals(12L, result.getNurseId());
    }

    @Test
    void prefersNurseWithFewerAppointmentsOnSelectedDateOverLowerOverallLoad() {
        when(userRepository.findNursesForAppointmentAssignment("NURSE"))
                .thenReturn(List.of(nurseUser(11L), nurseUser(12L)));
        when(nurseAvailabilityRepository.findAll())
                .thenReturn(List.of(
                        availability("11", true, "09:00", "17:00"),
                        availability("12", true, "09:00", "17:00")
                ));

        Appointment nurse11SameDay =
                appointmentRequest("2026-10-05", "11:00");
        nurse11SameDay.setNurseId(11L);
        nurse11SameDay.setStatus("PENDING");

        Appointment nurse12OtherDay1 =
                appointmentRequest("2026-10-06", "11:00");
        nurse12OtherDay1.setNurseId(12L);
        nurse12OtherDay1.setStatus("PENDING");

        Appointment nurse12OtherDay2 =
                appointmentRequest("2026-10-07", "11:00");
        nurse12OtherDay2.setNurseId(12L);
        nurse12OtherDay2.setStatus("PENDING");

        when(appointmentRepository.findAll())
                .thenReturn(List.of(
                        nurse11SameDay,
                        nurse12OtherDay1,
                        nurse12OtherDay2
                ));

        Appointment result = appointmentService.createAppointment(
                appointmentRequest("2026-10-05", "10:00")
        );

        assertEquals(12L, result.getNurseId());
    }

    @Test
    void rejectsBookingWhenNoNurseIsAvailableOnRequestedWeekday() {
        when(userRepository.findNursesForAppointmentAssignment("NURSE"))
                .thenReturn(List.of(nurseUser(11L)));
        when(nurseAvailabilityRepository.findAll())
                .thenReturn(List.of(availability("11", false, "09:00", "17:00")));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> appointmentService.createAppointment(
                        appointmentRequest("2026-10-05", "10:00")
                )
        );

        assertEquals(409, exception.getStatusCode().value());
    }

    private Appointment appointmentRequest(String date, String time) {
        Appointment appointment = new Appointment();
        appointment.setPatientId(1L);
        appointment.setService("Nursing Care");
        appointment.setDate(date);
        appointment.setTime(time);
        return appointment;
    }

    private NurseAvailability availability(
            String nurseId,
            boolean monday,
            String startTime,
            String endTime) {

        NurseAvailability availability = new NurseAvailability();
        availability.setNurseId(nurseId);
        availability.setMonday(monday);
        availability.setStartTime(startTime);
        availability.setEndTime(endTime);
        return availability;
    }

    private User nurseUser(Long id) {
        User user = new User();
        user.setId(id);
        user.setRole("NURSE");
        nurseUsers.put(id, user);
        return user;
    }
}
