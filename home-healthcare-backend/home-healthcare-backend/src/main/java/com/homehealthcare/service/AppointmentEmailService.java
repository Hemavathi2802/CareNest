
package com.homehealthcare.service;

import com.homehealthcare.entity.Appointment;
import com.homehealthcare.entity.Patient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private final BrevoEmailService brevoEmailService;

    public AppointmentEmailService(BrevoEmailService brevoEmailService) {
        this.brevoEmailService = brevoEmailService;
    }

    @Async
    public void sendBookingEmails(
            Appointment appointment,
            Patient patient,
            String patientEmail,
            String patientName,
            String nurseEmail,
            String nurseName) {

        String time = appointment.getTime();

        try {
            time = LocalTime.parse(time).format(DISPLAY_TIME);
        } catch (Exception exception) {
            logger.warn("Could not format appointment time: {}", time);
        }

        if (patientEmail != null && !patientEmail.isBlank()) {
            try {
                String patientMessage =
                        "Hello " + safeName(patientName, "Patient") + ",\n\n"
                        + "Your CareNest appointment has been booked successfully.\n\n"
                        + "Appointment ID: " + appointment.getId() + "\n"
                        + "Service: " + safeName(appointment.getService(), "Not specified") + "\n"
                        + "Nurse: " + safeName(nurseName, "Your assigned nurse") + "\n"
                        + "Date: " + safeName(appointment.getDate(), "Not specified") + "\n"
                        + "Time: " + time + "\n"
                        + "Status: " + safeName(appointment.getStatus(), "PENDING") + "\n\n"
                        + "CareNest Team";

                brevoEmailService.send(
                        patientEmail,
                        "CareNest appointment confirmation",
                        patientMessage
                );

                logger.info(
                        "Appointment confirmation email submitted to Brevo for appointment {}",
                        appointment.getId()
                );

            } catch (RuntimeException exception) {
                logger.error(
                        "Failed to send patient appointment email for appointment {}",
                        appointment.getId(),
                        exception
                );
            }
        } else {
            logger.warn(
                    "Patient email is unavailable for appointment {}",
                    appointment.getId()
            );
        }

        if (nurseEmail != null && !nurseEmail.isBlank()) {
            try {
                String patientDetails = patient == null
                        ? "Patient details are unavailable.\n"
                        : "Patient Name: " + safeName(patient.getName(), "Not provided") + "\n"
                        + "Age: " + patient.getAge() + "\n"
                        + "Gender: " + safeName(patient.getGender(), "Not provided") + "\n"
                        + "Phone: " + safeName(patient.getPhone(), "Not provided") + "\n"
                        + "Address: " + safeName(patient.getAddress(), "Not provided") + "\n";

                String nurseMessage =
                        "Hello " + safeName(nurseName, "Nurse") + ",\n\n"
                        + "A patient has booked an appointment with you through CareNest.\n\n"
                        + "APPOINTMENT DETAILS\n"
                        + "Appointment ID: " + appointment.getId() + "\n"
                        + "Service: " + safeName(appointment.getService(), "Not specified") + "\n"
                        + "Date: " + safeName(appointment.getDate(), "Not specified") + "\n"
                        + "Time: " + time + "\n"
                        + "Status: " + safeName(appointment.getStatus(), "PENDING") + "\n\n"
                        + "PATIENT DETAILS\n"
                        + patientDetails
                        + "Reason / Notes: "
                        + safeName(appointment.getNotes(), "Not provided") + "\n\n"
                        + "Please log in to CareNest to review the appointment.\n\n"
                        + "CareNest Team";

                brevoEmailService.send(
                        nurseEmail,
                        "New Patient Appointment - CareNest",
                        nurseMessage
                );

                logger.info(
                        "Appointment assignment email submitted to Brevo for appointment {}",
                        appointment.getId()
                );

            } catch (RuntimeException exception) {
                logger.error(
                        "Failed to send nurse appointment email for appointment {}",
                        appointment.getId(),
                        exception
                );
            }
        } else {
            logger.warn(
                    "Nurse email is unavailable for appointment {}",
                    appointment.getId()
            );
        }
    }

    @Async
    public void sendPatientUpdateEmail(
            Appointment appointment,
            String patientEmail,
            String patientName,
            String updateMessage) {

        if (patientEmail == null || patientEmail.isBlank()) {
            logger.warn(
                    "Cannot send appointment update email for appointment {}: patient email is unavailable",
                    appointment.getId()
            );
            return;
        }

        String time = appointment.getTime();
        try {
            time = LocalTime.parse(time).format(DISPLAY_TIME);
        } catch (Exception exception) {
            logger.warn("Could not format appointment time: {}", time);
        }

        String body = "Hello " + safeName(patientName, "Patient") + ",\n\n"
                + updateMessage + "\n\n"
                + "Appointment ID: " + appointment.getId() + "\n"
                + "Service: " + safeName(appointment.getService(), "Not specified") + "\n"
                + "Date: " + safeName(appointment.getDate(), "Not specified") + "\n"
                + "Time: " + time + "\n"
                + "Status: " + safeName(appointment.getStatus(), "UPDATED") + "\n\n"
                + "Sign in to CareNest to view your appointment details.\n\n"
                + "CareNest Team";

        try {
            brevoEmailService.send(
                    patientEmail,
                    "CareNest appointment update",
                    body
            );
            logger.info(
                    "Appointment update email submitted to Brevo for appointment {}",
                    appointment.getId()
            );
        } catch (RuntimeException exception) {
            logger.error(
                    "Failed to send appointment update email for appointment {}",
                    appointment.getId(),
                    exception
            );
        }
    }

    private String safeName(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
