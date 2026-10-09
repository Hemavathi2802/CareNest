import { API_ORIGIN } from "../apiBase.js";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("adminSessionToken");

    if (!accessToken) {
      setAuthorized(false);
      return;
    }

    const controller = new AbortController();

    fetch(`${API_ORIGIN}/api/users/admin/session`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          localStorage.removeItem("adminSessionToken");
          localStorage.removeItem("loggedInUser");
        }
        setAuthorized(response.ok);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setAuthorized(false);
        }
      });

    return () => controller.abort();
  }, []);

  if (authorized === null) {
    return <p role="status">Checking admin login...</p>;
  }

  return authorized ? children : <Navigate to="/login" replace />;
}

export default AdminProtectedRoute;
