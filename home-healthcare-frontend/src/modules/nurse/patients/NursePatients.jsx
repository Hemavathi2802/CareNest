import { API_ORIGIN } from "../../../apiBase.js";
import React, { useEffect, useState } from "react";
import "./NursePatients.css";
import "../nurse-module-theme.css";

function NursePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (!selectedPatient) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedPatient(null);
        setMedicalRecords([]);
        setRecordsError("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPatient]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
      );

      console.log("Logged in user:", loggedInUser);

      if (!loggedInUser || !loggedInUser.id) {
        throw new Error(
          "Nurse login details not found."
        );
      }

      const nurseId = loggedInUser.id;

      const url =
        `${API_ORIGIN}/api/appointments/nurse/${nurseId}/patients`;

      console.log(
        "Nurse Patients API:",
        url
      );

      const response = await fetch(url);

      const responseText =
        await response.text();

      console.log(
        "API status:",
        response.status
      );

      console.log(
        "API response:",
        responseText
      );

      if (!response.ok) {
        throw new Error(
          responseText ||
          `Server error: ${response.status}`
        );
      }

      const data = responseText
        ? JSON.parse(responseText)
        : [];

      setPatients(data);

    } catch (err) {

      console.error(
        "Nurse patients error:",
        err
      );

      setError(
        err.message ||
        "Unable to load patients."
      );

    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalRecords = async (patient) => {
    setSelectedPatient(patient);
    setMedicalRecords([]);
    setRecordsError("");
    setRecordsLoading(true);

    try {
      const response = await fetch(
        `${API_ORIGIN}/api/medical-records/patient/${patient.patientId}`
      );

      if (!response.ok) {
        throw new Error("Unable to load this patient's medical records.");
      }

      const data = await response.json();
      setMedicalRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Nurse medical records error:", err);
      setRecordsError(
        err.message || "Unable to load this patient's medical records."
      );
    } finally {
      setRecordsLoading(false);
    }
  };

  const closeMedicalRecords = () => {
    setSelectedPatient(null);
    setMedicalRecords([]);
    setRecordsError("");
  };

  const formatRecordDate = (date) => {
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

  return (
    <div className="nurse-patients-page">

      {/* HEADER */}
      <div className="nurse-patients-header">

        <span className="nurse-patients-label">
          CARENEST • NURSE PORTAL
        </span>

        <h1>My Patients</h1>

        <p>
          View the patients assigned to you
          for home healthcare.
        </p>

      </div>

      {/* HEADING */}
      <div className="nurse-patients-heading">

        <span className="nurse-patients-line"></span>

        <div>

          <h2>
            Assigned Patients
          </h2>

          <p>
            Patients currently assigned to you.
          </p>

        </div>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="nurse-patients-message">

          <div className="nurse-patients-loader"></div>

          <p>
            Loading patients...
          </p>

        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="nurse-patients-message error">

          <div className="nurse-patients-message-icon">

            <svg
              viewBox="0 0 24 24"
              fill="none"
            >

              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M12 8V13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <circle
                cx="12"
                cy="16.5"
                r="1"
                fill="currentColor"
              />

            </svg>

          </div>

          <h3>
            Unable to load patients
          </h3>

          <p>
            {error}
          </p>

          <button onClick={fetchPatients}>
            Try Again
          </button>

        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        !error &&
        patients.length === 0 && (
          <div className="nurse-patients-empty">

            <div className="nurse-patients-empty-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
              >

                <circle
                  cx="9"
                  cy="8"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <circle
                  cx="17"
                  cy="9"
                  r="2.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M3 20C3 16.69 5.69 14 9 14C12.31 14 15 16.69 15 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <path
                  d="M15 15C18.31 15 21 17.24 21 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

              </svg>

            </div>

            <h3>
              No Patients Assigned
            </h3>

            <p>
              Patients assigned to you
              will appear here.
            </p>

          </div>
        )}

      {/* PATIENT CARDS */}
      {!loading &&
        !error &&
        patients.length > 0 && (

          <div className="nurse-patients-grid">

            {patients.map((patient) => (

              <div
                className="nurse-patient-card"
                key={patient.patientId}
              >

                <div className="nurse-patient-card-top">

                  <div className="nurse-patient-avatar">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                    >

                      <circle
                        cx="12"
                        cy="8"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                      />

                      <path
                        d="M4 21C4 16.58 7.58 13 12 13C16.42 13 20 16.58 20 21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                    </svg>

                  </div>

                </div>

                <div className="nurse-patient-content">

                  <h3>
                    {patient.name}
                  </h3>

                  <p>
                    Patient ID:{" "}
                    <strong>
                      {patient.patientId}
                    </strong>
                  </p>

                </div>

                <div className="nurse-patient-details">

                  {patient.age > 0 && (
                    <span>
                      Age: {patient.age}
                    </span>
                  )}

                  {patient.gender && (
                    <span>
                      {patient.gender}
                    </span>
                  )}

                  {patient.phone && (
                    <span>
                      {patient.phone}
                    </span>
                  )}

                </div>

                <button
                  type="button"
                  className="nurse-patient-records-btn"
                  onClick={() => fetchMedicalRecords(patient)}
                >
                  View Medical Records
                </button>

              </div>

            ))}

          </div>
        )}

      {selectedPatient && (
        <div
          className="nurse-records-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeMedicalRecords();
            }
          }}
        >
          <section
            className="nurse-records-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nurse-records-title"
          >
            <div className="nurse-records-modal-header">
              <div>
                <span className="nurse-records-modal-label">
                  PATIENT HEALTH DETAILS
                </span>
                <h2 id="nurse-records-title">
                  {selectedPatient.name}&apos;s Medical Records
                </h2>
              </div>
              <button
                type="button"
                className="nurse-records-close"
                onClick={closeMedicalRecords}
                aria-label="Close medical records"
              >
                ×
              </button>
            </div>

            {recordsLoading ? (
              <div className="nurse-records-state" role="status">
                <div className="nurse-patients-loader"></div>
                <p>Loading medical records...</p>
              </div>
            ) : recordsError ? (
              <div className="nurse-records-state nurse-records-error" role="alert">
                <p>{recordsError}</p>
                <button
                  type="button"
                  onClick={() => fetchMedicalRecords(selectedPatient)}
                >
                  Try Again
                </button>
              </div>
            ) : medicalRecords.length === 0 ? (
              <div className="nurse-records-state">
                <h3>No Medical Records</h3>
                <p>No medical records have been added for this patient.</p>
              </div>
            ) : (
              <div className="nurse-records-list">
                {medicalRecords.map((record, index) => (
                  <article
                    className="nurse-record-card"
                    key={record.recordId || index}
                  >
                    <div className="nurse-record-heading">
                      <h3>{record.diagnosis || "Medical Information"}</h3>
                      <span>
                        Record Date: {formatRecordDate(record.createdAt || record.visitDate)}
                      </span>
                    </div>

                    <div className="nurse-record-fields">
                      <div>
                        <h4>Medical History</h4>
                        <p>{record.medicalHistory || "Not provided"}</p>
                      </div>
                      <div>
                        <h4>Diagnosis</h4>
                        <p>{record.diagnosis || "Not provided"}</p>
                      </div>
                      <div>
                        <h4>Allergies</h4>
                        <p>{record.allergies || "Not provided"}</p>
                      </div>
                      <div>
                        <h4>Medicines</h4>
                        <p>{record.medicines || "Not provided"}</p>
                      </div>
                      <div className="nurse-record-notes">
                        <h4>Important Notes</h4>
                        <p>{record.notes || "No additional notes"}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

    </div>
  );
}

export default NursePatients;