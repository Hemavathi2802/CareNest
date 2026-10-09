import { API_ORIGIN } from "../../../apiBase.js";
import React, { useEffect, useState } from "react";
import "./AdminVisitReports.css";
import "../admin-module-theme.css";

function VisitReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  /* =========================================
     GET ALL VISIT REPORTS
  ========================================= */

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_ORIGIN}/api/visit-reports`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch visit reports");
      }

      const data = await response.json();

      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Visit reports loading error:", err);
      setError("Unable to load visit reports.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     DELETE REPORT
  ========================================= */

  const deleteReport = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this visit report?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${API_ORIGIN}/api/visit-reports/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete report");
      }

      setReports((prev) =>
        prev.filter((report) => report.id !== id)
      );

      if (selectedReport?.id === id) {
        setSelectedReport(null);
      }
    } catch (err) {
      console.error("Delete report error:", err);
      setError("Unable to delete visit report.");
    }
  };

  /* =========================================
     FORMAT TIME
  ========================================= */

  const formatTime = (time) => {
    if (!time) return "--";

    const cleanTime = String(time).trim();

    if (
      cleanTime.toUpperCase().includes("AM") ||
      cleanTime.toUpperCase().includes("PM")
    ) {
      return cleanTime;
    }

    const parts = cleanTime.split(":");

    if (parts.length < 2) {
      return cleanTime;
    }

    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    if (isNaN(hours)) {
      return cleanTime;
    }

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;

    return `${formattedHour}:${minutes} ${period}`;
  };

  /* =========================================
     SEARCH
  ========================================= */

  const filteredReports = reports.filter((report) => {
    const searchText = `
      ${report.id || ""}
      ${report.appointmentId || ""}
      ${report.patientId || ""}
      ${report.patientName || ""}
      ${report.nurseId || ""}
      ${report.nurseName || ""}
      ${report.service || ""}
      ${report.visitDate || ""}
      ${report.visitTime || ""}
      ${report.symptoms || ""}
      ${report.observations || ""}
      ${report.treatment || ""}
      ${report.medicines || ""}
      ${report.notes || ""}
      ${report.status || ""}
    `.toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="admin-report-page">
        <div className="admin-report-loading">
          <div className="admin-report-loader"></div>

          <h3>Loading Visit Reports...</h3>

          <p>
            Please wait while we fetch the reports.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-report-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="admin-report-header">

        <div>
          <span className="admin-report-label">
            ADMIN MODULE
          </span>

          <h1>
            Visit Reports
          </h1>

          <p>
            Review patient home healthcare visit reports.
          </p>
        </div>

        <div className="admin-report-count">
          <strong>
            {reports.length}
          </strong>

          <span>
            Total Reports
          </span>
        </div>

      </div>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="admin-report-error">
          {error}
        </div>
      )}


      {/* =====================================
          TOOLBAR
      ===================================== */}

      <div className="admin-report-toolbar">

        <div className="admin-report-search">

          <svg
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />

            <path
              d="M16 16L21 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <input
            type="text"
            placeholder="Search visit reports..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>


      {/* =====================================
          REPORT SECTION
      ===================================== */}

      <div className="admin-report-section">

        <div className="admin-report-section-heading">

          <div className="admin-report-section-line"></div>

          <div>
            <h2>
              Patient Visit Reports
            </h2>

            <p>
              View reports submitted after completed nurse visits.
            </p>
          </div>

        </div>


        {/* ===================================
            EMPTY
        =================================== */}

        {filteredReports.length === 0 ? (

          <div className="admin-report-empty">

            <div className="admin-report-empty-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 3H14L19 8V21H6C4.9 21 4 20.1 4 19V5C4 3.9 4.9 3 6 3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />

                <path
                  d="M14 3V8H19"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M8 13H16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <path
                  d="M8 17H13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

            </div>

            <h3>
              No Visit Reports
            </h3>

            <p>
              No visit reports are available.
            </p>

          </div>

        ) : (

          /* =================================
             REPORT LIST
          ================================= */

          <div className="admin-report-list">

            {filteredReports.map((report) => (

              <div
                className="admin-report-card"
                key={report.id}
              >

                {/* ICON */}

                <div className="admin-report-icon">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                  >
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
                  </svg>

                </div>


                {/* INFORMATION */}

                <div className="admin-report-info">

                  <h3>
                    {report.patientName ||
                      `Patient #${report.patientId}`}
                  </h3>

                  <span>
                    {report.service ||
                      "Healthcare Visit"}
                  </span>

                  <div className="admin-report-details">

                    <small>
                      Appointment #{report.appointmentId}
                    </small>

                    <small>
                      Nurse:{" "}
                      {report.nurseName ||
                        `#${report.nurseId}`}
                    </small>

                    <small>
                      Date: {report.visitDate || "--"}
                    </small>

                    <small>
                      Time: {formatTime(report.visitTime)}
                    </small>

                    <small>
                      Status:{" "}
                      {report.status || "COMPLETED"}
                    </small>

                  </div>

                </div>


                {/* VIEW */}

                <button
                  className="admin-report-status"
                  onClick={() =>
                    setSelectedReport(report)
                  }
                >
                  <span></span>
                  View Report
                </button>


                {/* DELETE */}

                <button
                  className="admin-report-delete"
                  onClick={() =>
                    deleteReport(report.id)
                  }
                  title="Delete Report"
                >

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4 7H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M10 11V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M14 11V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M6 7L7 20H17L18 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M9 7V4H15V7"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>

                </button>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* =====================================
          VIEW REPORT MODAL
      ===================================== */}

      {selectedReport && (

        <div className="admin-report-modal">

          <div className="admin-report-modal-content">

            <div className="admin-report-modal-header">

              <div>
                <span className="admin-report-label">
                  VISIT REPORT
                </span>

                <h2>
                  {selectedReport.patientName ||
                    `Patient #${selectedReport.patientId}`}
                </h2>

                <p>
                  {selectedReport.service ||
                    "Healthcare Visit"}
                  {" • "}
                  Appointment #{selectedReport.appointmentId}
                </p>
              </div>

              <button
                className="admin-report-close"
                onClick={() =>
                  setSelectedReport(null)
                }
              >
                ×
              </button>

            </div>


            {/* VISIT INFORMATION */}

            <div className="admin-report-modal-section">

              <h3>
                Visit Information
              </h3>

              <p>
                <strong>Patient:</strong>{" "}
                {selectedReport.patientName ||
                  `Patient #${selectedReport.patientId}`}
              </p>

              <p>
                <strong>Nurse:</strong>{" "}
                {selectedReport.nurseName ||
                  `Nurse #${selectedReport.nurseId}`}
              </p>

              <p>
                <strong>Visit Type:</strong>{" "}
                {selectedReport.service ||
                  "Healthcare Visit"}
              </p>

              <p>
                <strong>Appointment:</strong>{" "}
                #{selectedReport.appointmentId}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {selectedReport.visitDate || "--"}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {formatTime(selectedReport.visitTime)}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedReport.status || "COMPLETED"}
              </p>

            </div>


            {/* SYMPTOMS */}

            <div className="admin-report-modal-section">

              <h3>
                Symptoms
              </h3>

              <p>
                {selectedReport.symptoms ||
                  "No symptoms recorded."}
              </p>

            </div>


            {/* OBSERVATIONS */}

            <div className="admin-report-modal-section">

              <h3>
                Observations
              </h3>

              <p>
                {selectedReport.observations ||
                  "No observations recorded."}
              </p>

            </div>


            {/* TREATMENT */}

            <div className="admin-report-modal-section">

              <h3>
                Treatment
              </h3>

              <p>
                {selectedReport.treatment ||
                  "No treatment details recorded."}
              </p>

            </div>


            {/* MEDICINES */}

            <div className="admin-report-modal-section">

              <h3>
                Medicines
              </h3>

              <p>
                {selectedReport.medicines ||
                  "No medicines recorded."}
              </p>

            </div>


            {/* NURSE NOTES */}

            <div className="admin-report-modal-section">

              <h3>
                Nurse Notes
              </h3>

              <p>
                {selectedReport.notes ||
                  "No additional notes recorded."}
              </p>

            </div>


            {/* CLOSE */}

            <button
              className="admin-report-modal-close-btn"
              onClick={() =>
                setSelectedReport(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default VisitReports;