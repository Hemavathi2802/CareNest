import { API_ORIGIN } from "../../../apiBase.js";
const API_BASE_URL = `${API_ORIGIN}/api/medical-records`;

// Get medical records for a patient
export const getMedicalRecords = async (patientId) => {
    const response = await fetch(
        `${API_BASE_URL}/patient/${patientId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch medical records");
    }

    return await response.json();
};

// Create a medical record
export const createMedicalRecord = async (medicalRecord) => {
    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(medicalRecord),
    });

    if (!response.ok) {
        throw new Error("Failed to create medical record");
    }

    return await response.json();
};

// Get one medical record
export const getMedicalRecordById = async (recordId) => {
    const response = await fetch(
        `${API_BASE_URL}/${recordId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch medical record");
    }

    return await response.json();
};