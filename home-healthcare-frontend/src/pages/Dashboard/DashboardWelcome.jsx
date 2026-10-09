import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./DashboardWelcome.css";

function getDisplayName(fallbackName) {
  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser") || "{}"
  );

  if (loggedInUser.role?.toUpperCase() === "ADMIN") {
    return "Admin";
  }

  return (
    loggedInUser.name?.trim() ||
    loggedInUser.email?.split("@")[0] ||
    fallbackName
  );
}

function DashboardWelcome({
  portal,
  fallbackName,
  description,
  primaryAction,
  secondaryAction,
}) {
  const [now, setNow] = useState(() => new Date());
  const displayName = getDisplayName(fallbackName);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const greetingHour = now.getHours();
  const greeting =
    greetingHour < 12
      ? "Good morning"
      : greetingHour < 18
        ? "Good afternoon"
        : "Good evening";

  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  const timeLabel = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  return (
    <section className="dashboard-welcome">
      <div className="dashboard-welcome-content">
        <span className="dashboard-welcome-eyebrow">
          CARENEST <span aria-hidden="true">/</span> {portal}
        </span>

        <h1>
          {greeting}, {displayName}
        </h1>

        <p>{description}</p>

        <div className="dashboard-welcome-actions">
          <Link
            className="dashboard-welcome-primary"
            to={primaryAction.to}
          >
            {primaryAction.label}
            <span aria-hidden="true">→</span>
          </Link>

          {secondaryAction && (
            <Link
              className="dashboard-welcome-secondary"
              to={secondaryAction.to}
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      </div>

      <div className="dashboard-welcome-status">
        <span className="dashboard-live-indicator">
          <span aria-hidden="true" />
          PORTAL ACTIVE
        </span>
        <div className="dashboard-clock" aria-label={`Local time: ${timeLabel}`}>
          <strong>{timeLabel}</strong>
          <span>{dateLabel}</span>
        </div>
      </div>

      <div className="dashboard-welcome-orb" aria-hidden="true" />
    </section>
  );
}

export default DashboardWelcome;
