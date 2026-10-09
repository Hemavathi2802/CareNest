package com.homehealthcare.repository;

import com.homehealthcare.entity.VisitReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitReportRepository extends JpaRepository<VisitReport, Long> {

    List<VisitReport> findByPatientId(Long patientId);

    List<VisitReport> findByNurseId(Long nurseId);

    List<VisitReport> findByAppointmentId(Long appointmentId);
}