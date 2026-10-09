import { API_ORIGIN } from "../../../apiBase.js";

import React, { useEffect, useState } from "react";
import "./AdminAvailability.css";
import "../admin-module-theme.css";

function AdminAvailability() {
  const API_URL = `${API_ORIGIN}/api`;

  const [availability, setAvailability] = useState([]);
  const [nurses, setNurses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH NURSES AND AVAILABILITY
  // =====================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [availabilityResponse, nursesResponse] =
          await Promise.all([
            fetch(`${API_URL}/nurse/availability`),
            fetch(`${API_URL}/users/nurses`),
          ]);

        if (!availabilityResponse.ok) {
          throw new Error(
            `Availability API Error: ${availabilityResponse.status}`
          );
        }

        if (!nursesResponse.ok) {
          throw new Error(
            `Nurses API Error: ${nursesResponse.status}`
          );
        }

        const availabilityData =
          await availabilityResponse.json();

        const nursesData =
          await nursesResponse.json();

        console.log(
          "Availability Data:",
          availabilityData
        );

        console.log("Nurses Data:", nursesData);

        setAvailability(
          Array.isArray(availabilityData)
            ? availabilityData
            : []
        );

        setNurses(
          Array.isArray(nursesData)
            ? nursesData
            : []
        );
      } catch (err) {
        console.error(
          "AdminAvailability Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load nurse availability."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =====================================================
  // FIND NURSE BY ID
  // =====================================================

  const getNurseName = (nurseId) => {
    const nurse = nurses.find(
      (item) =>
        String(item.id) === String(nurseId)
    );

    return nurse
      ? nurse.name
      : "Nurse name not found";
  };

  // =====================================================
  // GET AVAILABLE DAYS
  // =====================================================

  const getAvailableDays = (item) => {
    const days = [
      ["monday", "Monday"],
      ["tuesday", "Tuesday"],
      ["wednesday", "Wednesday"],
      ["thursday", "Thursday"],
      ["friday", "Friday"],
      ["saturday", "Saturday"],
      ["sunday", "Sunday"],
    ];

    return days
      .filter(([key]) => item[key] === true)
      .map(([, label]) => label);
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) {
      return "Not set";
    }

    const [hours, minutes] = time
      .split(":")
      .map(Number);

    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="admin-availability-page">
        <h2>Loading Availability...</h2>
      </main>
    );
  }

  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (
    <main className="admin-availability-page">

      <section className="admin-availability-header">
        <span>CARENEST • ADMIN PORTAL</span>

        <h1>Nurse Availability</h1>

        <p>
          View availability submitted by nurses.
        </p>
      </section>

      {/* ERROR */}

      {error && (
        <div className="availability-error">
          {error}
        </div>
      )}

      {/* EMPTY */}

      {!error && availability.length === 0 && (
        <div className="empty-availability">
          <h3>No availability found</h3>

          <p>
            Nurses have not submitted their
            availability yet.
          </p>
        </div>
      )}

      {/* AVAILABILITY LIST */}

      {!error && availability.length > 0 && (
        <div className="admin-availability-list">

          {availability.map((item) => {
            const availableDays =
              getAvailableDays(item);

            const nurseName =
              getNurseName(item.nurseId);

            return (
              <article
                className="admin-availability-card"
                key={item.id}
              >

                {/* NURSE NAME */}

                <div className="availability-nurse-header">

                  <div className="availability-nurse-avatar">
                    {nurseName !==
                      "Nurse name not found"
                      ? nurseName
                          .charAt(0)
                          .toUpperCase()
                      : "N"}
                  </div>

                  <div>
                    <h3>{nurseName}</h3>

                    <p>
                      Nurse ID: {item.nurseId}
                    </p>
                  </div>

                </div>

                {/* WORKING HOURS */}

                <div className="availability-info">
                  <strong>Working Hours</strong>

                  <span>
                    {formatTime(item.startTime)}
                    {" - "}
                    {formatTime(item.endTime)}
                  </span>
                </div>

                {/* AVAILABLE DAYS */}

                <div className="availability-info">
                  <strong>Available Days</strong>

                  {availableDays.length === 0 ? (
                    <span>
                      No days selected
                    </span>
                  ) : (
                    <div className="admin-day-badges">

                      {availableDays.map((day) => (
                        <span
                          className="admin-day-badge"
                          key={day}
                        >
                          {day}
                        </span>
                      ))}

                    </div>
                  )}
                </div>

              </article>
            );
          })}

        </div>
      )}

    </main>
  );
}

export default AdminAvailability;