package com.homehealthcare.repository;

import com.homehealthcare.entity.NurseNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NurseNotificationRepository
        extends JpaRepository<NurseNotification, Long> {

    List<NurseNotification> findByNurseIdOrderByCreatedAtDesc(Long nurseId);

    Optional<NurseNotification> findByIdAndNurseId(Long id, Long nurseId);

    boolean existsByAppointmentId(Long appointmentId);
}
