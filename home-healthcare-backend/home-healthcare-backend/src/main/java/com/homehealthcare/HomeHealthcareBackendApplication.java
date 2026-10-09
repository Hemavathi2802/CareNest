package com.homehealthcare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class HomeHealthcareBackendApplication {

    private static final Logger logger =
            LoggerFactory.getLogger(HomeHealthcareBackendApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(HomeHealthcareBackendApplication.class, args);
    }

    @Bean
    ApplicationRunner removeUnusedAppointmentAndMedicalRecordColumns(
            JdbcTemplate jdbcTemplate) {
        return args -> {
            Integer appointmentUserIdCount = jdbcTemplate.queryForObject(
                    """
                    SELECT COUNT(*)
                    FROM information_schema.columns
                    WHERE table_schema = DATABASE()
                      AND table_name = 'appointments'
                      AND column_name = 'patient_user_id'
                    """,
                    Integer.class
            );

            if (appointmentUserIdCount != null && appointmentUserIdCount > 0) {
                Integer unmatchedAppointmentCount = jdbcTemplate.queryForObject(
                        """
                        SELECT COUNT(*)
                        FROM appointments appointment
                        LEFT JOIN patients patient
                          ON patient.user_id = appointment.patient_user_id
                        WHERE appointment.patient_user_id IS NOT NULL
                          AND patient.patient_id IS NULL
                        """,
                        Integer.class
                );
                if (unmatchedAppointmentCount != null
                        && unmatchedAppointmentCount > 0) {
                    throw new IllegalStateException(
                            "Cannot remove appointments.patient_user_id: "
                                    + unmatchedAppointmentCount
                                    + " appointment patient IDs could not be mapped"
                    );
                }

                int migratedRows = jdbcTemplate.update(
                        """
                        UPDATE appointments appointment
                        JOIN patients patient
                          ON patient.user_id = appointment.patient_user_id
                        SET appointment.patient_id = patient.patient_id
                        WHERE appointment.patient_user_id IS NOT NULL
                        """
                );
                jdbcTemplate.execute(
                        "ALTER TABLE appointments DROP COLUMN patient_user_id"
                );
                logger.info(
                        "Removed appointments.patient_user_id after normalizing {} patient IDs",
                        migratedRows
                );
            }

            Integer medicalRecordVisitDateCount = jdbcTemplate.queryForObject(
                    """
                    SELECT COUNT(*)
                    FROM information_schema.columns
                    WHERE table_schema = DATABASE()
                      AND table_name = 'medical_records'
                      AND column_name = 'visit_date'
                    """,
                    Integer.class
            );

            if (medicalRecordVisitDateCount != null
                    && medicalRecordVisitDateCount > 0) {
                jdbcTemplate.execute(
                        "ALTER TABLE medical_records DROP COLUMN visit_date"
                );
                logger.info("Removed medical_records.visit_date column");
            }
        };
    }

}