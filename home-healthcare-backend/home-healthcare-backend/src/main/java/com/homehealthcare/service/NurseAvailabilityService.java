package com.homehealthcare.service;

import com.homehealthcare.entity.NurseAvailability;
import com.homehealthcare.repository.NurseAvailabilityRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NurseAvailabilityService {

    private final NurseAvailabilityRepository repository;

    public NurseAvailabilityService(NurseAvailabilityRepository repository) {
        this.repository = repository;
    }

    // Save or Update Nurse Availability
    public NurseAvailability saveAvailability(NurseAvailability availability) {

        // Check Nurse ID
        if (availability.getNurseId() == null ||
                availability.getNurseId().isBlank()) {

            throw new RuntimeException("Nurse ID is required");
        }

        // Check whether availability already exists
        Optional<NurseAvailability> existing =
                repository.findByNurseId(availability.getNurseId());

        // If already exists → UPDATE
        if (existing.isPresent()) {

            NurseAvailability current = existing.get();

            current.setMonday(availability.isMonday());
            current.setTuesday(availability.isTuesday());
            current.setWednesday(availability.isWednesday());
            current.setThursday(availability.isThursday());
            current.setFriday(availability.isFriday());
            current.setSaturday(availability.isSaturday());
            current.setSunday(availability.isSunday());

            current.setStartTime(availability.getStartTime());
            current.setEndTime(availability.getEndTime());

            return repository.save(current);
        }

        // If not exists → CREATE new record
        return repository.save(availability);
    }


    // Get availability by Nurse ID
    public Optional<NurseAvailability> getAvailability(String nurseId) {

        return repository.findByNurseId(nurseId);
    }


    // Get all nurse availability
    public List<NurseAvailability> getAllAvailability() {

        return repository.findAll();
    }
}