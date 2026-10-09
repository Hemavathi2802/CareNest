import { API_ORIGIN } from "../../../apiBase.js";
import React, { useEffect, useState } from "react";
import "./NurseAvailability.css";
import "../nurse-module-theme.css";

function NurseAvailability() {
  const [availability, setAvailability] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // GET LOGGED IN USER
  // =====================================================

  let loggedInUser = null;

  try {
    loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser")
    );
  } catch (err) {
    console.error("Unable to read loggedInUser:", err);
  }

  const nurseId = loggedInUser?.id;


  // =====================================================
  // LOAD NURSE AVAILABILITY
  // =====================================================

  useEffect(() => {
    const loadAvailability = async () => {

      if (!nurseId) {
        setError(
          "Nurse login information not found. Please login again."
        );
        return;
      }

      try {

        const response = await fetch(
          `${API_ORIGIN}/api/nurse/availability/${nurseId}`
        );

        // No availability saved yet
        if (response.status === 404) {
          return;
        }

        if (!response.ok) {

          const errorText = await response.text();

          throw new Error(
            errorText ||
            `Unable to load availability. Status: ${response.status}`
          );
        }

        const data = await response.json();

        setAvailability({
          monday: Boolean(data.monday),
          tuesday: Boolean(data.tuesday),
          wednesday: Boolean(data.wednesday),
          thursday: Boolean(data.thursday),
          friday: Boolean(data.friday),
          saturday: Boolean(data.saturday),
          sunday: Boolean(data.sunday),
        });

        setStartTime(
          data.startTime || "09:00"
        );

        setEndTime(
          data.endTime || "17:00"
        );

      } catch (err) {

        console.error(
          "Load availability error:",
          err
        );

        setError(
          err.message ||
          "Unable to load availability."
        );
      }
    };

    loadAvailability();

  }, [nurseId]);


  // =====================================================
  // CHANGE DAY
  // =====================================================

  const handleDayChange = (day) => {

    setAvailability((previous) => ({
      ...previous,
      [day]: !previous[day],
    }));

    setMessage("");
    setError("");
  };


  // =====================================================
  // SAVE AVAILABILITY
  // =====================================================

  const handleSave = async () => {

    setMessage("");
    setError("");

    // Check nurse login
    if (!nurseId) {

      setError(
        "Nurse login information not found. Please login again."
      );

      return;
    }

    // Check time
    if (startTime >= endTime) {

      setError(
        "End time must be later than start time."
      );

      return;
    }

    setLoading(true);

    try {

      // =================================================
      // REQUEST DATA
      // =================================================

      const requestData = {

        nurseId: String(nurseId),

        monday: Boolean(availability.monday),
        tuesday: Boolean(availability.tuesday),
        wednesday: Boolean(availability.wednesday),
        thursday: Boolean(availability.thursday),
        friday: Boolean(availability.friday),
        saturday: Boolean(availability.saturday),
        sunday: Boolean(availability.sunday),

        startTime: startTime,
        endTime: endTime,
      };


      console.log(
        "Sending availability:",
        requestData
      );


      // =================================================
      // SEND TO BACKEND
      // =================================================

      const response = await fetch(
        `${API_ORIGIN}/api/nurse/availability`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(requestData),
        }
      );


      // =================================================
      // HANDLE BACKEND ERROR
      // =================================================

      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          "Backend Error:",
          errorText
        );

        throw new Error(
          errorText ||
          `Unable to save availability. Status: ${response.status}`
        );
      }


      // =================================================
      // GET SAVED DATA
      // =================================================

      const savedData =
        await response.json();

      console.log(
        "Availability saved:",
        savedData
      );


      // =================================================
      // UPDATE UI
      // =================================================

      setAvailability({
        monday: Boolean(savedData.monday),
        tuesday: Boolean(savedData.tuesday),
        wednesday: Boolean(savedData.wednesday),
        thursday: Boolean(savedData.thursday),
        friday: Boolean(savedData.friday),
        saturday: Boolean(savedData.saturday),
        sunday: Boolean(savedData.sunday),
      });

      setStartTime(
        savedData.startTime || startTime
      );

      setEndTime(
        savedData.endTime || endTime
      );


      // =================================================
      // SUCCESS
      // =================================================

      setMessage(
        "Availability saved successfully."
      );

    } catch (err) {

      console.error(
        "Save availability error:",
        err
      );

      setError(
        err.message ||
        "Unable to save availability."
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="nurse-availability-page">

      {/* ================= HEADER ================= */}

      <div className="nurse-availability-header">

        <span className="nurse-availability-label">
          CARENEST • NURSE PORTAL
        </span>

        <h1>
          Availability
        </h1>

        <p>
          Set your available days and working hours
          for patient care.
        </p>

      </div>


      {/* ================= SECTION HEADING ================= */}

      <div className="nurse-availability-heading">

        <span className="nurse-availability-line"></span>

        <div>

          <h2>
            My Availability
          </h2>

          <p>
            Choose the days and time you are available.
          </p>

        </div>

      </div>


      {/* ================= MAIN CARD ================= */}

      <div className="nurse-availability-card">


        {/* ================= AVAILABLE DAYS ================= */}

        <div className="availability-section">

          <div className="availability-section-title">

            <div className="availability-small-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >

                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="17"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M16 2V6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <path
                  d="M8 2V6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <path
                  d="M3 10H21"
                  stroke="currentColor"
                  strokeWidth="2"
                />

              </svg>

            </div>


            <div>

              <h3>
                Available Days
              </h3>

              <p>
                Select the days you can provide care.
              </p>

            </div>

          </div>


          <div className="availability-days">

            {[
              ["monday", "Monday"],
              ["tuesday", "Tuesday"],
              ["wednesday", "Wednesday"],
              ["thursday", "Thursday"],
              ["friday", "Friday"],
              ["saturday", "Saturday"],
              ["sunday", "Sunday"],
            ].map(([key, label]) => (

              <button
                type="button"
                key={key}
                className={`availability-day ${
                  availability[key]
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleDayChange(key)
                }
              >

                <span className="availability-check">

                  {availability[key] && (

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >

                      <path
                        d="M5 12L10 17L19 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                    </svg>

                  )}

                </span>

                <span>
                  {label}
                </span>

              </button>

            ))}

          </div>

        </div>


        {/* ================= WORKING HOURS ================= */}

        <div className="availability-section">

          <div className="availability-section-title">

            <div className="availability-small-icon purple">

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

            </div>


            <div>

              <h3>
                Working Hours
              </h3>

              <p>
                Set your available working time.
              </p>

            </div>

          </div>


          <div className="availability-time-grid">

            <div className="availability-field">

              <label htmlFor="startTime">
                Start Time
              </label>

              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => {

                  setStartTime(
                    e.target.value
                  );

                  setMessage("");
                  setError("");

                }}
              />

            </div>


            <div className="availability-time-divider">
              to
            </div>


            <div className="availability-field">

              <label htmlFor="endTime">
                End Time
              </label>

              <input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => {

                  setEndTime(
                    e.target.value
                  );

                  setMessage("");
                  setError("");

                }}
              />

            </div>

          </div>

        </div>


        {/* ================= SUCCESS MESSAGE ================= */}

        {message && (

          <div className="availability-success">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path
                d="M5 12L10 17L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

            </svg>

            <span>
              {message}
            </span>

          </div>

        )}


        {/* ================= ERROR MESSAGE ================= */}

        {error && (

          <div className="availability-error">

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

            <span>
              {error}
            </span>

          </div>

        )}


        {/* ================= SAVE BUTTON ================= */}

        <div className="availability-save-area">

          <button
            type="button"
            className="availability-save-btn"
            onClick={handleSave}
            disabled={loading}
          >

            {loading
              ? "Saving..."
              : "Save Availability"
            }

          </button>

        </div>

      </div>

    </div>
  );
}

export default NurseAvailability;