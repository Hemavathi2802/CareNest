import React, { useEffect, useState } from "react";
import "./PatientProfile.css";

import {
  getPatientProfile,
  createPatientProfile,
  updatePatientProfile,
} from "./profileService";

function PatientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [patientId, setPatientId] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ================= LOGGED IN USER =================

  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const userId = loggedInUser?.id;

  // ================= LOAD PROFILE =================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        // Check login
        if (!userId) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        console.log("Logged-in User ID:", userId);

        // Get profile using USER ID
        const data = await getPatientProfile(userId);

        console.log("Patient profile loaded:", data);

        // Profile exists
        if (data) {
          setPatientId(data.patientId ?? null);
          setProfile({
            name: data.name || loggedInUser?.name || "",
            email: loggedInUser?.email || "",
            phone: data.phone || "",
            age: data.age || "",
            gender: data.gender || "",
            address: data.address || "",
          });

          setProfileExists(true);
          setIsEditing(false);
        }
      } catch (profileError) {
        console.error(
          "Patient profile loading error:",
          profileError
        );

        /*
         * If profile does not exist,
         * show create profile form.
         */

        setProfile({
          name: loggedInUser?.name || "",
          email: loggedInUser?.email || "",
          phone: "",
          age: "",
          gender: "",
          address: "",
        });

        setPatientId(null);
        setProfileExists(false);
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));
  };

  // ================= EDIT =================

  const handleEdit = () => {
    setMessage("");
    setError("");
    setIsEditing(true);
  };

  // ================= CANCEL =================

  const handleCancel = () => {
    setMessage("");
    setError("");

    if (profileExists) {
      setIsEditing(false);
    }
  };

  // ================= SAVE =================

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      // Check user
      if (!userId) {
        setError("User not logged in.");
        return;
      }

      // Validate name
      if (!profile.name.trim()) {
        setError("Please enter your name.");
        return;
      }

      // Validate age
      if (!profile.age) {
        setError("Please enter your age.");
        return;
      }

      // Validate gender
      if (!profile.gender) {
        setError("Please select your gender.");
        return;
      }

      // Validate phone
      if (!profile.phone.trim()) {
        setError("Please enter your phone number.");
        return;
      }

      // Validate address
      if (!profile.address.trim()) {
        setError("Please enter your address.");
        return;
      }

      // ================= PATIENT DATA =================

      const patientData = {
        userId: Number(userId),
        name: profile.name.trim(),
        age: Number(profile.age),
        gender: profile.gender,
        phone: profile.phone.trim(),
        address: profile.address.trim(),
      };

      console.log(
        "Patient data being saved:",
        patientData
      );

      let savedProfile;

      // ================= CREATE =================

      if (!profileExists) {
        console.log(
          "Creating new patient profile..."
        );

        savedProfile =
          await createPatientProfile(patientData);

        console.log(
          "Patient profile created:",
          savedProfile
        );

        setPatientId(savedProfile.patientId ?? null);
        setProfileExists(true);

        setProfile({
          name: savedProfile.name || "",
          email: loggedInUser?.email || "",
          phone: savedProfile.phone || "",
          age: savedProfile.age || "",
          gender: savedProfile.gender || "",
          address: savedProfile.address || "",
        });

        setMessage(
          "Patient profile created successfully."
        );
      }

      // ================= UPDATE =================

      else {
        console.log(
          "Updating patient profile using user ID:",
          userId
        );

        savedProfile =
          await updatePatientProfile(
            userId,
            patientData
          );

        console.log(
          "Patient profile updated:",
          savedProfile
        );

        setPatientId(savedProfile.patientId ?? patientId);
        setProfile({
          name: savedProfile.name || "",
          email: loggedInUser?.email || "",
          phone: savedProfile.phone || "",
          age: savedProfile.age || "",
          gender: savedProfile.gender || "",
          address: savedProfile.address || "",
        });

        setMessage(
          "Profile updated successfully."
        );
      }

      setIsEditing(false);
    } catch (err) {
      console.error(
        "SAVE PROFILE ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to save profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="patient-profile-page">
        <div className="patient-profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="patient-profile-page">

      {/* ================= HEADER ================= */}

      <div className="patient-profile-header">

        <span className="patient-profile-label">
          YOUR CARE
        </span>

        <h1>
          My Profile
        </h1>

        <p>
          View and manage your personal information.
        </p>

      </div>

      {/* ================= MAIN CONTAINER ================= */}

      <div className="patient-profile-container">

        <div className="patient-profile-card">

          {/* ================= PROFILE TOP ================= */}

          <div className="patient-profile-top">

            <div className="patient-profile-avatar">

              {profile.name
                ? profile.name
                    .charAt(0)
                    .toUpperCase()
                : "P"}

            </div>

            <div className="patient-profile-name">

              <h2>
                {profile.name || "Patient"}
              </h2>

              <p>
                Patient
              </p>

            </div>

            {!isEditing && (
              <button
                type="button"
                className="patient-profile-edit-btn"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            )}

          </div>

          {/* ================= PERSONAL INFORMATION ================= */}

          <div className="patient-profile-section">

            <div className="patient-profile-section-heading">

              <span className="patient-profile-section-line"></span>

              <div>

                <h3>
                  Personal Information
                </h3>

                <p>
                  Your basic personal details
                </p>

              </div>

            </div>

            <div className="patient-profile-grid">

              {/* ================= PATIENT ID ================= */}

              <div className="patient-profile-field">

                <label>
                  Patient ID
                </label>

                <div className="patient-profile-value">
                  {patientId ?? "Not assigned"}
                </div>

              </div>

              {/* ================= NAME ================= */}

              <div className="patient-profile-field">

                <label>
                  Full Name
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="patient-profile-value">
                    {profile.name || "Not provided"}
                  </div>
                )}

              </div>

              {/* ================= EMAIL ================= */}

              <div className="patient-profile-field">

                <label>
                  Email Address
                </label>

                <div className="patient-profile-value">
                  {profile.email || "Not provided"}
                </div>

              </div>

              {/* ================= PHONE ================= */}

              <div className="patient-profile-field">

                <label>
                  Phone Number
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="patient-profile-value">
                    {profile.phone || "Not provided"}
                  </div>
                )}

              </div>

              {/* ================= AGE ================= */}

              <div className="patient-profile-field">

                <label>
                  Age
                </label>

                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={profile.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                    placeholder="Enter your age"
                  />
                ) : (
                  <div className="patient-profile-value">
                    {profile.age || "Not provided"}
                  </div>
                )}

              </div>

              {/* ================= GENDER ================= */}

              <div className="patient-profile-field">

                <label>
                  Gender
                </label>

                {isEditing ? (
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select Gender
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>
                ) : (
                  <div className="patient-profile-value">
                    {profile.gender || "Not provided"}
                  </div>
                )}

              </div>

              {/* ================= ADDRESS ================= */}

              <div className="patient-profile-field patient-profile-full">

                <label>
                  Address
                </label>

                {isEditing ? (
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter your address"
                  />
                ) : (
                  <div className="patient-profile-value">
                    {profile.address || "Not provided"}
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* ================= MESSAGES ================= */}

          {message && (
            <div
              className="patient-profile-success"
              style={{
                margin: "15px 25px",
                padding: "12px",
                borderRadius: "8px",
                background: "#e8f8ee",
                color: "#16803c",
                textAlign: "center",
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              className="patient-profile-error"
              style={{
                margin: "15px 25px",
                padding: "12px",
                borderRadius: "8px",
                background: "#ffecec",
                color: "#d32f2f",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* ================= ACTION BUTTONS ================= */}

          {isEditing && (
            <div className="patient-profile-save">

              <button
                type="button"
                className="patient-profile-cancel-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="patient-profile-save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Profile"}
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default PatientProfile;