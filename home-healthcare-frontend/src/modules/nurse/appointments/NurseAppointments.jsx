import { API_ORIGIN } from "../../../apiBase.js";
import React, { useCallback, useEffect, useState } from "react";
import "./NurseAppointments.css";
import "../nurse-module-theme.css";

const API_URL = `${API_ORIGIN}/api`;

function NurseAppointments() {
  // =====================================================
  // LOGGED IN NURSE
  // =====================================================

  let loggedInUser = null;

  try {
    loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser")
    );
  } catch (error) {
    console.error("Unable to read logged in user:", error);
  }

  const nurseId = loggedInUser?.id;

  // =====================================================
  // STATES
  // =====================================================

  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationError, setNotificationError] = useState("");

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // GET NURSE APPOINTMENTS
  // =====================================================

  const fetchAppointments = useCallback(async () => {
    if (!nurseId) {
      setErrorMessage(
        "Nurse login information not found. Please login again."
      );

      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `${API_URL}/appointments/nurse/${nurseId}`,
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

      console.log("Nurse appointments:", data);

      setAppointments(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Fetch appointments error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  }, [nurseId]);

  const fetchNotifications = useCallback(async () => {
    if (!nurseId) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/notifications/nurse/${nurseId}`
      );

      if (!response.ok) {
        throw new Error("Unable to load nurse notifications.");
      }

      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
      setNotificationError("");
    } catch (error) {
      console.error("Fetch nurse notifications error:", error);
      setNotificationError(
        error.message || "Unable to load nurse notifications."
      );
    }
  }, [nurseId]);

  const markNotificationRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/nurse/${nurseId}/${notificationId}/read`,
        { method: "PUT" }
      );

      if (!response.ok) {
        throw new Error("Unable to mark notification as read.");
      }

      const updated = await response.json();
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === updated.id ? updated : notification
        )
      );
    } catch (error) {
      console.error("Mark nurse notification as read error:", error);
      setNotificationError(
        error.message || "Unable to update notification."
      );
    }
  };

  // =====================================================
  // LOAD APPOINTMENTS
  // =====================================================

  useEffect(() => {
    fetchAppointments();
    fetchNotifications();

    const intervalId = window.setInterval(fetchNotifications, 60000);
    return () => window.clearInterval(intervalId);
  }, [fetchAppointments, fetchNotifications]);

  // =====================================================
  // SUCCESS MESSAGE
  // =====================================================

  const showSuccess = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // =====================================================
  // ERROR MESSAGE
  // =====================================================

  const showError = (message) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage("");
    }, 4000);
  };

  // =====================================================
  // ACCEPT APPOINTMENT
  // IMPORTANT: PUT
  // =====================================================

  const handleAccept = async (appointmentId) => {
    if (!appointmentId) {
      showError("Invalid appointment ID.");
      return;
    }

    try {
      setActionLoading(appointmentId);
      setErrorMessage("");

      console.log(
        "Accepting appointment:",
        appointmentId
      );

      const response = await fetch(
        `${API_URL}/appointments/${appointmentId}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        let message =
          "Unable to accept appointment.";

        try {
          const errorText = await response.text();

          if (errorText) {
            try {
              const errorData =
                JSON.parse(errorText);

              message =
                errorData.message ||
                errorData.error ||
                errorText;
            } catch {
              message = errorText;
            }
          }
        } catch (error) {
          console.error(
            "Error reading accept response:",
            error
          );
        }

        throw new Error(message);
      }

      const updatedAppointment =
        await response.json();

      console.log(
        "Accepted appointment:",
        updatedAppointment
      );

      // Update only this appointment
      setAppointments(
        (previousAppointments) =>
          previousAppointments.map(
            (appointment) =>
              appointment.id === appointmentId
                ? updatedAppointment
                : appointment
          )
      );

      showSuccess(
        "Appointment accepted successfully."
      );
    } catch (error) {
      console.error(
        "Accept appointment error:",
        error
      );

      showError(
        error.message ||
          "Unable to accept appointment."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // REJECT APPOINTMENT
  // IMPORTANT: PUT
  // =====================================================

  const handleReject = async (appointmentId) => {
    if (!appointmentId) {
      showError("Invalid appointment ID.");
      return;
    }

    try {
      setActionLoading(appointmentId);
      setErrorMessage("");

      console.log(
        "Rejecting appointment:",
        appointmentId
      );

      const response = await fetch(
        `${API_URL}/appointments/${appointmentId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        let message =
          "Unable to reject appointment.";

        try {
          const errorText = await response.text();

          if (errorText) {
            try {
              const errorData =
                JSON.parse(errorText);

              message =
                errorData.message ||
                errorData.error ||
                errorText;
            } catch {
              message = errorText;
            }
          }
        } catch (error) {
          console.error(
            "Error reading reject response:",
            error
          );
        }

        throw new Error(message);
      }

      const updatedAppointment =
        await response.json();

      console.log(
        "Rejected appointment:",
        updatedAppointment
      );

      // Update only this appointment
      setAppointments(
        (previousAppointments) =>
          previousAppointments.map(
            (appointment) =>
              appointment.id === appointmentId
                ? updatedAppointment
                : appointment
          )
      );

      showSuccess(
        "Appointment rejected successfully."
      );
    } catch (error) {
      console.error(
        "Reject appointment error:",
        error
      );

      showError(
        error.message ||
          "Unable to reject appointment."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
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

    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    if (isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.getDate();
  };

  // =====================================================
  // GET MONTH
  // =====================================================

  const getMonth = (date) => {
    if (!date) {
      return "---";
    }

    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    if (isNaN(parsedDate.getTime())) {
      return "---";
    }

    return parsedDate
      .toLocaleDateString(
        "en-IN",
        {
          month: "short",
        }
      )
      .toUpperCase();
  };

  // =====================================================
  // FORMAT TIME
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
    date.setSeconds(0);

    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  // =====================================================
  // GET STATUS
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
            CARENEST • NURSE WORKSPACE
          </span>

          <h1>
            Manage Your
            <br />
            <span>
              Patient Appointments
            </span>
          </h1>

          <p>
            Review patient appointment
            requests and manage your
            healthcare schedule.
          </p>

        </div>

        <div className="hero-decoration">

          <div className="hero-circle circle-purple"></div>

          <div className="hero-circle circle-pink"></div>

          <div className="hero-circle circle-blue"></div>

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

      <section className="nurse-notifications" aria-labelledby="nurse-notifications-heading">
        <div className="nurse-notifications-heading">
          <div>
            <span className="small-heading">UPDATES</span>
            <h2 id="nurse-notifications-heading">Appointment Notifications</h2>
          </div>
          <span className="notification-count">
            {notifications.filter((notification) => !notification.read).length} unread
          </span>
        </div>

        {notificationError && (
          <p className="notification-error" role="alert">
            {notificationError}
          </p>
        )}

        {notifications.length === 0 ? (
          <p className="notification-empty">
            New appointment assignment notifications will appear here.
          </p>
        ) : (
          <ul className="nurse-notification-list">
            {notifications.map((notification) => (
              <li
                className={`nurse-notification${notification.read ? " is-read" : ""}`}
                key={notification.id}
              >
                <span className="notification-indicator" aria-hidden="true">
                  {notification.read ? "✓" : "●"}
                </span>
                <div className="notification-copy">
                  <p>{notification.message}</p>
                  <time dateTime={notification.createdAt}>
                    {new Date(notification.createdAt).toLocaleString("en-IN")}
                  </time>
                </div>
                {!notification.read && (
                  <button
                    className="notification-read-button"
                    type="button"
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    Mark read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* =================================================
          APPOINTMENTS
      ================================================= */}

      <section className="your-appointments">

        <div className="appointments-heading">

          <div>

            <span className="small-heading">
              NURSE WORKSPACE
            </span>

            <h2>
              Patient Appointments
            </h2>

            <p>
              Review and respond to
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
              your appointments.
            </p>

          </div>

        ) : appointments.length === 0 ? (

          <div className="empty-appointments">

            <div className="empty-calendar">
              ♡
            </div>

            <h3>
              No appointments found
            </h3>

            <p>
              New patient appointment
              requests will appear here.
            </p>

          </div>

        ) : (

          <div className="appointment-list">

            {appointments.map(
              (appointment) => {

                const status =
                  String(
                    appointment.status ||
                    "PENDING"
                  ).toLowerCase();

                const isPending =
                  status === "pending";

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
                        {appointment.patientName ||
                          `Patient ID: ${appointment.patientId}`}
                      </h3>

                      <p>
                        {appointment.service ||
                          "Healthcare Appointment"}
                      </p>

                      <div className="appointment-meta">

                        <span>
                          🆔 Patient ID:{" "}
                          {appointment.patientId}
                        </span>

                        <span>
                          👩‍⚕️ Nurse ID:{" "}
                          {appointment.nurseId}
                        </span>

                        {appointment.nurseName && (

                          <span>
                            👩‍⚕️ Nurse:{" "}
                            {appointment.nurseName}
                          </span>

                        )}

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

                      {/* STATUS */}

                      <div
                        className={getStatusClass(
                          appointment.status
                        )}
                      >

                        <span className="status-dot">
                        </span>

                        {getStatus(
                          appointment.status
                        )}

                      </div>

                      {/* =================================================
                          ACCEPT / REJECT
                      ================================================= */}

                      {isPending && (

                        <div className="action-buttons">

                          <button
                            type="button"
                            className="accept-btn"
                            disabled={
                              actionLoading ===
                              appointment.id
                            }
                            onClick={() =>
                              handleAccept(
                                appointment.id
                              )
                            }
                          >

                            {actionLoading ===
                            appointment.id
                              ? "Processing..."
                              : "Accept"}

                          </button>

                          <button
                            type="button"
                            className="reject-btn"
                            disabled={
                              actionLoading ===
                              appointment.id
                            }
                            onClick={() =>
                              handleReject(
                                appointment.id
                              )
                            }
                          >

                            {actionLoading ===
                            appointment.id
                              ? "Processing..."
                              : "Reject"}

                          </button>

                        </div>

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
              Success
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

export default NurseAppointments;