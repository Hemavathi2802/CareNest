package com.homehealthcare.repository;

import com.homehealthcare.entity.PatientNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PatientNotificationRepository
        extends JpaRepository<PatientNotification, Long> {

    List<PatientNotification> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    Optional<PatientNotification> findByIdAndPatientId(Long id, Long patientId);

    boolean existsByAppointmentId(Long appointmentId);
}
