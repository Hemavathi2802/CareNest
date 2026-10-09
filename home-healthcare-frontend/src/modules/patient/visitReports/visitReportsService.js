import { API_ORIGIN } from "../../../apiBase.js";
const API_BASE_URL = `${API_ORIGIN}/api`;

export const getVisitReports = async () => {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    throw new Error("Patient login information not found");
  }

  let user;

  try {
    user = JSON.parse(loggedInUser);
  } catch (error) {
    throw new Error("Invalid patient login information");
  }

  if (!user.id) {
    throw new Error("Patient ID not found");
  }

  const response = await fetch(
    `${API_BASE_URL}/visit-reports/patient/${user.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to load visit reports");
  }

  return await response.json();
};

export const deleteVisitReport = async (reportId) => {
  if (!reportId) {
    throw new Error("Visit report ID not found");
  }

  const response = await fetch(
    `${API_BASE_URL}/visit-reports/${reportId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to delete visit report");
  }

  return true;
};