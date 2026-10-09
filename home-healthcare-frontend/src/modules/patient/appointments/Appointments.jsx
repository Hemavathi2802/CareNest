import { API_ORIGIN } from "../../../apiBase.js";
import React, { useEffect, useState } from "react";
import "./Appointments.css";
import PatientNotifications from "./PatientNotifications";
import { getPatientProfile } from "../profile/profileService";

function Appointments() {
  // =========================================================
  // BACKEND API
  // =========================================================

  const API_URL = `${API_ORIGIN}/api`;

  // =========================================================
  // LOGGED IN PATIENT
  // =========================================================

  let loggedInUser = null;

  try {
    loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser")
    );
  } catch (error) {
    console.error(
      "Unable to read logged in user:",
      error
    );
  }

  const userId = loggedInUser?.id;

  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] = useState({
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  // =========================================================
  // APPOINTMENTS
  // =========================================================

  const [appointments, setAppointments] = useState([]);
  const [patientProfileId, setPatientProfileId] = useState(null);

  // =========================================================
  // STATES
  // =========================================================

  const [loading, setLoading] = useState(true);

  const [booking, setBooking] = useState(false);

  const [cancelLoading, setCancelLoading] =
    useState(false);

  const [cancelAppointmentId, setCancelAppointmentId] =
    useState(null);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // =========================================================
  // FETCH PATIENT APPOINTMENTS
  // =========================================================

  const fetchAppointments = async () => {
    if (!userId) {
      setErrorMessage(
        "Patient login information not found. Please login again."
      );

      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `${API_URL}/appointments/patient/${userId}`,
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

      console.log(
        "Patient appointments:",
        data
      );

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
  };

  // =========================================================
  // LOAD APPOINTMENTS
  // =========================================================

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  useEffect(() => {
    let isMounted = true;

    const fetchPatientProfileId = async () => {
      if (!userId) {
        setPatientProfileId(null);
        return;
      }

      try {
        const patient = await getPatientProfile(userId);
        if (isMounted) {
          setPatientProfileId(patient.patientId ?? null);
        }
      } catch (error) {
        console.error("Unable to load patient profile ID:", error);
        if (isMounted) {
          setPatientProfileId(null);
        }
      }
    };

    fetchPatientProfileId();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // =========================================================
  // HANDLE FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  // =========================================================
  // SHOW SUCCESS
  // =========================================================

  const showSuccess = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // =========================================================
  // SHOW ERROR
  // =========================================================

  const showError = (message) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage("");
    }, 4000);
  };

  // =========================================================
  // BOOK APPOINTMENT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    // -------------------------------------------------------
    // PATIENT ID
    // -------------------------------------------------------

    if (!userId) {
      showError(
        "Patient login information not found. Please login again."
      );

      return;
    }

    // -------------------------------------------------------
    // SERVICE
    // -------------------------------------------------------

    if (!formData.service) {
      showError(
        "Please select a healthcare service."
      );

      return;
    }

    // -------------------------------------------------------
    // DATE
    // -------------------------------------------------------

    if (!formData.date) {
      showError(
        "Please select a date."
      );

      return;
    }

    // -------------------------------------------------------
    // TIME
    // -------------------------------------------------------

    if (!formData.time) {
      showError(
        "Please select a time."
      );

      return;
    }

    try {
      setBooking(true);

      const appointmentData = {
        patientId: Number(userId),
        service: formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        status: "PENDING",
      };

      console.log(
        "Sending appointment:",
        appointmentData
      );

      const response = await fetch(
        `${API_URL}/appointments`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(
            appointmentData
          ),
        }
      );

      if (!response.ok) {
        let message =
          "Unable to book appointment.";

        try {
          const errorText =
            await response.text();

          if (errorText) {
            try {
              const errorData =
                JSON.parse(errorText);

              message =
                errorData.message ||
                errorData.error ||
                errorData.detail ||
                errorText;
            } catch {
              message = errorText;
            }
          }
        } catch (error) {
          console.error(
            "Error reading booking response:",
            error
          );
        }

        throw new Error(message);
      }

      const newAppointment =
        await response.json();

      console.log(
        "Appointment saved:",
        newAppointment
      );

      setPatientProfileId(newAppointment.patientId ?? null);
      setAppointments(
        (previous) => [
          newAppointment,
          ...previous,
        ]
      );

      setFormData({
        service: "",
        date: "",
        time: "",
        notes: "",
      });

      showSuccess(
        "Appointment booked successfully!"
      );
    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

      showError(
        error.message ||
          "Unable to book appointment."
      );
    } finally {
      setBooking(false);
    }
  };

  // =========================================================
  // OPEN CANCEL MODAL
  // =========================================================

  const openCancelModal = (appointmentId) => {
    setCancelAppointmentId(
      appointmentId
    );

    setErrorMessage("");
    setSuccessMessage("");
  };

  // =========================================================
  // CLOSE CANCEL MODAL
  // =========================================================

  const closeCancelModal = () => {
    if (cancelLoading) {
      return;
    }

    setCancelAppointmentId(null);
  };

  // =========================================================
  // CANCEL APPOINTMENT
  // =========================================================

  const handleCancel = async () => {
    if (!cancelAppointmentId) {
      return;
    }

    try {
      setCancelLoading(true);
      setErrorMessage("");

      console.log(
        "Cancelling appointment:",
        cancelAppointmentId
      );

      // =====================================================
      // IMPORTANT
      // Backend cancel endpoint:
      //
      // PUT /api/appointments/{id}/cancel
      //
      // This changes status to CANCELLED.
      // It does NOT delete the appointment.
      // =====================================================

      const response = await fetch(
        `${API_URL}/appointments/${cancelAppointmentId}/cancel`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        let message =
          "Unable to cancel appointment.";

        try {
          const errorText =
            await response.text();

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
            "Error reading cancel response:",
            error
          );
        }

        throw new Error(message);
      }

      // =====================================================
      // BACKEND RETURNS UPDATED APPOINTMENT
      // =====================================================

      const updatedAppointment =
        await response.json();

      console.log(
        "Appointment cancelled:",
        updatedAppointment
      );

      // =====================================================
      // UPDATE APPOINTMENT IN UI
      // =====================================================

      setAppointments(
        (previousAppointments) =>
          previousAppointments.map(
            (appointment) =>
              appointment.id ===
              cancelAppointmentId
                ? updatedAppointment
                : appointment
          )
      );

      // =====================================================
      // CLOSE POPUP
      // =====================================================

      setCancelAppointmentId(null);

      // =====================================================
      // SUCCESS
      // =====================================================

      showSuccess(
        "Appointment cancelled successfully."
      );
    } catch (error) {
      console.error(
        "Cancel appointment error:",
        error
      );

      showError(
        error.message ||
          "Unable to cancel appointment."
      );
    } finally {
      setCancelLoading(false);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (time) => {
    if (!time) {
      return "";
    }

    const [
      hour,
      minute,
    ] = time.split(":");

    const date = new Date();

    date.setHours(
      Number(hour)
    );

    date.setMinutes(
      Number(minute)
    );

    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  // =========================================================
  // GET DAY
  // =========================================================

  const getDay = (date) => {
    if (!date) {
      return "--";
    }

    return new Date(
      `${date}T00:00:00`
    ).getDate();
  };

  // =========================================================
  // GET MONTH
  // =========================================================

  const getMonth = (date) => {
    if (!date) {
      return "---";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        month: "short",
      }
    ).toUpperCase();
  };

  // =========================================================
  // TODAY
  // =========================================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // =========================================================
  // STATUS CLASS
  // =========================================================

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

  // =========================================================
  // STATUS TEXT
  // =========================================================

  const getStatusText = (status) => {
    if (!status) {
      return "Pending";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="appointment-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="appointment-hero">

        <div className="hero-content">

          <span className="hero-label">
            CARENEST • HOME HEALTHCARE
          </span>

          <h1>
            Schedule Your
            <br />

            <span>
              Healthcare Visit
            </span>
          </h1>

          <p>
            Book a convenient home healthcare
            appointment with our trusted care team.
          </p>

        </div>

        {/* ===================================================
            HERO DECORATION
        =================================================== */}

        <div className="hero-decoration">

          <div className="hero-circle circle-purple">
          </div>

          <div className="hero-circle circle-pink">
          </div>

          <div className="hero-circle circle-blue">
          </div>

          {/* CALENDAR */}

          <div className="calendar-card">

            <div className="calendar-top">

              <span>
                APPOINTMENT
              </span>

              <span>
                ♡
              </span>

            </div>

            <div className="calendar-month">

              <strong>
                {new Date()
                  .toLocaleDateString(
                    "en-IN",
                    {
                      month: "long",
                    }
                  )
                  .toUpperCase()}
              </strong>

              <small>
                {new Date().getFullYear()}
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

            </div>

          </div>

        </div>

      </section>

      <PatientNotifications />

      {/* =====================================================
          BOOK APPOINTMENT
      ===================================================== */}

      <section className="booking-section">

        <div className="booking-card">

          <div className="booking-title">

            <div className="title-icon">
              +
            </div>

            <div>

              <h2>
                Book an Appointment
              </h2>

              <p>
                Choose a service, date and time.
                We will automatically assign a nurse
                based on availability.
              </p>

            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* PATIENT ID */}

            <div className="input-group">

              <label>
                Patient ID
              </label>

              <input
                type="text"
                value={patientProfileId ?? ""}
                readOnly
                placeholder="Assigned after booking"
              />

            </div>

            {/* SERVICE */}

            <div className="input-group">

              <label>
                Healthcare Service
              </label>

              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select a service
                </option>

                <option value="Nursing Care">
                  Nursing Care
                </option>

                <option value="Elderly Care">
                  Elderly Care
                </option>

                <option value="Post-Surgery Care">
                  Post-Surgery Care
                </option>

                <option value="Physiotherapy">
                  Physiotherapy
                </option>

                <option value="Medication Assistance">
                  Medication Assistance
                </option>

                <option value="General Home Care">
                  General Home Care
                </option>

              </select>

            </div>

            {/* DATE */}

            <div className="input-group">

              <label>
                Preferred Date
              </label>

              <input
                type="date"
                name="date"
                min={today}
                value={formData.date}
                onChange={handleChange}
                required
              />

            </div>

            {/* TIME */}

            <div className="input-group">

              <label>
                Preferred Time
              </label>

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />

            </div>

            {/* NOTES */}

            <div className="input-group notes-group">

              <label>
                Additional Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Tell us anything we should know..."
              />

            </div>

            {/* ERROR */}

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

            {/* BOOK BUTTON */}

            <button
              type="submit"
              className="book-btn"
              disabled={booking}
            >

              {booking
                ? "Booking..."
                : "Book Appointment"}

              {!booking && (
                <span>
                  →
                </span>
              )}

            </button>

          </form>

        </div>

      </section>

      {/* =====================================================
          YOUR APPOINTMENTS
      ===================================================== */}

      <section className="your-appointments">

        <div className="appointments-heading">

          <div>

            <span className="small-heading">
              YOUR CARE
            </span>

            <h2>
              Your Appointments
            </h2>

            <p>
              Keep track of your healthcare visits.
            </p>

          </div>

          <div className="appointment-number">

            <strong>
              {appointments.length}
            </strong>

            <span>
              Total
            </span>

          </div>

        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (

          <div className="empty-appointments">

            <div className="empty-calendar">
              ⏳
            </div>

            <h3>
              Loading appointments...
            </h3>

            <p>
              Please wait while we fetch
              your appointments.
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
              No appointments yet
            </h3>

            <p>
              Your booked appointments will
              appear here.
            </p>

          </div>

        ) : (

          /* =================================================
             APPOINTMENT LIST
          ================================================= */

          <div className="appointment-list">

            {appointments.map(
              (appointment) => {

                const status =
                  String(
                    appointment.status ||
                      "PENDING"
                  ).toLowerCase();

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
                        {appointment.service ||
                          "Healthcare Appointment"}
                      </h3>

                      <p>
                        Home healthcare visit
                      </p>

                      <div className="appointment-meta">

                        {/* DATE */}

                        <span>
                          📅{" "}
                          {formatDate(
                            appointment.date
                          )}
                        </span>

                        {/* TIME */}

                        <span>
                          🕐{" "}
                          {formatTime(
                            appointment.time
                          )}
                        </span>

                        {/* NURSE */}

                        <span>
                          👩‍⚕️ Nurse ID:{" "}
                          {appointment.nurseId}
                        </span>

                        {/* NOTES */}

                        {appointment.notes && (
                          <span>
                            📝 Notes added
                          </span>
                        )}

                      </div>

                    </div>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="appointment-actions">

                      {/* STATUS */}

                      <span
                        className={getStatusClass(
                          appointment.status
                        )}
                      >

                        <span className="status-dot">
                        </span>

                        {getStatusText(
                          appointment.status
                        )}

                      </span>

                      {/* =================================================
                          CANCEL BUTTON
                          ALWAYS VISIBLE
                      ================================================= */}

                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() =>
                          openCancelModal(
                            appointment.id
                          )
                        }
                        disabled={
                          cancelLoading &&
                          cancelAppointmentId ===
                            appointment.id
                        }
                      >

                        {cancelLoading &&
                        cancelAppointmentId ===
                          appointment.id
                          ? "Cancelling..."
                          : "Cancel Appointment"}

                      </button>

                    </div>

                  </article>

                );
              }
            )}

          </div>

        )}

      </section>

      {/* =====================================================
          SUCCESS TOAST
      ===================================================== */}

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

      {/* =====================================================
          ERROR TOAST
      ===================================================== */}

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

      {/* =====================================================
          CANCEL CONFIRMATION MODAL
      ===================================================== */}

      {cancelAppointmentId && (

        <div
          className="cancel-modal-overlay"
          onClick={closeCancelModal}
        >

          <div
            className="cancel-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* ICON */}

            <div className="cancel-modal-icon">
              !
            </div>

            {/* TITLE */}

            <h3>
              Cancel Appointment?
            </h3>

            {/* MESSAGE */}

            <p>
              Are you sure you want to cancel
              this appointment?
            </p>

            {/* BUTTONS */}

            <div className="cancel-modal-actions">

              <button
                type="button"
                className="keep-appointment-btn"
                onClick={closeCancelModal}
                disabled={cancelLoading}
              >
                Keep Appointment
              </button>

              <button
                type="button"
                className="confirm-cancel-btn"
                onClick={handleCancel}
                disabled={cancelLoading}
              >

                {cancelLoading
                  ? "Cancelling..."
                  : "Yes, Cancel"}

              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default Appointments;