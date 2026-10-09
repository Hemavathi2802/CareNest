import { API_ORIGIN } from "../../../apiBase.js";
const API_BASE_URL = `${API_ORIGIN}/api`;

export const getPatientSchedule = async () => {
  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  if (!loggedInUser || !loggedInUser.id) {
    throw new Error("User ID not found");
  }

  const userId = loggedInUser.id;

  const response = await fetch(
    `${API_BASE_URL}/patients/${userId}/schedule`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || "Unable to load schedule"
    );
  }

  return await response.json();
};