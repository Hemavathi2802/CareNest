import { API_ORIGIN } from "../../../apiBase.js";
import { useCallback, useEffect, useState } from "react";
import "./PatientNotifications.css";

const API_URL = `${API_ORIGIN}/api`;

function PatientNotifications() {
  const [patientId, setPatientId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      setPatientId(user?.id ?? null);
    } catch (readError) {
      console.error("Unable to read logged in user:", readError);
      setError("Unable to load notifications. Please log in again.");
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!patientId) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/notifications/patient/${patientId}`
      );

      if (!response.ok) {
        throw new Error("Unable to load appointment notifications.");
      }

      const result = await response.json();
      setNotifications(Array.isArray(result) ? result : []);
      setError("");
    } catch (fetchError) {
      console.error("Fetch notifications error:", fetchError);
      setError(fetchError.message || "Unable to load notifications.");
    }
  }, [patientId]);

  useEffect(() => {
    if (!patientId) {
      return undefined;
    }

    fetchNotifications();
    const intervalId = window.setInterval(fetchNotifications, 60000);

    return () => window.clearInterval(intervalId);
  }, [fetchNotifications, patientId]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/patient/${patientId}/${notificationId}/read`,
        { method: "PUT" }
      );

      if (!response.ok) {
        throw new Error("Unable to mark notification as read.");
      }

      const updatedNotification = await response.json();
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? updatedNotification
            : notification
        )
      );
      setError("");
    } catch (requestError) {
      console.error("Mark notification as read error:", requestError);
      setError(requestError.message || "Unable to update notification.");
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <section className="patient-notifications" aria-labelledby="notifications-title">
      <div className="patient-notifications-heading">
        <div>
          <p className="patient-notifications-eyebrow">UPDATES</p>
          <h2 id="notifications-title">Appointment notifications</h2>
        </div>
        {unreadCount > 0 && (
          <span className="patient-notifications-count">
            {unreadCount} new
          </span>
        )}
      </div>

      {error && (
        <p className="patient-notifications-error" role="alert">
          {error}
        </p>
      )}

      {notifications.length === 0 ? (
        <p className="patient-notifications-empty">
          No appointment reminders yet. We will show one here 24 hours before
          your appointment.
        </p>
      ) : (
        <ul className="patient-notifications-list">
          {notifications.map((notification) => (
            <li
              className={`patient-notification${notification.read ? "" : " is-unread"}`}
              key={notification.id}
            >
              <p>{notification.message}</p>
              {!notification.read && (
                <button
                  type="button"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default PatientNotifications;
