
package com.homehealthcare.service;

import com.homehealthcare.entity.Appointment;
import com.homehealthcare.entity.Patient;
import com.homehealthcare.entity.PatientNotification;
import com.homehealthcare.entity.User;
import com.homehealthcare.repository.AppointmentRepository;
import com.homehealthcare.repository.PatientNotificationRepository;
import com.homehealthcare.repository.PatientRepository;
import com.homehealthcare.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PatientNotificationServiceTest {

    private AppointmentRepository appointmentRepository;
    private PatientNotificationRepository notificationRepository;
    private PatientRepository patientRepository;
    private UserRepository userRepository;
    private BrevoEmailService brevoEmailService;
    private PatientNotificationService notificationService;

    @BeforeEach
    void setUp() {
        appointmentRepository = mock(AppointmentRepository.class);
        notificationRepository = mock(PatientNotificationRepository.class);
        patientRepository = mock(PatientRepository.class);
        userRepository = mock(UserRepository.class);
        brevoEmailService = mock(BrevoEmailService.class);

        PatientIdentityService patientIdentityService =
                new PatientIdentityService(patientRepository, userRepository);

        notificationService = new PatientNotificationService(
                appointmentRepository,
                notificationRepository,
                userRepository,
                brevoEmailService,
                patientIdentityService
        );
    }

    @Test
    void emailsAndStoresNotificationForUpcomingActiveAppointment() {
        Appointment appointment = appointmentInNextTwelveHours("ACCEPTED");

        Patient patient = new Patient();
        patient.setUserId(101L);
        patient.setName("Test Patient");

        User user = new User();
        user.setEmail("patient@example.com");

        when(appointmentRepository.findByReminderSentFalse())
                .thenReturn(List.of(appointment));
        when(patientRepository.findById(appointment.getPatientId()))
                .thenReturn(Optional.of(patient));
        when(userRepository.findById(101L)).thenReturn(Optional.of(user));
        when(notificationRepository.existsByAppointmentId(appointment.getId()))
                .thenReturn(false);
        when(notificationRepository.save(any(PatientNotification.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        notificationService.sendDueAppointmentReminders();

        ArgumentCaptor<String> bodyCaptor =
                ArgumentCaptor.forClass(String.class);

        verify(brevoEmailService).send(
                eq("patient@example.com"),
                eq("CareNest appointment reminder"),
                bodyCaptor.capture()
        );

        String emailBody = bodyCaptor.getValue();

        assertTrue(emailBody.contains("Test Patient"));
        assertTrue(emailBody.matches("(?s).* at \\d{1,2}:\\d{2} [AP]M.*"));

        String formattedTime = LocalDateTime.parse(
                appointment.getDate() + "T" + appointment.getTime()
        ).format(DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH));

        assertTrue(emailBody.contains(" at " + formattedTime));

        verify(notificationRepository).save(argThat(notification ->
                notification.getPatientId().equals(appointment.getPatientId())
                        && notification.getAppointmentId().equals(appointment.getId())
                        && notification.getMessage().contains("Nursing Care")
                        && notification.getMessage().matches(
                                "(?s).* at \\d{1,2}:\\d{2} [AP]M.*"
                        )
        ));

        verify(appointmentRepository).save(appointment);
        assertTrue(appointment.isReminderSent());
    }

    @Test
    void keepsInAppNotificationWhenReminderEmailFails() {
        Appointment appointment = appointmentInNextTwelveHours("PENDING");

        Patient patient = new Patient();
        patient.setUserId(101L);

        User user = new User();
        user.setEmail("patient@example.com");

        when(appointmentRepository.findByReminderSentFalse())
                .thenReturn(List.of(appointment));
        when(patientRepository.findById(appointment.getPatientId()))
                .thenReturn(Optional.of(patient));
        when(userRepository.findById(101L)).thenReturn(Optional.of(user));
        when(notificationRepository.existsByAppointmentId(appointment.getId()))
                .thenReturn(false);
        when(notificationRepository.save(any(PatientNotification.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        doThrow(new IllegalStateException("Brevo email failed"))
                .when(brevoEmailService)
                .send(any(String.class), any(String.class), any(String.class));

        notificationService.sendDueAppointmentReminders();

        verify(notificationRepository).save(any(PatientNotification.class));
        verify(appointmentRepository, never()).save(appointment);
        assertFalse(appointment.isReminderSent());
    }

    @Test
    void skipsCancelledAppointments() {
        Appointment appointment = appointmentInNextTwelveHours("CANCELLED");

        when(appointmentRepository.findByReminderSentFalse())
                .thenReturn(List.of(appointment));

        notificationService.sendDueAppointmentReminders();

        verifyNoInteractions(brevoEmailService, notificationRepository);
        verify(appointmentRepository, never()).save(appointment);
    }

    @Test
    void formatsAmPmInPreviouslySavedPatientReminderNotifications() {
        Patient patient = new Patient();
        patient.setPatientId(9L);
        patient.setUserId(101L);

        PatientNotification notification = new PatientNotification();
        notification.setMessage(
                "Reminder: your Nursing Care on 09 Oct 2026 at 11:30 appointment is coming up."
        );

        when(patientRepository.findByUserId(101L))
                .thenReturn(Optional.of(patient));
        when(notificationRepository.findByPatientIdOrderByCreatedAtDesc(9L))
                .thenReturn(List.of(notification));

        List<PatientNotification> result =
                notificationService.getPatientNotifications(101L);

        assertEquals(
                "Reminder: your Nursing Care on 09 Oct 2026 at 11:30 AM appointment is coming up.",
                result.get(0).getMessage()
        );
    }

    @Test
    void preservesAmPmInPatientReminderNotifications() {
        Patient patient = new Patient();
        patient.setPatientId(9L);
        patient.setUserId(101L);

        PatientNotification notification = new PatientNotification();
        notification.setMessage(
                "Reminder: your Post-Surgery Care on 09 Oct 2026 at 11:30 PM appointment is coming up."
        );

        when(patientRepository.findByUserId(101L))
                .thenReturn(Optional.of(patient));
        when(notificationRepository.findByPatientIdOrderByCreatedAtDesc(9L))
                .thenReturn(List.of(notification));

        List<PatientNotification> result =
                notificationService.getPatientNotifications(101L);

        assertEquals(
                "Reminder: your Post-Surgery Care on 09 Oct 2026 at 11:30 PM appointment is coming up.",
                result.get(0).getMessage()
        );
    }

    private Appointment appointmentInNextTwelveHours(String status) {
        LocalDateTime appointmentTime = LocalDateTime.now()
                .plusHours(12)
                .withSecond(0)
                .withNano(0);

        Appointment appointment = new Appointment();
        appointment.setId(55L);
        appointment.setPatientId(9L);
        appointment.setService("Nursing Care");
        appointment.setDate(appointmentTime.toLocalDate().toString());
        appointment.setTime(
                appointmentTime.toLocalTime()
                        .format(DateTimeFormatter.ISO_LOCAL_TIME)
        );
        appointment.setStatus(status);

        return appointment;
    }
}
