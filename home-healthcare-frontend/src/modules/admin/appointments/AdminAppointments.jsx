import { API_ORIGIN } from "../../../apiBase.js";
import React, { useEffect, useState } from "react";
import "./AdminAppointments.css";
import "../admin-module-theme.css";

function AdminAppointments() {
  // =====================================================
  // BACKEND API
  // =====================================================

  const API_URL = `${API_ORIGIN}/api`;

  // =====================================================
  // STATES
  // =====================================================

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // =====================================================
  // GET ALL APPOINTMENTS - ADMIN
  // =====================================================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `${API_URL}/appointments`,
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
          message || "Unable to load appointments."
        );
      }

      const data = await response.json();

      console.log("Admin Appointments:", data);

      setAppointments(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error(
        "Fetch appointments error:",
        error
      );

      setAppointments([]);

      setErrorMessage(
        error.message ||
        "Unable to load appointments."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD APPOINTMENTS
  // =====================================================

  useEffect(() => {
    fetchAppointments();
  }, []);

  // =====================================================
  // CANCEL APPOINTMENT
  // =====================================================

  const handleCancel = async (appointmentId) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      console.log(
        "Cancelling appointment:",
        appointmentId
      );

      const response = await fetch(
        `${API_URL}/appointments/${appointmentId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message ||
          "Unable to cancel appointment."
        );
      }

      const updatedAppointment =
        await response.json();

      console.log(
        "Appointment cancelled:",
        updatedAppointment
      );

      // Update appointment in UI
      setAppointments(
        (previousAppointments) =>
          previousAppointments.map(
            (appointment) =>
              appointment.id === appointmentId
                ? updatedAppointment
                : appointment
          )
      );

      setSuccessMessage(
        "Appointment cancelled successfully."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (error) {
      console.error(
        "Cancel appointment error:",
        error
      );

      setErrorMessage(
        error.message ||
        "Unable to cancel appointment."
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    }
  };

  // =====================================================
  // CONFIRM CANCEL
  // =====================================================

  const confirmCancel = (appointmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (confirmed) {
      handleCancel(appointmentId);
    }
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    const appointmentDate = new Date(date);

    if (
      Number.isNaN(
        appointmentDate.getTime()
      )
    ) {
      return date;
    }

    return appointmentDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // TIME FORMAT
  // =====================================================

  const formatTime = (time) => {
    if (!time) {
      return "Time not available";
    }

    const parts = time.split(":");

    if (parts.length < 2) {
      return time;
    }

    const hour = Number(parts[0]);

    const minute = Number(parts[1]);

    if (
      Number.isNaN(hour) ||
      Number.isNaN(minute)
    ) {
      return time;
    }

    const date = new Date();

    date.setHours(hour);

    date.setMinutes(minute);

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // GET DAY
  // =====================================================

  const getDay = (date) => {
    if (!date) {
      return "--";
    }

    const appointmentDate = new Date(date);

    if (
      Number.isNaN(
        appointmentDate.getTime()
      )
    ) {
      return "--";
    }

    return appointmentDate.getDate();
  };

  // =====================================================
  // GET MONTH
  // =====================================================

  const getMonth = (date) => {
    if (!date) {
      return "---";
    }

    const appointmentDate = new Date(date);

    if (
      Number.isNaN(
        appointmentDate.getTime()
      )
    ) {
      return "---";
    }

    return appointmentDate
      .toLocaleDateString(
        "en-IN",
        {
          month: "short",
        }
      )
      .toUpperCase();
  };

  // =====================================================
  // STATUS TEXT
  // =====================================================

  const getStatus = (status) => {
    if (!status) {
      return "Pending";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (
      String(status || "")
        .toLowerCase()
    ) {
      case "accepted":
        return "accepted-badge";

      case "rejected":
        return "rejected-badge";

      case "cancelled":
        return "cancelled-badge";

      default:
        return "pending-badge";
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="appointment-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="appointment-hero">

        <div className="hero-content">

          <span className="hero-label">
            CARENEST • ADMIN WORKSPACE
          </span>

          <h1>
            Manage Your
            <br />

            <span>
              Appointments
            </span>
          </h1>

          <p>
            Review patient appointments and
            manage healthcare schedules.
          </p>

        </div>

        {/* =================================================
            HERO DECORATION
        ================================================= */}

        <div className="hero-decoration">

          <div className="hero-circle circle-purple"></div>

          <div className="hero-circle circle-pink"></div>

          <div className="hero-circle circle-blue"></div>

          {/* CALENDAR */}

          <div className="calendar-card">

            <div className="calendar-top">

              <span>
                APPOINTMENTS
              </span>

              <span>
                ♡
              </span>

            </div>

            <div className="calendar-month">

              <strong>
                CARE
              </strong>

              <small>
                Schedule
              </small>

            </div>

            <div className="calendar-grid">

              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>

              <i>1</i>
              <i>2</i>
              <i>3</i>
              <i>4</i>
              <i>5</i>
              <i>6</i>
              <i>7</i>

              <i>8</i>
              <i>9</i>

              <i className="active-day">
                10
              </i>

              <i>11</i>
              <i>12</i>
              <i>13</i>
              <i>14</i>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          APPOINTMENTS
      ================================================= */}

      <section className="your-appointments">

        {/* =================================================
            HEADING
        ================================================= */}

        <div className="appointments-heading">

          <div>

            <span className="small-heading">
              ADMIN WORKSPACE
            </span>

            <h2>
              All Appointments
            </h2>

            <p>
              Review and manage patient
              appointment requests.
            </p>

          </div>

          <div className="appointment-number">

            <strong>
              {appointments.length}
            </strong>

            <span>
              TOTAL
            </span>

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {errorMessage && (

          <div className="availability-error">

            <span>
              !
            </span>

            <span>
              {errorMessage}
            </span>

          </div>

        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="empty-appointments">

            <div className="empty-calendar">
              ⏳
            </div>

            <h3>
              Loading appointments...
            </h3>

            <p>
              Please wait while we load
              the appointments.
            </p>

          </div>

        ) : appointments.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="empty-appointments">

            <div className="empty-calendar">
              ♡
            </div>

            <h3>
              No appointments found
            </h3>

            <p>
              Appointments will appear here.
            </p>

          </div>

        ) : (

          /* =================================================
             APPOINTMENT LIST
          ================================================= */

          <div className="appointment-list">

            {appointments.map(
              (appointment) => {

                return (

                  <article
                    className="appointment-card"
                    key={appointment.id}
                  >

                    {/* =================================================
                        DATE
                    ================================================= */}

                    <div className="date-box">

                      <span>
                        {getMonth(
                          appointment.date
                        )}
                      </span>

                      <strong>
                        {getDay(
                          appointment.date
                        )}
                      </strong>

                    </div>

                    {/* =================================================
                        INFORMATION
                    ================================================= */}

                    <div className="appointment-info">

                      <h3>
                        Patient ID:{" "}
                        {appointment.patientId ||
                          "Not Available"}
                      </h3>

                      <p>
                        {appointment.service ||
                          "Healthcare Appointment"}
                      </p>

                      <div className="appointment-meta">

                        <span>
                          📅{" "}
                          {formatDate(
                            appointment.date
                          )}
                        </span>

                        <span>
                          🕐{" "}
                          {formatTime(
                            appointment.time
                          )}
                        </span>

                        <span>
                          👩‍⚕️ Nurse ID:{" "}
                          {appointment.nurseId ||
                            "Not Assigned"}
                        </span>

                        {appointment.patientName && (

                          <span>
                            👤 Patient:{" "}
                            {appointment.patientName}
                          </span>

                        )}

                        {appointment.nurseName && (

                          <span>
                            👩‍⚕️ Nurse:{" "}
                            {appointment.nurseName}
                          </span>

                        )}

                        {appointment.notes && (

                          <span>
                            📝 Notes:{" "}
                            {appointment.notes}
                          </span>

                        )}

                      </div>

                    </div>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="appointment-actions">

                      <div
                        className={getStatusClass(
                          appointment.status
                        )}
                      >

                        <span className="status-dot"></span>

                        {getStatus(
                          appointment.status
                        )}

                      </div>

                      {/* =================================================
                          CANCEL
                      ================================================= */}

                      {String(
                        appointment.status || ""
                      ).toUpperCase() !==
                        "CANCELLED" && (

                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() =>
                            confirmCancel(
                              appointment.id
                            )
                          }
                        >
                          Cancel Appointment
                        </button>

                      )}

                    </div>

                  </article>

                );
              }
            )}

          </div>

        )}

      </section>

      {/* =================================================
          SUCCESS TOAST
      ================================================= */}

      {successMessage && (

        <div className="success-toast">

          <div className="success-check">
            ✓
          </div>

          <div className="success-text">

            <strong>
              Appointment Update
            </strong>

            <span>
              {successMessage}
            </span>

          </div>

        </div>

      )}

      {/* =================================================
          ERROR TOAST
      ================================================= */}

      {errorMessage && (

        <div className="error-toast">

          <div className="error-check">
            !
          </div>

          <div className="error-text">

            <strong>
              Error
            </strong>

            <span>
              {errorMessage}
            </span>

          </div>

        </div>

      )}

    </main>
  );
}

export default AdminAppointments;