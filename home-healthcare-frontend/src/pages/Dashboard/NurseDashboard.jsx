import React from "react";
import { Link } from "react-router-dom";
import DashboardWelcome from "./DashboardWelcome";
import "./NurseDashboard.css";

function NurseDashboard() {
  return (
    <div className="nurse-dashboard">

      {/* ================= HEADER ================= */}

      <DashboardWelcome
        portal="NURSE PORTAL"
        fallbackName="Nurse"
        description="Your care team workspace is ready. Keep track of patients, visits and your schedule in one place."
        primaryAction={{ label: "View today's visits", to: "/nurse/appointments" }}
        secondaryAction={{ label: "My patients", to: "/nurse/patients" }}
      />


      {/* ================= SECTION TITLE ================= */}

      <div className="nurse-section-heading">

        <div className="nurse-section-line"></div>

        <div>
          <h2>Nurse Care</h2>

          <p>
            Manage your patients, visits and healthcare activities.
          </p>
        </div>

      </div>


      {/* ================= MODULES ================= */}

      <div className="nurse-module-grid">

        {/* MY PATIENTS */}

        <Link
          to="/nurse/patients"
          className="nurse-module-card"
        >

          <div className="nurse-module-icon">

            <svg viewBox="0 0 24 24" fill="none">

              <circle
                cx="9"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M2 21V20C2 17.24 4.24 15 7 15H11C13.76 15 16 17.24 16 20V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M16 3C18.21 3 20 4.79 20 7C20 9.21 18.21 11 16 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

            </svg>

          </div>

          <div className="nurse-module-content">

            <h3>My Patients</h3>

            <p>
              View and manage your assigned patients.
            </p>

          </div>

          <div className="nurse-module-arrow">
            →
          </div>

        </Link>


        {/* APPOINTMENTS */}

        <Link
          to="/nurse/appointments"
          className="nurse-module-card"
        >

          <div className="nurse-module-icon">

            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="4" width="17" height="17" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M8 2.5V6M16 2.5V6M3.5 9H20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="14.5" r="3.5" stroke="currentColor" strokeWidth="2" />
              <path d="M12 12.5V14.5L13.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

              <path
                d="M8 18H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

            </svg>

          </div>

          <div className="nurse-module-content">

            <h3>Appointments</h3>

            <p>
              View today's and upcoming appointments.
            </p>

          </div>

          <div className="nurse-module-arrow">
            →
          </div>

        </Link>


        {/* SCHEDULE */}

        <Link
          to="/nurse/schedule"
          className="nurse-module-card"
        >

          <div className="nurse-module-icon">

            <svg viewBox="0 0 24 24" fill="none">

              <rect
                x="3"
                y="4"
                width="18"
                height="17"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M16 2V6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M8 2V6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M3 10H21"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M8 14H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

            </svg>

          </div>

          <div className="nurse-module-content">

            <h3>Schedule</h3>

            <p>
              Manage your daily patient visit schedule.
            </p>

          </div>

          <div className="nurse-module-arrow">
            →
          </div>

        </Link>


        {/* AVAILABILITY */}

        <Link
          to="/nurse/availability"
          className="nurse-module-card"
        >

          <div className="nurse-module-icon">

            <svg viewBox="0 0 24 24" fill="none">

              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M12 7V12L15 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

            </svg>

          </div>

          <div className="nurse-module-content">

            <h3>Availability</h3>

            <p>
              Set and manage your available working hours.
            </p>

          </div>

          <div className="nurse-module-arrow">
            →
          </div>

        </Link>


        {/* PATIENT CARE */}

        <Link
          to="/nurse/patient-care"
          className="nurse-module-card"
        >

          <div className="nurse-module-icon">

            <svg viewBox="0 0 24 24" fill="none">

              <path
                d="M20.84 4.61C19.32 3.09 16.85 3.09 15.33 4.61L12 7.94L8.67 4.61C7.15 3.09 4.68 3.09 3.16 4.61C1.61 6.16 1.61 8.68 3.16 10.23L12 19.07L20.84 10.23C22.39 8.68 22.39 6.16 20.84 4.61Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              <path
                d="M12 9V14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M9.5 11.5H14.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

            </svg>

          </div>

          <div className="nurse-module-content">

            <h3>Patient Care</h3>

            <p>
              Manage patient care activities and status.
            </p>

          </div>

          <div className="nurse-module-arrow">
            →
          </div>

        </Link>


        {/* VISIT REPORTS */}

        <Link
          to="/nurse/visit-reports"
          className="nurse-module-card"
        >

          <div className="nurse-module-icon">

            <svg viewBox="0 0 24 24" fill="none">

              <path
                d="M6 3H14L19 8V21H6C4.9 21 4 20.1 4 19V5C4 3.9 4.9 3 6 3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              <path
                d="M14 3V8H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              <path
                d="M8 13H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M8 17H11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M14 16L16 18L20 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

            </svg>

          </div>

          <div className="nurse-module-content">

            <h3>Visit Reports</h3>

            <p>
              Create and manage patient visit reports.
            </p>

          </div>

          <div className="nurse-module-arrow">
            →
          </div>

        </Link>


        {/* NURSE PROFILE */}

        <Link
          to="/nurse/profile"
          className="nurse-module-card"
        >

          <div className="nurse-module-icon">

            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
              <circle cx="9" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
              <path d="M5.5 16C6.2 14.5 7.3 13.8 9 13.8C10.7 13.8 11.8 14.5 12.5 16M15 9H18M15 12H18M15 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>

          </div>

          <div className="nurse-module-content">

            <h3>Nurse Profile</h3>

            <p>
              View and manage your professional profile.
            </p>

          </div>

          <div className="nurse-module-arrow">
            →
          </div>

        </Link>

      </div>

    </div>
  );
}

export default NurseDashboard;