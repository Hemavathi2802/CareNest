import { API_ORIGIN } from "../../../apiBase.js";

import React, { useEffect, useState } from "react";
import "./PatientCare.css";
import "../nurse-module-theme.css";

const API_URL = `${API_ORIGIN}/api`;

const initialFormData = {
  appointmentId: "",
  patientId: "",
  patientName: "",
  visitDate: "",
  careType: "",
  bloodPressure: "",
  temperature: "",
  pulse: "",
  spo2: "",
  careNotes: "",
  nextVisit: "",
};

function PatientCare() {
  const [appointments, setAppointments] = useState([]);
  const [careRecords, setCareRecords] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [historyFilter, setHistoryFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser") || "{}"
  );

  const nurseId =
    loggedInUser.id ||
    loggedInUser.userId ||
    loggedInUser.nurseId;

  useEffect(() => {
    if (!nurseId) {
      setErrorMessage("Nurse login details not found.");
      setLoading(false);
      return;
    }

    fetchData();
  }, [nurseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [appointmentsResponse, recordsResponse] =
        await Promise.all([
          fetch(`${API_URL}/appointments/nurse/${nurseId}`),
          fetch(`${API_URL}/patient-care/nurse/${nurseId}`),
        ]);

      if (!appointmentsResponse.ok) {
        throw new Error("Unable to fetch appointments.");
      }

      if (!recordsResponse.ok) {
        throw new Error("Unable to fetch patient care records.");
      }

      const appointmentsData = await appointmentsResponse.json();
      const recordsData = await recordsResponse.json();

      setAppointments(
        Array.isArray(appointmentsData)
          ? appointmentsData
          : []
      );

      setCareRecords(
        Array.isArray(recordsData) ? recordsData : []
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const normalizeDate = (value) => {
    if (!value) return "";

    const text = String(value);

    if (text.includes("T")) {
      return text.split("T")[0];
    }

    return text;
  };

  const getPatientId = (item) => {
    return (
      item.patientId ??
      item.patient?.id ??
      item.patient?.patientId ??
      item.patientDetails?.id ??
      ""
    );
  };

  const getPatientName = (item) => {
    return (
      item.patientName ??
      item.patient?.name ??
      item.patient?.patientName ??
      item.patient?.fullName ??
      item.patient?.user?.name ??
      item.patient?.user?.fullName ??
      item.patientDetails?.name ??
      item.patientDetails?.patientName ??
      item.patientDetails?.fullName ??
      item.name ??
      item.fullName ??
      ""
    );
  };

  const getVisitDate = (item) => {
    return normalizeDate(
      item.visitDate ??
        item.date ??
        item.appointmentDate
    );
  };

  const getCareType = (item) => {
    return (
      item.careType ??
      item.service ??
      "General Care"
    );
  };

  const getRecordId = (record) => {
    return (
      record.id ??
      record.careId ??
      record.patientCareId
    );
  };

  const getRecordPatientName = (record) => {
    const name = getPatientName(record);

    if (name && String(name).trim() !== "") {
      return name;
    }

    return "Unknown Patient";
  };

  const getRecordPatientId = (record) => {
    return getPatientId(record) || "-";
  };

  const getRecordDate = (record) => {
    return normalizeDate(
      record.visitDate ??
        record.date ??
        record.careDate
    );
  };

  const getAvailableAppointments = () => {
    return appointments.filter((appointment) => {
      const status = String(
        appointment.status || ""
      ).toUpperCase();

      if (
        status === "CANCELLED" ||
        status === "CANCELED" ||
        status === "REJECTED"
      ) {
        return;
      }

      return Boolean(getPatientId(appointment));
    });
  };

  const handlePatientChange = (event) => {
    const appointmentId = event.target.value;

    const selectedAppointment = appointments.find(
      (appointment) =>
        String(appointment.id) === String(appointmentId)
    );

    if (!selectedAppointment) {
      setFormData(initialFormData);
      return;
    }

    setFormData({
      appointmentId: selectedAppointment.id || "",
      patientId: getPatientId(selectedAppointment),
      patientName:
        getPatientName(selectedAppointment) ||
        "Unknown Patient",
      visitDate: getVisitDate(selectedAppointment),
      careType: getCareType(selectedAppointment),
      bloodPressure: "",
      temperature: "",
      pulse: "",
      spo2: "",
      careNotes: "",
      nextVisit: "",
    });

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.patientId) {
      setErrorMessage("Please select a patient.");
      return;
    }

    if (!formData.careNotes.trim()) {
      setErrorMessage("Please enter care notes.");
      return;
    }

    try {
      setSaving(true);

      const requestBody = {
        appointmentId: formData.appointmentId
          ? Number(formData.appointmentId)
          : null,

        patientId: formData.patientId
          ? Number(formData.patientId)
          : null,

        patientName: formData.patientName,
        visitDate: formData.visitDate,
        careType: formData.careType,

        bloodPressure: formData.bloodPressure,
        temperature: formData.temperature,
        pulse: formData.pulse,
        spo2: formData.spo2,

        careNotes: formData.careNotes,
        nextVisit: formData.nextVisit,

        nurseId: nurseId ? Number(nurseId) : null,
      };

      const response = await fetch(
        `${API_URL}/patient-care`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          text || "Unable to save care details."
        );
      }

      const savedRecord = await response.json();

      const completeRecord = {
        ...savedRecord,

        patientId:
          savedRecord.patientId ??
          formData.patientId,

        patientName:
          savedRecord.patientName ||
          formData.patientName,

        visitDate:
          savedRecord.visitDate ||
          formData.visitDate,

        careType:
          savedRecord.careType ||
          formData.careType,
      };

      setCareRecords((previous) => [
        ...previous,
        completeRecord,
      ]);

      setFormData(initialFormData);

      setSuccessMessage(
        "Patient care details saved successfully."
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (!recordId) {
      setErrorMessage("Record ID not found.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this care record?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(recordId);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/patient-care/${recordId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          text || "Unable to delete care record."
        );
      }

      setCareRecords((previous) =>
        previous.filter(
          (record) =>
            String(getRecordId(record)) !==
            String(recordId)
        )
      );

      setSuccessMessage(
        "Patient care record deleted successfully."
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredRecords = careRecords.filter((record) => {
    const search = historyFilter.toLowerCase().trim();

    if (!search) return true;

    const name = getRecordPatientName(record)
      .toLowerCase();

    const patientId = String(
      getRecordPatientId(record)
    ).toLowerCase();

    const careType = String(
      record.careType ?? record.service ?? ""
    ).toLowerCase();

    return (
      name.includes(search) ||
      patientId.includes(search) ||
      careType.includes(search)
    );
  });

  const availableAppointments =
    getAvailableAppointments();

  return (
    <div className="patient-care-page">
      <div className="page-header">
        <div>
          <h1>Patient Care</h1>
          <p>Record and manage patient care details</p>
        </div>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <div className="patient-care-card">
        <div className="card-header">
          <h2>Save Patient Care Details</h2>
        </div>

        {loading ? (
          <p className="empty-message">
            Loading appointments...
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Select Patient</label>

                <select
                  name="appointmentId"
                  value={formData.appointmentId}
                  onChange={handlePatientChange}
                  required
                >
                  <option value="">
                    Select Patient
                  </option>

                  {availableAppointments.length === 0 ? (
                    <option disabled>
                      No available patients
                    </option>
                  ) : (
                    availableAppointments.map(
                      (appointment) => (
                        <option
                          key={appointment.id}
                          value={appointment.id}
                        >
                          {getPatientName(appointment) || "Unknown Patient"}
                          {" — "}
                          {getVisitDate(appointment)}
                          {appointment.time
                            ? ` ${appointment.time}`
                            : ""}
                        </option>
                      )
                    )
                  )}
                </select>

                <small className="field-help">
                  Cancelled and rejected appointments are hidden.
                </small>
              </div>

              <div className="form-group">
                <label>Patient ID</label>

                <input
                  name="patientId"
                  value={formData.patientId}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Patient Name</label>

                <input
                  name="patientName"
                  value={formData.patientName}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Visit Date</label>

                <input
                  type="date"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Care Type</label>

                <input
                  name="careType"
                  value={formData.careType}
                  onChange={handleInputChange}
                  placeholder="Enter care type"
                />
              </div>
            </div>

            <div className="vitals-section">
              <h3>Patient Vitals</h3>

              <div className="form-grid">
                <div className="form-group">
                  <label>Blood Pressure</label>

                  <input
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleInputChange}
                    placeholder="120/80"
                  />
                </div>

                <div className="form-group">
                  <label>Temperature</label>

                  <input
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    placeholder="98.6°F"
                  />
                </div>

                <div className="form-group">
                  <label>Pulse</label>

                  <input
                    name="pulse"
                    value={formData.pulse}
                    onChange={handleInputChange}
                    placeholder="72 bpm"
                  />
                </div>

                <div className="form-group">
                  <label>SpO2</label>

                  <input
                    name="spo2"
                    value={formData.spo2}
                    onChange={handleInputChange}
                    placeholder="98%"
                  />
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Care Notes</label>

                <textarea
                  name="careNotes"
                  value={formData.careNotes}
                  onChange={handleInputChange}
                  placeholder="Enter care notes"
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Next Visit</label>

                <input
                  type="date"
                  name="nextVisit"
                  value={formData.nextVisit}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="save-care-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Care Details"}
            </button>
          </form>
        )}
      </div>

      <div className="history-card">
        <div className="card-header">
          <h2>Patient Care History</h2>

          <input
            className="history-search"
            placeholder="Search patient..."
            value={historyFilter}
            onChange={(event) =>
              setHistoryFilter(event.target.value)
            }
          />
        </div>

        {filteredRecords.length === 0 ? (
          <p className="empty-message">
            No patient care records found.
          </p>
        ) : (
          <div className="table-container">
            <table className="care-history-table">
              <thead>
                <tr>
                  <th>Appointment ID</th>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Visit Date</th>
                  <th>Care Type</th>
                  <th>Blood Pressure</th>
                  <th>Temperature</th>
                  <th>Pulse</th>
                  <th>SpO2</th>
                  <th>Care Notes</th>
                  <th>Next Visit</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record) => {
                  const recordId = getRecordId(record);

                  return (
                    <tr key={recordId}>
                      <td>{record.appointmentId ?? "-"}</td>
                      <td>
                        {getRecordPatientId(record)}
                      </td>

                      <td>
                        {getRecordPatientName(record)}
                      </td>

                      <td>{getRecordDate(record)}</td>

                      <td>
                        {record.careType ??
                          record.service ??
                          "-"}
                      </td>

                      <td>
                        {record.bloodPressure || "-"}
                      </td>

                      <td>
                        {record.temperature || "-"}
                      </td>

                      <td>{record.pulse || "-"}</td>

                      <td>{record.spo2 || "-"}</td>

                      <td>
                        {record.careNotes || "-"}
                      </td>

                      <td>
                        {normalizeDate(record.nextVisit) ||
                          "-"}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="delete-care-button"
                          onClick={() =>
                            handleDelete(recordId)
                          }
                          disabled={deletingId === recordId}
                        >
                          {deletingId === recordId
                            ? "Deleting..."
                            : "🗑️ Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientCare;