package com.homehealthcare.repository;

import com.homehealthcare.entity.PatientCare;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientCareRepository
        extends JpaRepository<PatientCare, Long> {

    List<PatientCare> findByPatientId(Long patientId);

    List<PatientCare> findByNurseId(Long nurseId);
}