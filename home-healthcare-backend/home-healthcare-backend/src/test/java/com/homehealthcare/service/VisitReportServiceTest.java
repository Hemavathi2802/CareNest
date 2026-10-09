package com.homehealthcare.service;

import com.homehealthcare.entity.Appointment;
import com.homehealthcare.entity.VisitReport;
import com.homehealthcare.repository.AppointmentRepository;
import com.homehealthcare.repository.UserRepository;
import com.homehealthcare.repository.VisitReportRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class VisitReportServiceTest {

    @Test
    void fillsMissingVisitDateAndTimeFromLegacyAppointment() {
        VisitReportRepository reportRepository = mock(VisitReportRepository.class);
        AppointmentRepository appointmentRepository =
                mock(AppointmentRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        PatientIdentityService patientIdentityService =
                new PatientIdentityService(
                        mock(com.homehealthcare.repository.PatientRepository.class),
                        userRepository
                );
        VisitReportService service = new VisitReportService(
                reportRepository,
                appointmentRepository,
                userRepository,
                patientIdentityService
        );

        Appointment appointment = new Appointment();
        appointment.setId(15L);
        appointment.setPatientId(7L);
        appointment.setNurseId(11L);
        appointment.setService("Nursing Care");
        appointment.setDate("2026-10-09");
        appointment.setTime("11:30");
        when(appointmentRepository.findById(15L))
                .thenReturn(Optional.of(appointment));
        VisitReport report = new VisitReport();
        report.setId(4L);
        report.setAppointmentId(15L);
        report.setPatientId(7L);
        report.setNurseId(11L);
        when(reportRepository.findById(4L)).thenReturn(Optional.of(report));

        VisitReport result = service.getVisitReportById(4L);

        assertEquals("2026-10-09", result.getVisitDate());
        assertEquals("11:30", result.getVisitTime());
    }
}
