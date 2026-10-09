import React from "react";
import { Link } from "react-router-dom";
import DashboardWelcome from "./DashboardWelcome";
import "./PatientDashboard.css";

function PatientDashboard() {
  return (
    <div className="patient-dashboard">

      {/* ================= HEADER ================= */}

      <DashboardWelcome
        portal="PATIENT PORTAL"
        fallbackName="there"
        description="Your health, appointments and care information—all together in one calm, easy-to-use space."
        primaryAction={{ label: "Book an appointment", to: "/patient/appointments" }}
        secondaryAction={{ label: "Medical records", to: "/patient/medical-records" }}
      />


      {/* ================= PATIENT MODULES ================= */}

      <div className="dashboard-section">

        <div className="section-heading">
          <span className="section-line"></span>

          <div>
            <h2>Patient Care</h2>

            <p>
              Access your healthcare information and visits.
            </p>
          </div>
        </div>


        <div className="patient-module-grid">

          {/* APPOINTMENTS */}

          <Link
            to="/patient/appointments"
            className="patient-module-card"
          >
            <div className="module-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="16"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M7 3V7M17 3V7M3 10H21"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <path
                  d="M8 15L10.5 17.5L16 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="module-content">
              <h3>Appointments</h3>

              <p>
                View and manage your healthcare appointments.
              </p>
            </div>

            <span className="module-arrow">→</span>
          </Link>


          {/* SCHEDULE */}

          <Link
            to="/patient/schedule"
            className="patient-module-card"
          >
            <div className="module-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 7V12L15.5 14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="module-content">
              <h3>Schedule</h3>

              <p>
                View your upcoming home healthcare visits.
              </p>
            </div>

            <span className="module-arrow">→</span>
          </Link>


          {/* MEDICAL RECORDS */}

          <Link
            to="/patient/medical-records"
            className="patient-module-card"
          >
            <div className="module-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 3H15L19 7V21H6C4.9 21 4 20.1 4 19V5C4 3.9 4.9 3 6 3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M14 3V8H19"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path d="M8 13H10L11.5 10L14 16L15.5 13H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="module-content">
              <h3>Medical Records</h3>

              <p>
                View your medical history and healthcare records.
              </p>
            </div>

            <span className="module-arrow">→</span>
          </Link>


          {/* VISIT REPORTS */}

          <Link
            to="/patient/visit-reports"
            className="patient-module-card"
          >
            <div className="module-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 20V4M4 20H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <rect x="7" y="12" width="3" height="5" rx="0.8" stroke="currentColor" strokeWidth="1.8" />
                <rect x="12" y="8" width="3" height="9" rx="0.8" stroke="currentColor" strokeWidth="1.8" />
                <rect x="17" y="5" width="3" height="12" rx="0.8" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>

            <div className="module-content">
              <h3>Visit Reports</h3>

              <p>
                View reports generated after your home visits.
              </p>
            </div>

            <span className="module-arrow">→</span>
          </Link>


          {/* PROFILE */}

          <Link
            to="/patient/profile"
            className="patient-module-card"
          >
            <div className="module-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M4 21C4.8 16.8 7.5 14.5 12 14.5C16.5 14.5 19.2 16.8 20 21"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="module-content">
              <h3>My Profile</h3>

              <p>
                View and manage your personal information.
              </p>
            </div>

            <span className="module-arrow">→</span>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default PatientDashboard;