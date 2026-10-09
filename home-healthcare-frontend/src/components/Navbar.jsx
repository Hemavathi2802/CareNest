import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

/* =================================================
   CARENEST LOGO
================================================= */

function CareNestLogo() {
  return (
    <svg
      className="carenest-logo"
      viewBox="0 0 260 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="careNestGradient"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#7654C4" />
          <stop offset="55%" stopColor="#A66DE3" />
          <stop offset="100%" stopColor="#D477B3" />
        </linearGradient>
      </defs>

      <circle cx="35" cy="35" r="29" fill="#F5F0FF" />

      {/* Heart */}
      <path
        d="M35 51
           C30 46 20 40 20 31
           C20 25 25 21 30 21
           C33 21 36 23 38 26
           C40 23 43 21 46 21
           C51 21 56 25 56 31
           C56 40 45 46 35 51Z"
        fill="url(#careNestGradient)"
      />

      {/* Medical Cross */}
      <rect
        x="32"
        y="28"
        width="6"
        height="17"
        rx="2"
        fill="white"
      />

      <rect
        x="26.5"
        y="33.5"
        width="17"
        height="6"
        rx="2"
        fill="white"
      />

      {/* CareNest Text */}
      <text
        x="78"
        y="43"
        fontFamily="Arial, sans-serif"
        fontSize="31"
        fontWeight="800"
        letterSpacing="-1"
        fill="url(#careNestGradient)"
      >
        CareNest
      </text>

      {/* Tagline */}
      <text
        x="80"
        y="57"
        fontFamily="Arial, sans-serif"
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="1.2"
        fill="#888094"
      >
        HEALTHCARE AT YOUR DOORSTEP
      </text>
    </svg>
  );
}

/* =================================================
   HOME ICON
================================================= */

function HomeIcon() {
  return (
    <svg
      className="nav-icon"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M3 10.5L12 3L21 10.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5.5 9.5V20H18.5V9.5"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M9.5 20V14H14.5V20"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

/* =================================================
   SERVICES ICON
================================================= */

function ServicesIcon() {
  return (
    <svg
      className="nav-icon"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4 8H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M6 4H18L20 8V20H4V8L6 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <path
        d="M12 11V17M9 14H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =================================================
   ABOUT ICON
================================================= */

function AboutIcon() {
  return (
    <svg
      className="nav-icon"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M12 10.5V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="7.5"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

/* =================================================
   CONTACT ICON
================================================= */

function ContactIcon() {
  return (
    <svg
      className="nav-icon"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M4 7L12 13L20 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =================================================
   NURSING CARE ICON
================================================= */

function NurseIcon() {
  return (
    <svg
      className="service-icon"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="6"
        r="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M6 21C6.5 16 8.5 12.5 12 12.5C15.5 12.5 17.5 16 18 21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M12 14V18M10 16H14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =================================================
   ELDERLY CARE ICON
================================================= */

function ElderIcon() {
  return (
    <svg
      className="service-icon"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="7"
        r="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M6 21C6.5 16.5 8.5 13 12 13C15.5 13 17.5 16.5 18 21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M5 20H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M5 10L3 12M19 10L21 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =================================================
   POST-SURGERY CARE ICON
================================================= */

function PostSurgeryIcon() {
  return (
    <svg
      className="service-icon"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 20.5S4 16 4 9.5C4 6.5 6.2 4.5 9 4.5C10.5 4.5 11.5 5.3 12 6.5C12.5 5.3 13.5 4.5 15 4.5C17.8 4.5 20 6.5 20 9.5C20 16 12 20.5 12 20.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M12 8.5V14.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M9 11.5H15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =================================================
   PHYSIOTHERAPY ICON
================================================= */

function PhysioIcon() {
  return (
    <svg
      className="service-icon"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="15"
        cy="5"
        r="2"
        fill="currentColor"
      />

      <path
        d="M13 8L10 12L14 14L17 11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M10 12L7 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M14 14L19 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M10 12L5 10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =================================================
   MEDICATION ASSISTANCE ICON
================================================= */

function MedicationIcon() {
  return (
    <svg
      className="service-icon"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="5"
        y="8"
        width="14"
        height="8"
        rx="4"
        transform="rotate(-45 12 12)"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M9 15L15 9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =================================================
   GENERAL HOME CARE ICON
================================================= */

function GeneralHomeCareIcon() {
  return (
    <svg
      className="service-icon"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M3.5 11L12 4L20.5 11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5.5 10V20H18.5V10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M9.5 20V15H14.5V20"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M12 11V13M11 12H13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =================================================
   NAVBAR
================================================= */

function Navbar() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesMenuRef = useRef(null);

  useEffect(() => {
    if (!servicesOpen) {
      return undefined;
    }

    const closeOnOutsideClick = (event) => {
      if (!servicesMenuRef.current?.contains(event.target)) {
        setServicesOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [servicesOpen]);

  const closeServicesMenu = () => setServicesOpen(false);

  return (
    <nav className="navbar">

      {/* LOGO */}

      <Link to="/" className="navbar-logo">
        <CareNestLogo />
      </Link>

      {/* NAVIGATION LINKS */}

      <div className="navbar-links">

        {/* HOME */}

        <Link to="/" className="nav-link">
          <HomeIcon />
          <span>Home</span>
        </Link>

        {/* SERVICES DROPDOWN */}

        <div
          className={`navbar-services${servicesOpen ? " is-open" : ""}`}
          ref={servicesMenuRef}
        >

          <button
            type="button"
            className="services-dropdown-btn"
            aria-haspopup="true"
            aria-expanded={servicesOpen}
            onClick={() => setServicesOpen((open) => !open)}
          >
            <ServicesIcon />
            <span>Services</span>

            <svg
              className="dropdown-arrow"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="services-dropdown">

            {/* NURSING CARE */}

            <Link to="/services/nursing-care" onClick={closeServicesMenu}>
              <NurseIcon />
              <span>Nursing Care</span>
            </Link>

            {/* ELDERLY CARE */}

            <Link to="/services/elderly-care" onClick={closeServicesMenu}>
              <ElderIcon />
              <span>Elderly Care</span>
            </Link>

            {/* POST-SURGERY CARE */}

            <Link to="/services/post-surgery-care" onClick={closeServicesMenu}>
              <PostSurgeryIcon />
              <span>Post-Surgery Care</span>
            </Link>

            {/* PHYSIOTHERAPY */}

            <Link to="/services/physiotherapy" onClick={closeServicesMenu}>
              <PhysioIcon />
              <span>Physiotherapy</span>
            </Link>

            {/* MEDICATION ASSISTANCE */}

            <Link to="/services/medication-assistance" onClick={closeServicesMenu}>
              <MedicationIcon />
              <span>Medication Assistance</span>
            </Link>

            {/* GENERAL HOME CARE */}

            <Link to="/services/general-home-care" onClick={closeServicesMenu}>
              <GeneralHomeCareIcon />
              <span>General Home Care</span>
            </Link>

          </div>
        </div>

        {/* ABOUT */}

        <a
          href="/#about"
          className="nav-link"
        >
          <AboutIcon />
          <span>About</span>
        </a>

        {/* CONTACT */}

        <a
          href="/#contact"
          className="nav-link"
        >
          <ContactIcon />
          <span>Contact</span>
        </a>

      </div>

      {/* LOGIN AND SIGNUP */}

      <div className="navbar-actions">

        <Link
          to="/login"
          className="navbar-login"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="navbar-signup"
        >
          Sign Up
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;