package com.homehealthcare.service;

import com.homehealthcare.entity.MedicalRecord;
import com.homehealthcare.repository.MedicalRecordRepository;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class MedicalRecordServiceTest {

    @Test
    void doesNotAssignVisitDateWhenCreatingMedicalRecordWithoutOne() {
        MedicalRecordRepository repository = mock(MedicalRecordRepository.class);
        MedicalRecordService service = new MedicalRecordService(repository);
        when(repository.save(org.mockito.ArgumentMatchers.any(MedicalRecord.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        MedicalRecord record = new MedicalRecord();
        record.setPatientId(7L);
        MedicalRecord saved = service.createMedicalRecord(record);

        assertNotNull(saved.getCreatedAt());
    }
}
