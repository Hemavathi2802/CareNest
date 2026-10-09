import { API_ORIGIN } from "../../../apiBase.js";
import React, { useEffect, useState } from "react";
import "./AdminVisits.css";
import "../admin-module-theme.css";

function AdminVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_ORIGIN}/api/admin/schedule`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      setVisits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Admin visits loading error:", err);
      setError("Unable to load visit schedule");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Convert 24 hour time to AM/PM
  // ================================

  const formatTime = (time) => {
    if (!time) return "--";

    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);

    if (isNaN(hour)) {
      return time;
    }

    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${period}`;
  };

  // ================================
  // Calendar Icon
  // ================================

  const CalendarIcon = ({ small = false }) => (
    <svg
      className={
        small
          ? "admin-schedule-small-icon"
          : "admin-schedule-calendar-icon"
      }
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M16 3V7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M8 3V7"
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
        d="M8 14H8.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="M12 14H12.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="M16 14H16.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="M8 17H8.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="M12 17H12.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  // ================================
  // Clock Icon
  // ================================

  const ClockIcon = () => (
    <svg
      className="admin-schedule-clock-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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
  );

  // ================================
  // Patient Icon
  // ================================

  const PatientIcon = () => (
    <svg
      className="admin-schedule-info-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="7"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M5 21C5 17.5 8 15 12 15C16 15 19 17.5 19 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  // ================================
  // Location Icon
  // ================================

  const LocationIcon = () => (
    <svg
      className="admin-schedule-info-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 10C20 15.5 12 21 12 21C12 21 4 15.5 4 10C4 5.6 7.6 2 12 2C16.4 2 20 5.6 20 10Z"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="12"
        cy="10"
        r="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );

  // ================================
  // Healthcare Icon
  // ================================

  const HealthIcon = () => (
    <svg
      className="admin-schedule-health-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 3V8C6 11.3 8.7 14 12 14C15.3 14 18 11.3 18 8V3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M4 3H8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M16 3H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M12 14V17C12 19.2 13.8 21 16 21H17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <circle
        cx="19"
        cy="19"
        r="2"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );

  // ================================
  // Check Icon
  // ================================

  const CheckIcon = () => (
    <svg
      className="admin-schedule-check-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12.5L9.5 17L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="admin-visits-page">

      {/* ================= HEADER ================= */}

      <div className="admin-visits-header">

        <span className="admin-visits-label">
          ADMIN MODULE
        </span>

        <h1>
          Visits &amp; Schedule
        </h1>

        <p>
          View and monitor all scheduled patient home visits.
        </p>

        <div className="admin-visits-count">
          {visits.length} Scheduled Visits
        </div>

      </div>


      {/* ================= REFRESH ================= */}

      <div className="admin-visits-toolbar">

        <button
          className="admin-add-visit-btn"
          onClick={loadVisits}
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 11A8 8 0 0 0 6.3 5.2"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            <path
              d="M4 5V10H9"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M4 13A8 8 0 0 0 17.7 18.8"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            <path
              d="M20 19V14H15"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>
            Refresh
          </span>

        </button>

      </div>


      {/* ================= MAIN CARD ================= */}

      <div className="admin-visits-container">

        <div className="admin-visits-card">


          {/* ================= CARD HEADER ================= */}

          <div className="admin-visits-card-header">

            <div className="admin-visits-card-title">

              {/* ONLY ONE MAIN CALENDAR ICON */}

              <div className="admin-visits-main-icon">
                <CalendarIcon />
              </div>

              <div>

                <h2>
                  Visit Schedule
                </h2>

                <p>
                  Accepted appointments scheduled for home visits.
                </p>

              </div>

            </div>

          </div>


          {/* ================= LOADING ================= */}

          {loading && (
            <div className="admin-visits-message">
              Loading visit schedule...
            </div>
          )}


          {/* ================= ERROR ================= */}

          {!loading && error && (
            <div className="admin-visits-error">

              <div className="admin-visits-error-icon">
                !
              </div>

              <h3>
                Unable to Load Visits
              </h3>

              <p>
                {error}
              </p>

              <button
                className="admin-visits-retry-btn"
                onClick={loadVisits}
                type="button"
              >
                Try Again
              </button>

            </div>
          )}


          {/* ================= EMPTY ================= */}

          {!loading &&
            !error &&
            visits.length === 0 && (

              <div className="admin-visits-empty">

                <div className="admin-visits-empty-icon">
                  <CalendarIcon />
                </div>

                <h3>
                  No Scheduled Visits
                </h3>

                <p>
                  Accepted patient home visits will appear here.
                </p>

              </div>

            )}


          {/* ================= VISIT LIST ================= */}

          {!loading &&
            !error &&
            visits.length > 0 && (

              <div className="admin-visits-list">

                {visits.map((item, index) => (

                  <div
                    className="admin-visit-item"
                    key={item.id || index}
                  >


                    {/* ================= DATE + TIME ================= */}

                    <div className="admin-visit-date-box">

                      <div className="admin-date-row">

                        <div className="admin-date-icon-box">
                          <CalendarIcon small />
                        </div>

                        <div>

                          <span className="admin-schedule-label">
                            DATE
                          </span>

                          <strong>
                            {item.date || "--"}
                          </strong>

                        </div>

                      </div>


                      <div className="admin-schedule-divider"></div>


                      <div className="admin-date-row">

                        <div className="admin-date-icon-box">
                          <ClockIcon />
                        </div>

                        <div>

                          <span className="admin-schedule-label">
                            TIME
                          </span>

                          <strong>
                            {formatTime(item.time)}
                          </strong>

                        </div>

                      </div>

                    </div>


                    {/* ================= DETAILS ================= */}

                    <div className="admin-visit-details">

                      <div className="admin-service-title">

                        <div className="admin-health-icon-box">
                          <HealthIcon />
                        </div>

                        <h3>
                          {item.service || "Healthcare Visit"}
                        </h3>

                      </div>


                      {/* PATIENT */}

                      <div className="admin-detail-row">

                        <div className="admin-detail-icon">
                          <PatientIcon />
                        </div>

                        <div>

                          <span>
                            PATIENT
                          </span>

                          <p>
                            {item.patientName || "Patient"}
                          </p>

                        </div>

                      </div>


                      {/* PATIENT ID */}

                      <div className="admin-detail-row">

                        <div className="admin-detail-icon">
                          <PatientIcon />
                        </div>

                        <div>

                          <span>
                            PATIENT ID
                          </span>

                          <p>
                            {item.patientId || "--"}
                          </p>

                        </div>

                      </div>


                      {/* NURSE */}

                      <div className="admin-detail-row">

                        <div className="admin-detail-icon">
                          <PatientIcon />
                        </div>

                        <div>

                          <span>
                            NURSE
                          </span>

                          <p>
                            {item.nurseName || "Healthcare Nurse"}
                          </p>

                        </div>

                      </div>


                      {/* LOCATION */}

                      <div className="admin-detail-row">

                        <div className="admin-detail-icon">
                          <LocationIcon />
                        </div>

                        <div>

                          <span>
                            LOCATION
                          </span>

                          <p>
                            {item.location || "Home Visit"}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* ================= STATUS ================= */}

                    <div className="admin-visit-status-wrapper">

                      <span className="admin-status-label">
                        STATUS
                      </span>

                      <div className="admin-visit-status">

                        <div className="admin-status-check">
                          <CheckIcon />
                        </div>

                        <span>
                          Scheduled
                        </span>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

        </div>

      </div>

    </div>
  );
}

export default AdminVisits;