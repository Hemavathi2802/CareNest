import { API_ORIGIN } from "../../../apiBase.js";
const API_BASE_URL =
  `${API_ORIGIN}/api/patient/appointments`;


const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error("Appointment request failed");
  }

  return response.json();
};


/* ================= GET ================= */

export const getAppointments = async () => {
  const response = await fetch(API_BASE_URL, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};


/* ================= CREATE ================= */

export const createAppointment = async (
  appointmentData
) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(appointmentData),
  });

  return handleResponse(response);
};


/* ================= CANCEL ================= */

export const cancelAppointment = async (
  appointmentId
) => {
  const response = await fetch(
    `${API_BASE_URL}/${appointmentId}/cancel`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse(response);
};