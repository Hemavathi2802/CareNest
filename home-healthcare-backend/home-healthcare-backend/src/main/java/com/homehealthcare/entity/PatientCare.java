
package com.homehealthcare.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "patient_care")
public class PatientCare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long appointmentId;

    private Long patientId;

    private Long nurseId;

    private LocalDate visitDate;

    private String careType;

    private String bloodPressure;

    private String temperature;

    private String pulse;

    private String spo2;

    @Column(length = 2000)
    private String careNotes;

    private LocalDate nextVisit;

    // Patient name database-la save panna vendam.
    // Response-la mattum display aagum.
    @Transient
    private String patientName;

    public PatientCare() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Long getNurseId() {
        return nurseId;
    }

    public void setNurseId(Long nurseId) {
        this.nurseId = nurseId;
    }

    public LocalDate getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(LocalDate visitDate) {
        this.visitDate = visitDate;
    }

    public String getCareType() {
        return careType;
    }

    public void setCareType(String careType) {
        this.careType = careType;
    }

    public String getBloodPressure() {
        return bloodPressure;
    }

    public void setBloodPressure(String bloodPressure) {
        this.bloodPressure = bloodPressure;
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }

    public String getPulse() {
        return pulse;
    }

    public void setPulse(String pulse) {
        this.pulse = pulse;
    }

    public String getSpo2() {
        return spo2;
    }

    public void setSpo2(String spo2) {
        this.spo2 = spo2;
    }

    public String getCareNotes() {
        return careNotes;
    }

    public void setCareNotes(String careNotes) {
        this.careNotes = careNotes;
    }

    public LocalDate getNextVisit() {
        return nextVisit;
    }

    public void setNextVisit(LocalDate nextVisit) {
        this.nextVisit = nextVisit;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }
}