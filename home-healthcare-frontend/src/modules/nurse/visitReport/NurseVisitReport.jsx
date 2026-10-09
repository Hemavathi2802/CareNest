import { API_ORIGIN } from "../../../apiBase.js";
import React, { useEffect, useState } from "react";
import "./NurseVisitReport.css";
import "../nurse-module-theme.css";

function NurseVisitReport() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState("");

  const [formData, setFormData] = useState({
    visitDate: "",
    visitTime: "",
    symptoms: "",
    observations: "",
    treatment: "",
    medicines: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getLoggedInNurse = () => {
    try {
      const storedUser = localStorage.getItem("loggedInUser");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Unable to read logged in user:", error);
      return null;
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const user = getLoggedInNurse();

      if (!user || !user.id) {
        throw new Error("Nurse login information not found.");
      }

      const response = await fetch(
        `${API_ORIGIN}/api/appointments/nurse/${user.id}`
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load appointments. HTTP ${response.status}`
        );
      }

      const data = await response.json();

      const reportableAppointments = Array.isArray(data)
        ? data.filter(
            (appointment) => {
              const status = String(
                appointment.status || ""
              ).toUpperCase();

              return (
                appointment.patientId &&
                status !== "CANCELLED" &&
                status !== "CANCELED" &&
                status !== "REJECTED" &&
                status !== "COMPLETED"
              );
            }
          )
        : [];

      setAppointments(reportableAppointments);
    } catch (error) {
      console.error("Appointment loading error:", error);

      setMessage({
        type: "error",
        text:
          error.message ||
          "Unable to load nurse appointments.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentChange = (e) => {
    const appointmentId = e.target.value;

    setSelectedAppointment(appointmentId);

    setMessage({
      type: "",
      text: "",
    });

    const appointment = appointments.find(
      (item) =>
        String(item.id) === String(appointmentId)
    );

    if (appointment) {
      setFormData((previous) => ({
        ...previous,
        visitDate: appointment.date || "",
        visitTime: appointment.time || "",
      }));
    } else {
      setFormData((previous) => ({
        ...previous,
        visitDate: "",
        visitTime: "",
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    if (!selectedAppointment) {
      setMessage({
        type: "error",
        text: "Please select an appointment.",
      });
      return;
    }

    if (!formData.symptoms.trim()) {
      setMessage({
        type: "error",
        text: "Please enter the patient symptoms.",
      });
      return;
    }

    if (!formData.observations.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your observations.",
      });
      return;
    }

    if (!formData.treatment.trim()) {
      setMessage({
        type: "error",
        text: "Please enter the treatment details.",
      });
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_ORIGIN}/api/visit-reports`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appointmentId: Number(selectedAppointment),
            visitDate: formData.visitDate,
            visitTime: formData.visitTime,
            symptoms: formData.symptoms,
            observations: formData.observations,
            treatment: formData.treatment,
            medicines: formData.medicines,
            notes: formData.notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to submit visit report."
        );
      }

      setMessage({
        type: "success",
        text: "Visit report submitted successfully.",
      });

      setSelectedAppointment("");

      setFormData({
        visitDate: "",
        visitTime: "",
        symptoms: "",
        observations: "",
        treatment: "",
        medicines: "",
        notes: "",
      });

      await fetchAppointments();
    } catch (error) {
      console.error(
        "Visit report submission error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.message ||
          "Unable to submit visit report.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (time) => {
    if (!time) {
      return "--";
    }

    const parts = time.split(":");

    if (parts.length < 2) {
      return time;
    }

    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    if (isNaN(hours)) {
      return time;
    }

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;

    return `${formattedHour}:${minutes} ${period}`;
  };

  return (
    <div className="nurse-report-page">

      {/* HEADER */}

      <div className="nurse-report-header">

        <span className="nurse-report-label">
          CARENEST • NURSE PORTAL
        </span>

        <h1>
          Visit Report
        </h1>

        <p>
          Record and submit patient visit details.
        </p>

      </div>


      {/* MESSAGE BOX */}

      {message.text && (
        <div
          className={`nurse-report-alert ${
            message.type === "success"
              ? "success"
              : "error"
          }`}
        >

          <div className="nurse-report-alert-icon">

            {message.type === "success" ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
              >

                <path
                  d="M5 12.5L9.5 17L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
              >

                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M12 8V13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <circle
                  cx="12"
                  cy="16.5"
                  r="1"
                  fill="currentColor"
                />

              </svg>
            )}

          </div>

          <span>
            {message.text}
          </span>

        </div>
      )}


      {/* FORM CARD */}

      <div className="nurse-report-card">

        <div className="nurse-report-card-heading">

          <div className="nurse-report-heading-icon">

            <svg
              viewBox="0 0 24 24"
              fill="none"
            >

              <path
                d="M6 3H18V21H6V3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              <path
                d="M9 7H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M9 11H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M9 15H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

            </svg>

          </div>

          <div>

            <h2>
              Create Visit Report
            </h2>

            <p>
              Enter the details of the completed visit.
            </p>

          </div>

        </div>


        <form onSubmit={handleSubmit}>

          {/* APPOINTMENT */}

          <div className="nurse-report-field">

            <label>
              Appointment / Patient
            </label>

            {loading ? (
              <div className="nurse-report-loading">
                Loading appointments...
              </div>
            ) : appointments.length === 0 ? (
              <div className="nurse-report-loading">
                No active assigned appointments available.
              </div>
            ) : (
              <select
                value={selectedAppointment}
                onChange={handleAppointmentChange}
              >

                <option value="">
                  Select Patient Appointment
                </option>

                {appointments.map((appointment) => (
                  <option
                    key={appointment.id}
                    value={appointment.id}
                  >
                    {appointment.patientName ||
                      "Patient"}{" "}
                    —{" "}
                    {appointment.service ||
                      "Healthcare Visit"}{" "}
                    —{" "}
                    {appointment.date || "--"}{" "}
                    {appointment.time || ""}
                  </option>
                ))}

              </select>
            )}

          </div>


          {/* DATE + TIME */}

          <div className="nurse-report-row">

            <div className="nurse-report-field">

              <label>
                Visit Date
              </label>

              <input
                type="date"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleChange}
                readOnly
              />

            </div>


            <div className="nurse-report-field">

              <label>
                Visit Time
              </label>

              <input
                type="text"
                value={formatTime(formData.visitTime)}
                readOnly
              />

            </div>

          </div>


          {/* SYMPTOMS */}

          <div className="nurse-report-field">

            <label>
              Symptoms
            </label>

            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Enter patient's reported symptoms..."
              rows="4"
            />

          </div>


          {/* OBSERVATIONS */}

          <div className="nurse-report-field">

            <label>
              Observations
            </label>

            <textarea
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              placeholder="Enter your clinical observations..."
              rows="4"
            />

          </div>


          {/* TREATMENT */}

          <div className="nurse-report-field">

            <label>
              Treatment
            </label>

            <textarea
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              placeholder="Enter treatment or care provided..."
              rows="4"
            />

          </div>


          {/* MEDICINES */}

          <div className="nurse-report-field">

            <label>
              Medicines
            </label>

            <textarea
              name="medicines"
              value={formData.medicines}
              onChange={handleChange}
              placeholder="Enter medicines prescribed or administered..."
              rows="3"
            />

          </div>


          {/* NOTES */}

          <div className="nurse-report-field">

            <label>
              Nurse Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add additional notes..."
              rows="4"
            />

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            className="nurse-report-submit"
            disabled={
              submitting ||
              loading ||
              appointments.length === 0
            }
          >

            {submitting
              ? "Submitting..."
              : "Submit Visit Report"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default NurseVisitReport;