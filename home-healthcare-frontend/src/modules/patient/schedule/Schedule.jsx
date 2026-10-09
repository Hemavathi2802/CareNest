import React, { useEffect, useState } from "react";
import "./Schedule.css";
import { getPatientSchedule } from "./scheduleService";

function Schedule() {
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

      const data = await getPatientSchedule();

      setSchedule(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Schedule loading error:", err);
      setError("Unable to load schedule");
    } finally {
      setLoading(false);
    }
  };

  // Convert 24-hour time to AM/PM
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

  // Calendar SVG Icon
  const CalendarIcon = ({ small = false }) => (
    <svg
      className={small ? "schedule-small-icon" : "schedule-calendar-icon"}
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

  // Clock SVG Icon
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

  // Nurse SVG Icon
  const NurseIcon = () => (
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

  // Location SVG Icon
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

  // Healthcare / Stethoscope SVG Icon
  const HealthIcon = () => (
    <svg
      className="schedule-health-icon"
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

  // Check SVG Icon
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
    <div className="patient-schedule-page">

      {/* ================= HEADER ================= */}

      <div className="patient-schedule-header">

        <span className="patient-schedule-label">
          YOUR CARE
        </span>

        <h1>My Schedule</h1>

        <p>
          View your upcoming healthcare visits and appointments.
        </p>

      </div>


      {/* ================= MAIN CARD ================= */}

      <div className="patient-schedule-container">

        <div className="patient-schedule-card">

          {/* CARD HEADER */}

          <div className="patient-schedule-card-header">

            <div className="patient-schedule-card-title">

              <div className="patient-schedule-main-icon">
                <CalendarIcon />
              </div>

              <div>
                <h2>Upcoming Schedule</h2>

                <p>
                  Your scheduled healthcare visits
                </p>
              </div>

            </div>

            <div className="patient-schedule-header-art">
              <CalendarIcon />
            </div>

          </div>


          {/* ================= LOADING ================= */}

          {loading && (
            <div className="patient-schedule-message">
              Loading your schedule...
            </div>
          )}


          {/* ================= ERROR ================= */}

          {!loading && error && (
            <div className="patient-schedule-error">

              <div className="patient-schedule-error-icon">
                !
              </div>

              <h3>
                Unable to Load Schedule
              </h3>

              <p>{error}</p>

              <button
                className="patient-schedule-retry-btn"
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
              <div className="patient-schedule-empty">

                <div className="patient-schedule-empty-icon">
                  <CalendarIcon />
                </div>

                <h3>
                  No Upcoming Schedule
                </h3>

                <p>
                  Your upcoming healthcare visits will appear here.
                </p>

              </div>
            )}


          {/* ================= SCHEDULE LIST ================= */}

          {!loading &&
            !error &&
            schedule.length > 0 && (

              <div className="patient-schedule-list">

                {schedule.map((item, index) => (

                  <div
                    className="patient-schedule-item"
                    key={item.id || index}
                  >

                    {/* DATE + TIME */}

                    <div className="patient-schedule-date-box">

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


                    {/* DETAILS */}

                    <div className="patient-schedule-details">

                      <div className="schedule-service-title">

                        <div className="schedule-health-icon-box">
                          <HealthIcon />
                        </div>

                        <h3>
                          {item.title || "Healthcare Visit"}
                        </h3>

                      </div>


                      <div className="schedule-detail-row">

                        <div className="schedule-detail-icon">
                          <NurseIcon />
                        </div>

                        <div>
                          <span>NURSE</span>
                          <p>
                            {item.nurseName || "Healthcare Nurse"}
                          </p>
                        </div>

                      </div>


                      <div className="schedule-detail-row">

                        <div className="schedule-detail-icon">
                          <LocationIcon />
                        </div>

                        <div>
                          <span>LOCATION</span>
                          <p>
                            {item.location || "Home Visit"}
                          </p>
                        </div>

                      </div>

                    </div>


                    {/* STATUS */}

                    <div className="patient-schedule-status-wrapper">

                      <div className="patient-schedule-status">

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

export default Schedule;