import { API_ORIGIN } from "../../../apiBase.js";
import React, { useEffect, useState } from "react";
import "./ManageNurses.css";
import "../admin-module-theme.css";

function ManageNurses() {
  const [nurses, setNurses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
  });

  // ================= FETCH NURSES FROM DATABASE =================

  useEffect(() => {
    fetchNurses();
  }, []);

  const fetchNurses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_ORIGIN}/api/users/nurses/profiles`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch nurses");
      }

      const data = await response.json();

      const formattedNurses = data.map((nurse) => ({
        id: nurse.id,
        name: nurse.name || "Not Updated",
        email: nurse.email || "",
        phone: nurse.phone || "",
        specialization: nurse.specialization || "",
        experience: nurse.experience || "",
        address: nurse.address || "",
        status: "Active",
      }));

      setNurses(formattedNurses);
    } catch (err) {
      console.error(err);
      setError("Unable to load nurses from database.");
    } finally {
      setLoading(false);
    }
  };

  // ================= FORM CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= ADD NURSE =================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.specialization
    ) {
      return;
    }

    const newNurse = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      specialization: formData.specialization,
      experience: "",
      address: "",
      status: "Active",
    };

    setNurses([...nurses, newNurse]);

    setFormData({
      name: "",
      email: "",
      phone: "",
      specialization: "",
    });

    setShowForm(false);
  };

  // ================= STATUS =================

  const toggleStatus = (id) => {
    setNurses(
      nurses.map((nurse) =>
        nurse.id === id
          ? {
              ...nurse,
              status:
                nurse.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : nurse
      )
    );
  };

  // ================= DELETE =================

  const deleteNurse = (id) => {
    setNurses(
      nurses.filter(
        (nurse) => nurse.id !== id
      )
    );
  };

  // ================= SEARCH =================

  const filteredNurses = nurses.filter((nurse) =>
    `${nurse.name} ${nurse.email} ${nurse.phone} ${nurse.specialization} ${nurse.experience} ${nurse.address}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="admin-nurses-page">

      {/* ================= HEADER ================= */}

      <div className="admin-nurses-header">

        <div className="admin-nurses-header-content">

          <span className="admin-nurses-label">
            ADMIN MODULE
          </span>

          <h1>Manage Nurses</h1>

          <p>
            Manage nurses and their professional details.
          </p>

        </div>

        <div className="admin-nurses-count">

          <strong>{nurses.length}</strong>

          <span>Total Nurses</span>

        </div>

      </div>


      {/* ================= TOOLBAR ================= */}

      <div className="admin-nurses-toolbar">

        <div className="admin-nurses-search">

          <svg
            viewBox="0 0 24 24"
            fill="none"
          >

            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />

            <path
              d="M16 16L21 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />

          </svg>

          <input
            type="text"
            placeholder="Search nurses..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <button
          className="admin-add-nurse-btn"
          onClick={() =>
            setShowForm(!showForm)
          }
        >

          <span>+</span>

          Add Nurse

        </button>

      </div>


      {/* ================= ERROR ================= */}

      {error && (
        <div
          style={{
            background: "#fff",
            color: "#b85c5c",
            padding: "12px 16px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}


      {/* ================= ADD NURSE FORM ================= */}

      {showForm && (

        <div className="admin-nurse-form-card">

          <div className="admin-form-title">

            <div>

              <span>
                NURSE REGISTRATION
              </span>

              <h2>Add New Nurse</h2>

            </div>

            <button
              className="admin-form-close"
              onClick={() =>
                setShowForm(false)
              }
            >
              ×
            </button>

          </div>


          <form
            className="admin-nurse-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter nurse name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>


            <div className="admin-form-group">

              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />

            </div>


            <div className="admin-form-group">

              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>


            <div className="admin-form-group">

              <label>Specialization</label>

              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
              >

                <option value="">
                  Select specialization
                </option>

                <option value="General Nursing">
                  General Nursing
                </option>

                <option value="Home Care">
                  Home Care
                </option>

                <option value="Elder Care">
                  Elder Care
                </option>

                <option value="Pediatric Care">
                  Pediatric Care
                </option>

                <option value="Post Surgical Care">
                  Post Surgical Care
                </option>

              </select>

            </div>


            <div className="admin-form-actions">

              <button
                type="button"
                className="admin-cancel-btn"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-save-btn"
              >
                Add Nurse
              </button>

            </div>

          </form>

        </div>

      )}


      {/* ================= NURSE LIST ================= */}

      <div className="admin-nurses-section">

        <div className="admin-section-heading">

          <div className="admin-section-line"></div>

          <div>

            <h2>Nurse List</h2>

            <p>
              View and manage registered nurses.
            </p>

          </div>

        </div>


        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="admin-nurses-empty">

            <h3>Loading Nurses...</h3>

            <p>
              Fetching registered nurses from database.
            </p>

          </div>

        ) : filteredNurses.length === 0 ? (

          <div className="admin-nurses-empty">

            <div className="admin-empty-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
              >

                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M4 21C4 16.58 7.58 13 12 13C16.42 13 20 16.58 20 21"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

              </svg>

            </div>

            <h3>
              No Nurses Found
            </h3>

            <p>
              {search
                ? "Try searching with a different name."
                : "No registered nurses found in database."}
            </p>

          </div>

        ) : (

          <div className="admin-nurses-list">

            {filteredNurses.map((nurse) => (

              <div
                className="admin-nurse-card"
                key={nurse.id}
              >

                {/* AVATAR */}

                <div className="admin-nurse-avatar">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                  >

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


                {/* INFO */}

                <div className="admin-nurse-info">

                  <h3>
                    {nurse.name}
                  </h3>

                  <span>
                    {nurse.specialization || "Professional details pending"}
                  </span>

                  <div className="admin-nurse-contact">

                    <small>
                      Nurse ID: {nurse.id}
                    </small>

                    {nurse.email && (
                      <small>
                        {nurse.email}
                      </small>
                    )}

                    {nurse.phone && (
                      <small>
                        {nurse.phone}
                      </small>
                    )}

                    {nurse.experience && (
                      <small>
                        Experience: {nurse.experience}
                      </small>
                    )}

                    {nurse.address && (
                      <small>
                        Address: {nurse.address}
                      </small>
                    )}

                  </div>

                </div>


                {/* STATUS */}

                <button
                  className={`admin-nurse-status ${
                    nurse.status.toLowerCase()
                  }`}
                  onClick={() =>
                    toggleStatus(nurse.id)
                  }
                >

                  <span></span>

                  {nurse.status}

                </button>


                {/* DELETE */}

                <button
                  className="admin-delete-btn"
                  onClick={() =>
                    deleteNurse(nurse.id)
                  }
                  title="Delete Nurse"
                >

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                  >

                    <path
                      d="M4 7H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M10 11V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M14 11V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M6 7L7 20H17L18 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M9 7V4H15V7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />

                  </svg>

                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default ManageNurses;