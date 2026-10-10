import { API_ORIGIN } from "../../../apiBase.js";
import React, { useEffect, useState } from "react";
import "./MedicalRecords.css";
import {
  getMedicalRecords,
  createMedicalRecord,
} from "./medicalRecordService";

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    medicalHistory: "",
    diagnosis: "",
    medicines: "",
    allergies: "",
    notes: "",
  });

  useEffect(() => {
    loadMedicalRecords();
  }, []);

  const loadMedicalRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
      );

      if (!loggedInUser?.id) {
        setError("Please login again.");
        return;
      }

      const patientResponse = await fetch(
        `${API_ORIGIN}/api/patients/user/${loggedInUser.id}`
      );

      if (!patientResponse.ok) {
        throw new Error("Patient profile not found");
      }

      const patient = await patientResponse.json();

      if (!patient?.patientId) {
        throw new Error("Patient ID not found");
      }

      setPatientId(patient.patientId);

      const data = await getMedicalRecords(patient.patientId);

      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Medical records error:", err);
      setError(
        err.message || "Unable to load medical records."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddRecord = () => {
    setMessage("");
    setError("");

    setFormData({
      medicalHistory: "",
      diagnosis: "",
      medicines: "",
      allergies: "",
      notes: "",
    });

    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setMessage("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (!patientId) {
        setError("Patient ID not found.");
        return;
      }

      if (!formData.medicalHistory.trim()) {
        setError("Please enter your medical history.");
        return;
      }

      const medicalRecord = {
        patientId: Number(patientId),
        medicalHistory: formData.medicalHistory.trim(),
        diagnosis: formData.diagnosis.trim(),
        medicines: formData.medicines.trim(),
        allergies: formData.allergies.trim(),
        notes: formData.notes.trim(),
      };

      const savedRecord =
        await createMedicalRecord(medicalRecord);

      setRecords((previous) => [
        savedRecord,
        ...previous,
      ]);

      setShowForm(false);

      setMessage(
        "Medical information saved successfully."
      );

      setFormData({
        medicalHistory: "",
        diagnosis: "",
        medicines: "",
        allergies: "",
        notes: "",
      });
    } catch (err) {
      console.error(
        "Save medical record error:",
        err
      );

      setError(
        err.message ||
          "Unable to save medical information."
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="medical-page-wrapper">
        <div className="medical-loading">
          <div className="loading-spinner"></div>
          <p>Loading your medical records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-page-wrapper">
      <main className="medical-records-page">

        <section className="medical-header">
          <div className="medical-header-content">
            <span className="medical-label">
              YOUR HEALTH
            </span>

            <h1>Medical Records</h1>

            <p>
              View and manage your important medical
              information in one place.
            </p>
          </div>
        </section>

        {message && (
          <div className="medical-success-message">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="medical-error-message">
            <span>!</span>
            {error}
          </div>
        )}

        <section className="records-section">

          <div className="records-section-heading">
            <span>HEALTH INFORMATION</span>

            <h2>Your Medical History</h2>

            <p>
              Add and manage your important medical
              information in CareNest.
            </p>
          </div>

          {showForm && (
            <form
              className="medical-form"
              onSubmit={handleSave}
            >
              <div className="medical-form-heading">
                <h2>Medical Information</h2>

                <p>
                  Enter your important health information.
                </p>
              </div>

              <div className="medical-form-grid">

                <div className="medical-form-field medical-form-full">
                  <label>Medical History</label>

                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter your previous medical conditions or history"
                  />
                </div>

                <div className="medical-form-field">
                  <label>Diagnosis</label>

                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter any existing diagnosis"
                  />
                </div>

                <div className="medical-form-field">
                  <label>Medicines</label>

                  <textarea
                    name="medicines"
                    value={formData.medicines}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter current medicines"
                  />
                </div>

                <div className="medical-form-field">
                  <label>Allergies</label>

                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter known allergies"
                  />
                </div>

                <div className="medical-form-field">
                  <label>Important Notes</label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter any other important medical information"
                  />
                </div>

              </div>

              <div className="medical-form-actions">

                <button
                  type="button"
                  className="medical-cancel-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="medical-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Medical Information"}
                </button>

              </div>
            </form>
          )}

          {!showForm && records.length === 0 && (
            <div className="empty-records">

              <div className="empty-record-icon">
                <span>+</span>
              </div>

              <h2>No Medical Records</h2>

              <p>
                Add your medical information so your
                healthcare team can understand your
                health history and provide better care.
              </p>

              <button
                type="button"
                className="empty-add-btn"
                onClick={handleAddRecord}
              >
                + Add Medical Information
              </button>

            </div>
          )}

          {!showForm && records.length > 0 && (
            <div className="medical-records-list">

              {records.map((record, index) => (
                <article
                  className="medical-record-card"
                  key={record.recordId || index}
                >

                  <div className="medical-record-card-header">

                    <div className="medical-record-icon">
                      +
                    </div>

                    <div className="medical-record-heading">

                      <h3>
                        {record.diagnosis ||
                          "Medical Information"}
                      </h3>

                    </div>

                  </div>

                  <div className="medical-information-grid">

                    <div className="medical-information-item">
                      <span className="medical-info-label">
                        Medical History
                      </span>

                      <p>
                        {record.medicalHistory ||
                          "Not provided"}
                      </p>
                    </div>

                    <div className="medical-information-item">
                      <span className="medical-info-label">
                        Diagnosis
                      </span>

                      <p>
                        {record.diagnosis ||
                          "Not provided"}
                      </p>
                    </div>

                    <div className="medical-information-item">
                      <span className="medical-info-label">
                        Allergies
                      </span>

                      <p>
                        {record.allergies ||
                          "Not provided"}
                      </p>
                    </div>

                    <div className="medical-information-item">
                      <span className="medical-info-label">
                        Medicines
                      </span>

                      <p>
                        {record.medicines ||
                          "Not provided"}
                      </p>
                    </div>

                    <div className="medical-information-item medical-notes">
                      <span className="medical-info-label">
                        Important Notes
                      </span>

                      <p>
                        {record.notes ||
                          "No additional notes"}
                      </p>
                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default MedicalRecords;