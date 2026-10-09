import { API_ORIGIN } from "../../../apiBase.js";
import React, { useEffect, useState } from "react";
import "./NurseSchedule.css";
import "../nurse-module-theme.css";

function NurseSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      setError("");

      const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
      );

      if (!loggedInUser || !loggedInUser.id) {
        throw new Error("User ID not found");
      }

      const nurseId = loggedInUser.id;

      const response = await fetch(
        `${API_ORIGIN}/api/nurse/${nurseId}/schedule`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || "Unable to load schedule"
        );
      }

      const data = await response.json();

      setSchedule(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Nurse schedule loading error:",
        err
      );

      setError(
        "Unable to load schedule"
      );

      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // TIME FORMAT
  // =========================

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


  // =========================
  // CALENDAR ICON
  // =========================

  const CalendarIcon = ({ small = false }) => (
    <svg
      className={
        small
          ? "schedule-small-icon"
          : "schedule-calendar-icon"
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


  // =========================
  // CLOCK ICON
  // =========================

  const ClockIcon = () => (
    <svg
      className="schedule-clock-icon"
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


  // =========================
  // PATIENT ICON
  // =========================

  const PatientIcon = () => (
    <svg
      className="schedule-info-icon"
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


  // =========================
  // LOCATION ICON
  // =========================

  const LocationIcon = () => (
    <svg
      className="schedule-info-icon"
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


  // =========================
  // HEALTHCARE / HOME ICON
  // =========================

  const HealthIcon = () => (
    <svg
      className="schedule-health-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 11L12 3L21 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 10V21H19V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <path
        d="M9 21V15H15V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );


  // =========================
  // CHECK ICON
  // =========================

  const CheckIcon = () => (
    <svg
      className="schedule-check-icon"
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
    <div className="nurse-schedule-page">


      {/* ================= HEADER ================= */}

      <div className="nurse-schedule-header">

        <span className="nurse-schedule-label">
          CARENEST • NURSE PORTAL
        </span>

        <h1>
          My Schedule
        </h1>

        <p>
          View your upcoming patient visits and daily schedule.
        </p>

      </div>


      {/* ================= MAIN CONTAINER ================= */}

      <div className="nurse-schedule-container">


        {/* ================= MAIN CARD ================= */}

        <div className="nurse-schedule-card-wrapper">


          {/* ================= CARD HEADER ================= */}

          <div className="nurse-schedule-card-header">

            <div className="nurse-schedule-card-title">

              <div className="nurse-schedule-main-icon">
                <CalendarIcon />
              </div>

              <div>

                <h2>
                  Upcoming Schedule
                </h2>

                <p>
                  Your scheduled patient visits
                </p>

              </div>

            </div>

          </div>


          {/* ================= LOADING ================= */}

          {loading && (
            <div className="nurse-schedule-message">
              Loading your schedule...
            </div>
          )}


          {/* ================= ERROR ================= */}

          {!loading && error && (

            <div className="nurse-schedule-error">

              <div className="nurse-schedule-error-icon">
                !
              </div>

              <h3>
                Unable to Load Schedule
              </h3>

              <p>
                {error}
              </p>

              <button
                className="nurse-schedule-retry-btn"
                onClick={loadSchedule}
              >
                Try Again
              </button>

            </div>

          )}


          {/* ================= EMPTY ================= */}

          {!loading &&
            !error &&
            schedule.length === 0 && (

              <div className="nurse-schedule-empty">

                <div className="nurse-schedule-empty-icon">
                  <CalendarIcon />
                </div>

                <h3>
                  No Upcoming Schedule
                </h3>

                <p>
                  Your upcoming patient visits will appear here.
                </p>

              </div>

            )}


          {/* ================= SCHEDULE LIST ================= */}

          {!loading &&
            !error &&
            schedule.length > 0 && (

              <div className="nurse-schedule-list">

                {schedule.map((item, index) => (

                  <div
                    className="nurse-schedule-item"
                    key={item.id || index}
                  >


                    {/* ================= DATE + TIME ================= */}

                    <div className="nurse-schedule-date-box">


                      {/* DATE */}

                      <div className="schedule-date-row">

                        <div className="schedule-date-icon-box">
                          <CalendarIcon small />
                        </div>

                        <div>

                          <span className="schedule-label">
                            DATE
                          </span>

                          <strong>
                            {item.date || "--"}
                          </strong>

                        </div>

                      </div>


                      <div className="schedule-divider"></div>


                      {/* TIME */}

                      <div className="schedule-date-row">

                        <div className="schedule-date-icon-box">
                          <ClockIcon />
                        </div>

                        <div>

                          <span className="schedule-label">
                            TIME
                          </span>

                          <strong>
                            {formatTime(item.time)}
                          </strong>

                        </div>

                      </div>

                    </div>


                    {/* ================= PATIENT DETAILS ================= */}

                    <div className="nurse-schedule-details">


                      {/* PATIENT TITLE */}

                      <div className="schedule-service-title">

                        <div className="schedule-health-icon-box">
                          <PatientIcon />
                        </div>

                        <h3>
                          {item.patientName || "Patient"}
                        </h3>

                      </div>


                      {/* PATIENT ID */}

                      <div className="schedule-detail-row">

                        <div className="schedule-detail-icon">
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


                      {/* VISIT */}

                      <div className="schedule-detail-row">

                        <div className="schedule-detail-icon">
                          <HealthIcon />
                        </div>

                        <div>

                          <span>
                            VISIT
                          </span>

                          <p>
                            {item.visitType || "Home Visit"}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* ================= LOCATION ================= */}

                    <div className="nurse-schedule-location-box">

                      <div className="schedule-detail-row">

                        <div className="schedule-detail-icon">
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

                    <div className="nurse-schedule-status-wrapper">

                      <div className="nurse-schedule-status">

                        <div className="schedule-status-check">
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

export default NurseSchedule;