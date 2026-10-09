import React, { useEffect, useState } from "react";
import "./VisitReports.css";
import {
  getVisitReports,
  deleteVisitReport,
} from "./visitReportsService";

function VisitReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    loadVisitReports();
  }, []);

  const loadVisitReports = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getVisitReports();

      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Visit reports loading error:", err);
      setError(err.message || "Unable to load visit reports");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const closeReport = () => {
    setSelectedReport(null);
  };

  // DELETE VISIT REPORT
  const handleDeleteReport = async (reportId) => {
    if (!reportId) {
      alert("Visit report ID not found");
      return;
    }

    const handleDeleteReport = async (reportId) => {
  if (!reportId) {
    alert("Visit report ID not found");
    return;
  }

  try {
    await deleteVisitReport(reportId);

    setReports((currentReports) =>
      currentReports.filter((report) => report.id !== reportId)
    );

    if (selectedReport?.id === reportId) {
      setSelectedReport(null);
    }

    alert("Visit report deleted successfully");
  } catch (err) {
    console.error("Delete visit report error:", err);
    alert(err.message || "Unable to delete visit report");
  }
};
    try {
      await deleteVisitReport(reportId);

      // Remove deleted report from current list
      setReports((currentReports) =>
        currentReports.filter((report) => report.id !== reportId)
      );

      // Close modal if deleted report is currently open
      if (selectedReport?.id === reportId) {
        setSelectedReport(null);
      }

      alert("Visit report deleted successfully");
    } catch (err) {
      console.error("Delete visit report error:", err);
      alert(err.message || "Unable to delete visit report");
    }
  };

  // Convert 24-hour time to AM/PM
  const formatTime = (time) => {
    if (!time) return "--";

    // If time already contains AM/PM, return it directly
    if (/\b(AM|PM)\b/i.test(time)) {
      return time;
    }

    const parts = time.split(":");

    if (parts.length < 2) return time;

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    if (isNaN(hours)) return time;

    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
  };

  return (
    <div className="visit-reports-page">

      {/* PAGE HEADER */}
      <div className="visit-reports-header">
        <span className="visit-reports-label">YOUR CARE</span>

        <h1>Visit Reports</h1>

        <p>
          View your previous visit reports and healthcare details.
        </p>
      </div>

      <div className="visit-reports-container">

        <div className="visit-reports-card">

          {/* CARD HEADER */}
          <div className="visit-reports-card-header">

            <div className="visit-reports-card-title">

              {/* ONE ICON ONLY */}
              <div className="visit-reports-main-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 3.5H17C18.1 3.5 19 4.4 19 5.5V20.5H5V5.5C5 4.4 5.9 3.5 7 3.5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M9 8H15"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />

                  <path
                    d="M9 11.5H15"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />

                  <path
                    d="M9 15H13"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <h2>My Visit Reports</h2>

                <p>
                  Details from your completed healthcare visits
                </p>
              </div>

            </div>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="visit-reports-message">
              Loading your visit reports...
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="visit-reports-error">

              <div className="visit-reports-error-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M12 8V13"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="12"
                    cy="16.5"
                    r="1"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <h3>Unable to Load Reports</h3>

              <p>{error}</p>

              <button
                className="visit-reports-retry-btn"
                onClick={loadVisitReports}
              >
                Try Again
              </button>

            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && reports.length === 0 && (
            <div className="visit-reports-empty">

              <div className="visit-reports-empty-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 3.5H15L19 7.5V20.5H7C5.9 20.5 5 19.6 5 18.5V5.5C5 4.4 5.9 3.5 7 3.5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M15 3.5V7.5H19"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M9 11H15"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />

                  <path
                    d="M9 14.5H14"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3>No Visit Reports</h3>

              <p>
                Your completed visit reports will appear here.
              </p>

            </div>
          )}

          {/* REPORT LIST */}
          {!loading && !error && reports.length > 0 && (
            <div className="visit-reports-list">

              {reports.map((report, index) => (

                <div
                  className="visit-report-item"
                  key={report.id || index}
                >

                  {/* DATE */}
                  <div className="visit-report-date">

                    <div className="report-date-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="4"
                          y="5"
                          width="16"
                          height="15"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />

                        <path
                          d="M8 3V7"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M16 3V7"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M4 9H20"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />

                        <path
                          d="M8 13H8.01"
                          stroke="currentColor"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                        />

                        <path
                          d="M12 13H12.01"
                          stroke="currentColor"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                        />

                        <path
                          d="M16 13H16.01"
                          stroke="currentColor"
                          strokeWidth="2.3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div>
                      <span className="report-date-label">
                        VISIT DATE
                      </span>

                      <strong>
                        {report.visitDate || "--"}
                      </strong>
                    </div>

                  </div>

                  {/* DETAILS */}
                  <div className="visit-report-details">

                    {/* ACTUAL VISIT TYPE */}
                    <div className="report-service-title">

                      <div className="report-health-icon">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 21C16.5 17 20 14.2 20 9.8C20 6.8 17.8 5 15.2 5C13.7 5 12.5 5.8 12 7C11.5 5.8 10.3 5 8.8 5C6.2 5 4 6.8 4 9.8C4 14.2 7.5 17 12 21Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />

                          <path
                            d="M12 9V14"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />

                          <path
                            d="M9.5 11.5H14.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <h3>
                        {report.service || "Healthcare Visit"}
                      </h3>

                    </div>

                    {/* VISIT TIME */}
                    <div className="report-detail-row">

                      <div className="report-detail-icon">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="8.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />

                          <path
                            d="M12 7.5V12L15 14"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      <div>
                        <span>VISIT TIME</span>

                        <p>
                          {formatTime(report.visitTime)}
                        </p>
                      </div>

                    </div>

                    {/* NURSE */}
                    <div className="report-detail-row">

                      <div className="report-detail-icon">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="8"
                            r="3"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />

                          <path
                            d="M5.5 20C6 16.5 8.2 14.5 12 14.5C15.8 14.5 18 16.5 18.5 20"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <div>
                        <span>NURSE</span>

                        <p>
                          Nurse ID: {report.nurseId || "--"}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* STATUS */}
                  <div className="visit-report-status">

                    <div className="report-status-check">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 12.5L9.5 17L19 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <span>
                      {report.status || "COMPLETED"}
                    </span>

                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="visit-report-actions">

                    {/* VIEW REPORT */}
                    <button
                      className="visit-report-view-btn"
                      onClick={() => handleViewReport(report)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 3.5H14L18 7.5V20.5H6C4.9 20.5 4 19.6 4 18.5V5.5C4 4.4 4.9 3.5 6 3.5Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />

                        <path
                          d="M14 3.5V7.5H18"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />

                        <path
                          d="M8 12H15"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />

                        <path
                          d="M8 15.5H13"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>

                      <span>View Report</span>
                    </button>

                    {/* DELETE */}
                    <button
                      className="visit-report-delete-btn"
                      onClick={() => handleDeleteReport(report.id)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 7H19"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M9 7V5.5C9 4.7 9.7 4 10.5 4H13.5C14.3 4 15 4.7 15 5.5V7"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M7 7L8 19C8.1 20 8.9 20.5 9.8 20.5H14.2C15.1 20.5 15.9 20 16 19L17 7"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />

                        <path
                          d="M10.5 10.5V17"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M13.5 10.5V17"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </svg>

                      <span>Delete</span>
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

      {/* MODAL */}
      {selectedReport && (

        <div
          className="visit-reports-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeReport();
            }
          }}
        >

          <div className="visit-reports-modal-content">

            {/* MODAL HEADER */}
            <div className="visit-reports-modal-header">

              <div className="modal-title-area">

                <div className="modal-report-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 3.5H15L19 7.5V20.5H7C5.9 20.5 5 19.6 5 18.5V5.5C5 4.4 5.9 3.5 7 3.5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M15 3.5V7.5H19"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M9 11H15"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />

                    <path
                      d="M9 14.5H14"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>

                  <h2>Visit Report Details</h2>

                  <p>
                    {selectedReport.service || "Healthcare Visit"}
                  </p>

                  <p>
                    {selectedReport.visitDate || "--"} •{" "}
                    {formatTime(selectedReport.visitTime)}
                  </p>

                </div>

              </div>

              <button
                className="visit-reports-modal-close"
                onClick={closeReport}
              >
                ×
              </button>

            </div>

            {/* SYMPTOMS */}
            <div className="visit-reports-modal-section">

              <div className="modal-section-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="8.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M8 12H16"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M12 8V16"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <h3>Symptoms</h3>

                <p>
                  {selectedReport.symptoms ||
                    "No symptoms recorded."}
                </p>
              </div>

            </div>

            {/* OBSERVATIONS */}
            <div className="visit-reports-modal-section">

              <div className="modal-section-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3.5 12C5.8 7.8 8.7 5.7 12 5.7C15.3 5.7 18.2 7.8 20.5 12C18.2 16.2 15.3 18.3 12 18.3C8.7 18.3 5.8 16.2 3.5 12Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="2.7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </div>

              <div>
                <h3>Observations</h3>

                <p>
                  {selectedReport.observations ||
                    "No observations recorded."}
                </p>
              </div>

            </div>

            {/* TREATMENT */}
            <div className="visit-reports-modal-section">

              <div className="modal-section-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M7 17L17 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M9 19L19 9"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M5 15L15 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <h3>Treatment</h3>

                <p>
                  {selectedReport.treatment ||
                    "No treatment details recorded."}
                </p>
              </div>

            </div>

            {/* MEDICINES */}
            <div className="visit-reports-modal-section">

              <div className="modal-section-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="7"
                    y="4"
                    width="10"
                    height="16"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M7 10.5H17"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M10 7.5H14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <h3>Medicines</h3>

                <p>
                  {selectedReport.medicines ||
                    "No medicines recorded."}
                </p>
              </div>

            </div>

            {/* NURSE NOTES */}
            <div className="visit-reports-modal-section">

              <div className="modal-section-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="5"
                    y="4"
                    width="14"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M8.5 8H15.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M8.5 11.5H15.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M8.5 15H13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <h3>Nurse Notes</h3>

                <p>
                  {selectedReport.notes ||
                    "No additional notes recorded."}
                </p>
              </div>

            </div>

            {/* STATUS */}
            <div className="visit-reports-modal-status">

              <div className="modal-status-check">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12.5L9.5 17L19 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span>
                Status:{" "}
                {selectedReport.status || "COMPLETED"}
              </span>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default VisitReports;