package com.homehealthcare.repository;

import com.homehealthcare.entity.NurseAvailability;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NurseAvailabilityRepository
        extends JpaRepository<NurseAvailability, Long> {

    Optional<NurseAvailability> findByNurseId(
            String nurseId
    );
}