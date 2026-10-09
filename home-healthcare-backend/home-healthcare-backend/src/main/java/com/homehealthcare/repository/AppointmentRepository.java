package com.homehealthcare.repository;

import com.homehealthcare.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByNurseId(Long nurseId);

    List<Appointment> findByReminderSentFalse();
}