package com.homehealthcare.service;

import com.homehealthcare.entity.Appointment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class AppointmentEmailService {

    private static final Logger logger =
            LoggerFactory.getLogger(AppointmentEmailService.class);
    private static final DateTimeFormatter DISPLAY_TIME =
            DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH);

    private final JavaMailSender mailSender;

    public AppointmentEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendBookingEmails(
            Appointment appointment,
            String patientEmail,
            String patientName,
            String nurseEmail,
            String nurseName) {
        sendPatientConfirmation(
                appointment,
                patientEmail,
                patientName,
                nurseName
        );
        sendNurseAssignment(
                appointment,
                nurseEmail,
                nurseName
        );
    }

    private void sendPatientConfirmation(
            Appointment appointment,
            String patientEmail,
            String patientName,
            String nurseName) {
        if (patientEmail == null || patientEmail.isBlank()) {
            logger.error("Cannot email appointment confirmation {}: patient email is unavailable",
                    appointment.getId());
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(patientEmail);
        message.setSubject("CareNest appointment confirmation");
        message.setText("Hello "
                + safeName(patientName, "Patient")
                + ",\n\nYour appointment has been booked successfully.\n\n"
                + "Appointment ID: " + appointment.getId() + "\n"
                + "Service: " + appointment.getService() + "\n"
                + "Nurse: " + safeName(nurseName, "Your assigned nurse") + "\n"
                + "Date: " + appointment.getDate() + "\n"
                + "Time: " + LocalTime.parse(appointment.getTime())
                        .format(DISPLAY_TIME) + "\n"
                + "Status: " + appointment.getStatus() + "\n\n"
                + "CareNest Team");

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            logger.error("Appointment {} was booked, but the confirmation email could not be sent",
                    appointment.getId(), exception);
        }
    }

    private void sendNurseAssignment(
            Appointment appointment,
            String nurseEmail,
            String nurseName) {
        if (nurseEmail == null || nurseEmail.isBlank()) {
            logger.error("Cannot email appointment assignment for appointment {}: assigned nurse email is unavailable",
                    appointment.getId());
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(nurseEmail);
        message.setSubject("New CareNest appointment assigned to you");
        message.setText("Hello "
                + safeName(nurseName, "Nurse")
                + ",\n\nA new patient appointment has been assigned to you.\n\n"
                + "Patient: " + safeName(appointment.getPatientName(), "Patient") + "\n"
                + "Service: " + appointment.getService() + "\n"
                + "Date: " + appointment.getDate() + "\n"
                + "Time: " + LocalTime.parse(appointment.getTime())
                        .format(DISPLAY_TIME) + "\n"
                + "Status: " + appointment.getStatus() + "\n\n"
                + "Please log in to CareNest to review the appointment.\n\n"
                + "CareNest Team");

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            logger.error("Appointment {} was booked, but the assignment email could not be sent to nurse {}",
                    appointment.getId(), appointment.getNurseId(), exception);
        }
    }

    private String safeName(String name, String fallback) {
        return name == null || name.isBlank() ? fallback : name;
    }
}
