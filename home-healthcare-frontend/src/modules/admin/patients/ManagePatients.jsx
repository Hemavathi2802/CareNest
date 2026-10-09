import { API_ORIGIN } from "../../../apiBase.js";
import React, { useEffect, useState } from "react";
import "./ManagePatients.css";
import "../admin-module-theme.css";

function ManagePatients() {
  const [patients, setPatients] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
  });

  // ================= LOAD PATIENTS =================

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_ORIGIN}/api/patients`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();

      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Patient loading error:", err);
      setError("Unable to load patients.");
    } finally {
      setLoading(false);
    }
  };

  // ================= FORM =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.age ||
      !formData.gender ||
      !formData.phone
    ) {
      setError(
        "Please fill in name, age, gender and phone number."
      );
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_ORIGIN}/api/patients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            age: Number(formData.age),
            gender: formData.gender,
            phone: formData.phone,
            address: formData.address,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add patient");
      }

      const newPatient = await response.json();

      setPatients((prev) => [...prev, newPatient]);

      setFormData({
        name: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
      });

      setShowForm(false);
    } catch (err) {
      console.error("Add patient error:", err);
      setError("Unable to add patient.");
    }
  };

  // ================= DELETE =================

  const deletePatient = async (patient) => {
    const patientId =
      patient.patientId || patient.id;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${patient.name}?`
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${API_ORIGIN}/api/patients/${patientId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete patient");
      }

      setPatients((prev) =>
        prev.filter(
          (item) =>
            (item.patientId || item.id) !== patientId
        )
      );
    } catch (err) {
      console.error("Delete patient error:", err);
      setError("Unable to delete patient.");
    }
  };

  // ================= STATUS =================

  const toggleStatus = (id) => {
    setPatients((prev) =>
      prev.map((patient) =>
        (patient.patientId || patient.id) === id
          ? {
              ...patient,
              status:
                patient.status === "Inactive"
                  ? "Active"
                  : "Inactive",
            }
          : patient
      )
    );
  };

  // ================= SEARCH =================

  const filteredPatients = patients.filter((patient) =>
    `
      ${patient.name || ""}
      ${patient.phone || ""}
      ${patient.email || ""}
      ${patient.gender || ""}
      ${patient.address || ""}
    `
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="admin-patients-page">
        <div className="admin-patients-empty">
          <div className="admin-patient-empty-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M4 21C4 16.58 7.58 13 12 13C16.42 13 20 16.58 20 21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h3>Loading Patients...</h3>

          <p>
            Please wait while patient details are loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-patients-page">

      {/* ================= HEADER ================= */}

      <div className="admin-patients-header">

        <div className="admin-patients-header-content">

          <span className="admin-patients-label">
            ADMIN MODULE
          </span>

          <h1>Manage Patients</h1>

          <p>
            Manage registered patients and their details.
          </p>

        </div>

        <div className="admin-patients-count">

          <strong>{patients.length}</strong>

          <span>Total Patients</span>

        </div>

      </div>


      {/* ================= ERROR ================= */}

      {error && (
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto 20px",
            padding: "13px 16px",
            borderRadius: "12px",
            background: "#fff1f2",
            color: "#a65f68",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          {error}
        </div>
      )}


      {/* ================= TOOLBAR ================= */}

      <div className="admin-patients-toolbar">

        <div className="admin-patients-search">

          <svg
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />

            <path
              d="M16 16L21 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <button
          className="admin-add-patient-btn"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          <span>+</span>
          Add Patient
        </button>

      </div>


      {/* ================= ADD FORM ================= */}

      {showForm && (
        <div className="admin-patient-form-card">

          <div className="admin-patient-form-title">

            <div>
              <span>PATIENT REGISTRATION</span>

              <h2>Add New Patient</h2>
            </div>

            <button
              className="admin-patient-close"
              onClick={() =>
                setShowForm(false)
              }
            >
              ×
            </button>

          </div>


          <form
            className="admin-patient-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-patient-form-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter patient name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>


            <div className="admin-patient-form-group">

              <label>Age</label>

              <input
                type="number"
                name="age"
                placeholder="Enter age"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
              />

            </div>


            <div className="admin-patient-form-group">

              <label>Gender</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">
                  Select gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </div>


            <div className="admin-patient-form-group">

              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>


            <div className="admin-patient-form-group">

              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />

            </div>


            <div className="admin-patient-form-group">

              <label>Address</label>

              <input
                type="text"
                name="address"
                placeholder="Enter patient address"
                value={formData.address}
                onChange={handleChange}
              />

            </div>


            <div className="admin-patient-form-actions">

              <button
                type="button"
                className="admin-patient-cancel-btn"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-patient-save-btn"
              >
                Add Patient
              </button>

            </div>

          </form>

        </div>
      )}


      {/* ================= PATIENT LIST ================= */}

      <div className="admin-patients-section">

        <div className="admin-patients-section-heading">

          <div className="admin-patients-section-line"></div>

          <div>
            <h2>Patient List</h2>

            <p>
              View and manage registered patients.
            </p>
          </div>

        </div>


        {filteredPatients.length === 0 ? (

          <div className="admin-patients-empty">

            <div className="admin-patient-empty-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
              >

                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M4 21C4 16.58 7.58 13 12 13C16.42 13 20 16.58 20 21"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

              </svg>

            </div>

            <h3>
              No Patients Found
            </h3>

            <p>
              {search
                ? "Try searching with a different name."
                : "No registered patients are available."}
            </p>

          </div>

        ) : (

          <div className="admin-patients-list">

            {filteredPatients.map((patient) => {

              const patientId =
                patient.patientId || patient.id;

              return (
                <div
                  className="admin-patient-card"
                  key={patientId}
                >

                  {/* AVATAR */}

                  <div className="admin-patient-avatar">

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


                  {/* INFORMATION */}

                  <div className="admin-patient-info">

                    <h3>
                      {patient.name ||
                        `Patient #${patientId}`}
                    </h3>

                    <span>
                      {patient.age || "--"} years ·{" "}
                      {patient.gender || "--"}
                    </span>

                    <div className="admin-patient-contact">

                      {patient.phone && (
                        <small>
                          {patient.phone}
                        </small>
                      )}

                      {patient.email && (
                        <small>
                          {patient.email}
                        </small>
                      )}

                    </div>

                  </div>


                  {/* STATUS */}

                  <button
                    className={`admin-patient-status ${
                      (
                        patient.status ||
                        "Active"
                      ).toLowerCase()
                    }`}
                    onClick={() =>
                      toggleStatus(patientId)
                    }
                  >

                    <span></span>

                    {patient.status || "Active"}

                  </button>


                  {/* DELETE */}

                  <button
                    className="admin-patient-delete"
                    onClick={() =>
                      deletePatient(patient)
                    }
                    title="Delete Patient"
                  >

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                    >

                      <path
                        d="M4 7H20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      <path
                        d="M10 11V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      <path
                        d="M14 11V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      <path
                        d="M6 7L7 20H17L18 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M9 7V4H15V7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />

                    </svg>

                  </button>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}

export default ManagePatients;