import { API_ORIGIN } from "../../../apiBase.js";
const API_URL = `${API_ORIGIN}/api/patients`;

// =====================================================
// CREATE PATIENT PROFILE
// =====================================================

export const createPatientProfile = async (profileData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "Create Patient Error:",
      errorText
    );

    throw new Error(
      errorText || "Failed to create patient profile"
    );
  }

  return await response.json();
};


// =====================================================
// GET PATIENT PROFILE USING USER ID
// =====================================================

export const getPatientProfile = async (userId) => {
  const response = await fetch(
    `${API_URL}/user/${userId}`
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "Get Patient Error:",
      errorText
    );

    throw new Error(
      errorText || "Patient profile not found"
    );
  }

  return await response.json();
};


// =====================================================
// UPDATE PATIENT PROFILE USING USER ID
// =====================================================

export const updatePatientProfile = async (
  userId,
  profileData
) => {
  const response = await fetch(
    `${API_URL}/user/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "Update Patient Error:",
      errorText
    );

    throw new Error(
      errorText || "Failed to update patient profile"
    );
  }

  return await response.json();
};