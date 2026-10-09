package com.homehealthcare.service;

import com.homehealthcare.entity.Appointment;
import com.homehealthcare.entity.Patient;
import com.homehealthcare.entity.PatientNotification;
import com.homehealthcare.entity.User;
import com.homehealthcare.repository.AppointmentRepository;
import com.homehealthcare.repository.PatientNotificationRepository;
import com.homehealthcare.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PatientNotificationService {

    private static final Logger logger =
            LoggerFactory.getLogger(PatientNotificationService.class);
    private static final DateTimeFormatter DISPLAY_DATE =
            DateTimeFormatter.ofPattern("dd MMM yyyy");
    private static final DateTimeFormatter DISPLAY_TIME =
            DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH);
    private static final Pattern REMINDER_TIME =
            Pattern.compile("\\bat (\\d{1,2}:\\d{2})(?= appointment)");

    private final AppointmentRepository appointmentRepository;
    private final PatientNotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final PatientIdentityService patientIdentityService;

    public PatientNotificationService(
            AppointmentRepository appointmentRepository,
            PatientNotificationRepository notificationRepository,
            UserRepository userRepository,
            JavaMailSender mailSender,
            PatientIdentityService patientIdentityService) {
        this.appointmentRepository = appointmentRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
        this.patientIdentityService = patientIdentityService;
    }

    @Scheduled(fixedDelayString = "${app.notifications.poll-delay-ms:60000}")
    @Transactional
    public void sendDueAppointmentReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime reminderWindowStart = now.plusHours(24);

        for (Appointment appointment : appointmentRepository.findByReminderSentFalse()) {
            if (appointment.isReminderSent()
                    || !isActive(appointment.getStatus())) {
                continue;
            }

            LocalDateTime appointmentDateTime;
            try {
                appointmentDateTime = LocalDate.parse(appointment.getDate())
                        .atTime(LocalTime.parse(appointment.getTime()));
            } catch (DateTimeParseException | NullPointerException exception) {
                logger.warn("Skipping reminder for appointment {} because its date or time is invalid",
                        appointment.getId(), exception);
                continue;
            }

            if (!appointmentDateTime.isAfter(now)
                    || appointmentDateTime.isAfter(reminderWindowStart)) {
                continue;
            }

            try {
                sendReminder(appointment, appointmentDateTime);
            } catch (MailException exception) {
                logger.error("Unable to send reminder email for appointment {}",
                        appointment.getId(), exception);
            }
        }
    }

    private void sendReminder(
            Appointment appointment,
            LocalDateTime appointmentDateTime) {
        Patient patient = patientIdentityService.findForAppointment(
                appointment.getPatientId()
        );
        User user = patient == null || patient.getUserId() == null
                ? null
                : userRepository.findById(patient.getUserId()).orElse(null);

        String patientName = patient == null || patient.getName() == null
                ? "there"
                : patient.getName();
        String appointmentDetails = appointment.getService() + " on "
                + appointmentDateTime.format(DISPLAY_DATE) + " at "
                + appointmentDateTime.toLocalTime().format(DISPLAY_TIME);
        String reminderMessage = "Reminder: your " + appointmentDetails
                + " appointment is coming up.";

        if (!notificationRepository.existsByAppointmentId(appointment.getId())) {
            PatientNotification notification = new PatientNotification();
            notification.setPatientId(appointment.getPatientId());
            notification.setAppointmentId(appointment.getId());
            notification.setMessage(reminderMessage);
            notification.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }

        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            logger.error("Cannot email appointment reminder {}: patient email is unavailable",
                    appointment.getId());
            return;
        }

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(user.getEmail());
        email.setSubject("CareNest appointment reminder");
        email.setText("Hello " + patientName + ",\n\n"
                + reminderMessage + "\n\n"
                + "Please open CareNest to view your appointment details.\n\n"
                + "CareNest Team");
        mailSender.send(email);
        appointment.setReminderSent(true);
        appointmentRepository.save(appointment);
    }

    private boolean isActive(String status) {
        return !"CANCELLED".equalsIgnoreCase(status)
                && !"REJECTED".equalsIgnoreCase(status)
                && !"COMPLETED".equalsIgnoreCase(status);
    }

    @Transactional(readOnly = true)
    public List<PatientNotification> getPatientNotifications(Long patientId) {
        Patient patient = patientIdentityService.findByUserReference(patientId);
        Long resolvedPatientId = patient == null
                ? patientId
                : patient.getPatientId();
        return notificationRepository.findByPatientIdOrderByCreatedAtDesc(
                        resolvedPatientId
                ).stream()
                .map(this::formatReminderTime)
                .toList();
    }

    @Transactional
    public PatientNotification markAsRead(Long patientId, Long notificationId) {
        Patient patient = patientIdentityService.findByUserReference(patientId);
        Long resolvedPatientId = patient == null
                ? patientId
                : patient.getPatientId();
        PatientNotification notification = notificationRepository
                .findByIdAndPatientId(notificationId, resolvedPatientId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Notification not found."
                ));
        notification.setRead(true);
        return formatReminderTime(notificationRepository.save(notification));
    }

    private PatientNotification formatReminderTime(
            PatientNotification notification) {
        String message = notification.getMessage();
        if (message == null) {
            return notification;
        }

        Matcher matcher = REMINDER_TIME.matcher(message);
        if (!matcher.find()) {
            return notification;
        }

        try {
            String formattedTime = LocalTime.parse(matcher.group(1))
                    .format(DISPLAY_TIME);
            notification.setMessage(
                    matcher.replaceFirst(
                            Matcher.quoteReplacement("at " + formattedTime)
                    )
            );
        } catch (DateTimeParseException exception) {
            return notification;
        }

        return notification;
    }
}
