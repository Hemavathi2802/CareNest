import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_ORIGIN } from "../../../apiBase.js";
import "./NurseNotifications.css";

const API_URL = `${API_ORIGIN}/api`;

function NurseNotifications() {
  let loggedInUser = null;

  try {
    loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  } catch (error) {
    console.error("Unable to read logged in nurse:", error);
  }

  const nurseId = loggedInUser?.id;
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    if (!nurseId) {
      setError("Nurse login information not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/notifications/nurse/${nurseId}`);
      if (!response.ok) {
        throw new Error("Unable to load nurse notifications.");
      }

      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
      setError("");
    } catch (fetchError) {
      console.error("Fetch nurse notifications error:", fetchError);
      setError(fetchError.message || "Unable to load nurse notifications.");
    }
  }, [nurseId]);

  useEffect(() => {
    fetchNotifications();
    const intervalId = window.setInterval(fetchNotifications, 60000);
    return () => window.clearInterval(intervalId);
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
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
      setError("");
    } catch (requestError) {
      console.error("Mark nurse notification as read error:", requestError);
      setError(requestError.message || "Unable to update notification.");
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <main className="nurse-notifications-page">
      <section className="nurse-notifications-module" aria-labelledby="nurse-notifications-title">
        <header className="nurse-notifications-module-heading">
          <div>
            <span className="nurse-notifications-eyebrow">NURSE PORTAL · UPDATES</span>
            <h1 id="nurse-notifications-title">Notifications</h1>
            <p>New appointment assignments and care updates.</p>
          </div>
          <div className="nurse-notifications-module-actions">
            <span className="nurse-notifications-unread">{unreadCount} unread</span>
            <Link to="/dashboard/nurse">Dashboard</Link>
          </div>
        </header>

        {error && <p className="nurse-notification-error" role="alert">{error}</p>}

        {notifications.length === 0 ? (
          <p className="nurse-notification-empty">
            No notifications yet. Appointment assignments will appear here.
          </p>
        ) : (
          <ul className="nurse-notification-list">
            {notifications.map((notification) => (
              <li
                className={`nurse-notification${notification.read ? " is-read" : ""}`}
                key={notification.id}
              >
                <span className="nurse-notification-indicator" aria-hidden="true">
                  {notification.read ? "✓" : "●"}
                </span>
                <div className="nurse-notification-copy">
                  <p>{notification.message}</p>
                  {notification.createdAt && (
                    <time dateTime={notification.createdAt}>
                      {new Date(notification.createdAt).toLocaleString("en-IN")}
                    </time>
                  )}
                </div>
                {!notification.read && (
                  <button type="button" onClick={() => markAsRead(notification.id)}>
                    Mark as read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default NurseNotifications;
