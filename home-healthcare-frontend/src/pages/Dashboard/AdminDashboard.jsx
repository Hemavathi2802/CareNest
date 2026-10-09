import React from "react";
import { Link } from "react-router-dom";
import DashboardWelcome from "./DashboardWelcome";
import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">

      <DashboardWelcome
        portal="ADMIN PORTAL"
        fallbackName="Admin"
        description="Your care operations workspace is ready. Review teams, patient services and daily activity."
        primaryAction={{ label: "Manage nurses", to: "/admin/nurses" }}
        secondaryAction={{ label: "Appointments", to: "/admin/appointments" }}
      />

      <div className="admin-dashboard-section-heading">
        <span>ADMIN WORKSPACE</span>
        <h2>Care operations</h2>
        <p>Choose an area to view and manage.</p>
      </div>

      <div className="admin-module-grid">

        {/* MANAGE NURSES */}

        <Link
          to="/admin/nurses"
          className="admin-module-card"
        >
          <div className="admin-module-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="2" />
              <path d="M3.5 20V18.5C3.5 15.7 5.7 13.5 8.5 13.5H11.5C14.3 13.5 16.5 15.7 16.5 18.5V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 8V14M15 11H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="admin-module-content">
            <h3>Manage Nurses</h3>
            <p>Add, view and manage nurses.</p>
          </div>

          <div className="admin-module-arrow">
            →
          </div>
        </Link>


        {/* MANAGE PATIENTS */}

        <Link
          to="/admin/patients"
          className="admin-module-card"
        >
          <div className="admin-module-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="8" r="2.5" stroke="currentColor" strokeWidth="2" />
              <circle cx="17" cy="9" r="2" stroke="currentColor" strokeWidth="2" />
              <path d="M3 19V18C3 15.8 4.8 14 7 14H11C13.2 14 15 15.8 15 18V19M15 14.5C15.6 14.2 16.2 14 17 14C19.2 14 21 15.8 21 18V19H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="admin-module-content">
            <h3>Manage Patients</h3>
            <p>View and manage patient information.</p>
          </div>

          <div className="admin-module-arrow">
            →
          </div>
        </Link>


        {/* APPOINTMENTS */}

        <Link
          to="/admin/appointments"
          className="admin-module-card"
        >
          <div className="admin-module-icon">
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
                d="M8 2V6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M16 2V6"
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

              <path
                d="M8 18H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

            </svg>
          </div>

          <div className="admin-module-content">
            <h3>Appointments</h3>
            <p>Manage patient appointment requests.</p>
          </div>

          <div className="admin-module-arrow">
            →
          </div>
        </Link>


        {/* VISITS & SCHEDULE */}

        <Link
          to="/admin/visits"
          className="admin-module-card"
        >
          <div className="admin-module-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 21S19 14.6 19 9.5A7 7 0 1 0 5 9.5C5 14.6 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="12" cy="9.5" r="2.2" stroke="currentColor" strokeWidth="2" />
              <path d="M16.5 16.5L20.5 20.5M18.2 18.2L20 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="admin-module-content">
            <h3>Visits & Schedule</h3>
            <p>Manage nurse visits and schedules.</p>
          </div>

          <div className="admin-module-arrow">
            →
          </div>
        </Link>


        {/* ADMIN VISIT REPORTS */}

        <Link
          to="/admin/visit-reports"
          className="admin-module-card"
        >
          <div className="admin-module-icon">
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

          <div className="admin-module-content">
            <h3>Admin Visit Reports</h3>
            <p>Review and manage nurse visit reports.</p>
          </div>

          <div className="admin-module-arrow">
            →
          </div>
        </Link>


        {/* AVAILABILITY */}

        <Link
          to="/admin/availability"
          className="admin-module-card"
        >
          <div className="admin-module-icon">
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

              <path
                d="M7 18L5 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M17 18L19 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

            </svg>
          </div>

          <div className="admin-module-content">
            <h3>Availability</h3>
            <p>Manage nurse availability and working hours.</p>
          </div>

          <div className="admin-module-arrow">
            →
          </div>
        </Link>

      </div>
    </div>
  );
}

export default AdminDashboard;