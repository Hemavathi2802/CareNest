import { API_ORIGIN } from "../../../apiBase.js";
import React, { useEffect, useState } from "react";
import "./NurseProfile.css";
import "../nurse-module-theme.css";

function NurseProfile() {
  const [profile, setProfile] = useState({
    name: "",
    nurseId: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // ==========================================
  // GET NURSE PROFILE
  // ==========================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setMessage({
        type: "",
        text: "",
      });

      const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
      );

      if (!loggedInUser || !loggedInUser.id) {
        throw new Error("Nurse login details not found.");
      }

      const response = await fetch(
        `${API_ORIGIN}/api/users/nurse/${loggedInUser.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load nurse profile."
        );
      }

      setProfile({
        name: data.name || "",
        nurseId: data.id || "",
        email: data.email || "",
        phone: data.phone || "",
        specialization: data.specialization || "",
        experience: data.experience || "",
        address: data.address || "",
      });

    } catch (error) {
      console.error("Nurse profile loading error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to load profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // UPDATE NURSE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    if (!profile.name.trim()) {
      setMessage({
        type: "error",
        text: "Please enter nurse name.",
      });
      return;
    }

    if (!profile.email.trim()) {
      setMessage({
        type: "error",
        text: "Please enter email.",
      });
      return;
    }

    if (!profile.phone.trim()) {
      setMessage({
        type: "error",
        text: "Please enter phone number.",
      });
      return;
    }

    try {
      setSaving(true);

      const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
      );

      if (!loggedInUser || !loggedInUser.id) {
        throw new Error("Nurse login details not found.");
      }

      const response = await fetch(
        `${API_ORIGIN}/api/users/nurse/${loggedInUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            specialization: profile.specialization,
            experience: profile.experience,
            address: profile.address,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update profile."
        );
      }

      // Update displayed profile with saved DB data
      setProfile({
        name: data.name || "",
        nurseId: data.id || "",
        email: data.email || "",
        phone: data.phone || "",
        specialization: data.specialization || "",
        experience: data.experience || "",
        address: data.address || "",
      });

      // Keep localStorage user information updated
      const updatedLoggedInUser = {
        ...loggedInUser,
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone,
        specialization: data.specialization,
        experience: data.experience,
        address: data.address,
      };

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(updatedLoggedInUser)
      );

      setMessage({
        type: "success",
        text: "Profile updated successfully.",
      });

    } catch (error) {
      console.error("Nurse profile update error:", error);

      setMessage({
        type: "error",
        text: error.message || "Unable to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="nurse-profile-page">
        <div className="nurse-profile-loading">
          <div className="nurse-profile-loader"></div>
          <p>Loading nurse profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nurse-profile-page">

      {/* HEADER */}

      <div className="nurse-profile-header">

        <span className="nurse-profile-label">
          CARENEST • NURSE PORTAL
        </span>

        <h1>Nurse Profile</h1>

        <p>
          View and manage your professional information.
        </p>

      </div>

      {/* MESSAGE */}

      {message.text && (
        <div
          className={`nurse-profile-alert ${
            message.type === "success"
              ? "success"
              : "error"
          }`}
        >

          <div className="nurse-profile-alert-icon">

            {message.type === "success" ? (

              <svg viewBox="0 0 24 24" fill="none">

                <path
                  d="M5 12.5L9.5 17L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>

            ) : (

              <svg viewBox="0 0 24 24" fill="none">

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

            )}

          </div>

          <span>{message.text}</span>

        </div>
      )}

      {/* PROFILE CARD */}

      <div className="nurse-profile-card">

        {/* PROFILE TOP */}

        <div className="nurse-profile-top">

          <div className="nurse-profile-avatar">

            <svg viewBox="0 0 24 24" fill="none">

              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
              />

              <path
                d="M4 21C4 16.58 7.58 13 12 13C16.42 13 20 16.58 20 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

            </svg>

          </div>

          <div>

            <h2>
              {profile.name || "Nurse"}
            </h2>

            <p>
              {profile.specialization || "Nurse"}
            </p>

          </div>

        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>

          <div className="nurse-profile-grid">

            {/* NAME */}

            <div className="nurse-profile-field">

              <label>Nurse Name</label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter nurse name"
              />

            </div>

            {/* NURSE ID */}

            <div className="nurse-profile-field">

              <label>Nurse ID</label>

              <input
                type="text"
                name="nurseId"
                value={profile.nurseId}
                placeholder="Nurse ID"
                disabled
              />

            </div>

            {/* EMAIL */}

            <div className="nurse-profile-field">

              <label>Email</label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Enter email"
              />

            </div>

            {/* PHONE */}

            <div className="nurse-profile-field">

              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />

            </div>

            {/* SPECIALIZATION */}

            <div className="nurse-profile-field">

              <label>Specialization</label>

              <input
                type="text"
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
                placeholder="Enter specialization"
              />

            </div>

            {/* EXPERIENCE */}

            <div className="nurse-profile-field">

              <label>Experience</label>

              <input
                type="text"
                name="experience"
                value={profile.experience}
                onChange={handleChange}
                placeholder="Example: 5 Years"
              />

            </div>

            {/* ADDRESS */}

            <div className="nurse-profile-field full">

              <label>Address</label>

              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows="4"
              />

            </div>

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="nurse-profile-submit"
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "Update Profile"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default NurseProfile;