package com.homehealthcare.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;

    private Long nurseId;

    private String service;

    private String date;

    private String time;

    @Column(length = 1000)
    private String notes;

    private String status = "PENDING";

    @Column(nullable = false)
    private boolean reminderSent;

    // These are only for API response.
    // They are NOT stored in appointments table.
    @Transient
    private String patientName;

    @Transient
    private String nurseName;

    public Appointment() {
    }

    // =========================
    // ID
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // =========================
    // PATIENT ID
    // =========================

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    // =========================
    // NURSE ID
    // =========================

    public Long getNurseId() {
        return nurseId;
    }

    public void setNurseId(Long nurseId) {
        this.nurseId = nurseId;
    }

    // =========================
    // SERVICE
    // =========================

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    // =========================
    // DATE
    // =========================

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    // =========================
    // TIME
    // =========================

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    // =========================
    // NOTES
    // =========================

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    // =========================
    // STATUS
    // =========================

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isReminderSent() {
        return reminderSent;
    }

    public void setReminderSent(boolean reminderSent) {
        this.reminderSent = reminderSent;
    }

    // =========================
    // PATIENT NAME
    // =========================

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    // =========================
    // NURSE NAME
    // =========================

    public String getNurseName() {
        return nurseName;
    }

    public void setNurseName(String nurseName) {
        this.nurseName = nurseName;
    }
}