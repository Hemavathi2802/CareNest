
import { Link, useParams } from "react-router-dom";
import "./Home.css";

/* ================================
   NAVBAR SERVICE ICONS
================================ */

function NurseIcon() {
  return (
    <svg className="service-icon" viewBox="0 0 24 24" fill="none">
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

function ElderIcon() {
  return (
    <svg className="service-icon" viewBox="0 0 24 24" fill="none">
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

function PostSurgeryIcon() {
  return (
    <svg className="service-icon" viewBox="0 0 24 24" fill="none">
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

function PhysioIcon() {
  return (
    <svg className="service-icon" viewBox="0 0 24 24" fill="none">
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

function MedicationIcon() {
  return (
    <svg className="service-icon" viewBox="0 0 24 24" fill="none">
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

function GeneralHomeCareIcon() {
  return (
    <svg className="service-icon" viewBox="0 0 24 24" fill="none">
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

/* ================================
   WHY CHOOSE US ICONS
================================ */

function TrustedIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none">
      <path
        d="M32 8L51 16V29C51 41 43 50 32 56C21 50 13 41 13 29V16L32 8Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      <path
        d="M23 32L29 38L42 24"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfessionalIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none">
      <circle
        cx="32"
        cy="18"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
      />

      <path
        d="M15 54C15 42 22 34 32 34C42 34 49 42 49 54"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        d="M25 18H39"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CompassionateIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none">
      <path
        d="M32 53C32 53 11 41 11 24C11 17 16 12 23 12C28 12 31 15 32 19C33 15 36 12 41 12C48 12 53 17 53 24C53 41 32 53 32 53Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AvailableIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none">
      <circle
        cx="32"
        cy="32"
        r="21"
        stroke="currentColor"
        strokeWidth="3"
      />

      <path
        d="M32 19V33L41 39"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ================================
   SERVICES DATA
================================ */

const services = [
  {
    id: "nursing-care",
    icon: <NurseIcon />,
    title: "Nursing Care",
    description:
      "Professional nursing care delivered safely at your home.",
    details:
      "Get professional nursing support at home, planned around your care needs and your nurse's availability.",
    includes: [
      "Support with everyday nursing needs",
      "Care visits planned for your preferred date and time",
      "A nurse assigned according to availability",
    ],
    className: "service-blue",
  },

  {
    id: "elderly-care",
    icon: <ElderIcon />,
    title: "Elderly Care",
    description:
      "Compassionate support for senior citizens at home.",
    details:
      "Receive considerate home support that helps older adults with daily routines while respecting their comfort and independence.",
    includes: [
      "Assistance with everyday routines",
      "Companionship and attentive support",
      "Visits planned around your preferred schedule",
    ],
    className: "service-purple",
  },

  {
    id: "post-surgery-care",
    icon: <PostSurgeryIcon />,
    title: "Post-Surgery Care",
    description:
      "Reliable recovery support after hospital discharge.",
    details:
      "Arrange home support for the period after a hospital stay, with visit timing coordinated to nurse availability.",
    includes: [
      "Support with daily care routines",
      "Help following the care instructions provided by your clinician",
      "Home visits scheduled for your preferred date and time",
    ],
    className: "service-green",
  },

  {
    id: "physiotherapy",
    icon: <PhysioIcon />,
    title: "Physiotherapy",
    description:
      "Professional physiotherapy sessions at your home.",
    details:
      "Request a home physiotherapy visit so you can discuss your needs and preferred schedule with the care team.",
    includes: [
      "A home visit arranged around availability",
      "Care focused on the needs you share when booking",
      "Scheduling at a date and time that works for you",
    ],
    className: "service-orange",
  },

  {
    id: "medication-assistance",
    icon: <MedicationIcon />,
    title: "Medication Assistance",
    description:
      "Support for your prescribed medication routine.",
    details:
      "Get practical assistance with your prescribed medication routine at home. Continue to follow the directions given by your clinician.",
    includes: [
      "Support with an existing prescribed routine",
      "Visit scheduling based on nurse availability",
      "A chance to share relevant notes when booking",
    ],
    className: "service-yellow",
  },

  {
    id: "general-home-care",
    icon: <GeneralHomeCareIcon />,
    title: "General Home Care",
    description:
      "Reliable support for everyday activities at home.",
    details:
      "Request practical, patient-focused support at home for everyday care needs.",
    includes: [
      "Support tailored to the needs you share",
      "Home visits arranged around availability",
      "Additional notes can be included with your booking",
    ],
    className: "service-lavender",
  },
];

/* ================================
   HOME
================================ */

function Home() {
  const { serviceId } = useParams();
  const selectedService = serviceId
    ? services.find((service) => service.id === serviceId)
    : null;

  if (serviceId) {
    if (!selectedService) {
      return (
        <main className="service-detail-page">
          <section className="service-detail-card">
            <span className="section-label">SERVICE NOT FOUND</span>
            <h1>This service is unavailable</h1>
            <p>Choose one of the healthcare services currently offered.</p>
            <Link to="/services" className="primary-btn">
              Browse Services
            </Link>
          </section>
        </main>
      );
    }

    return (
      <main className="service-detail-page">
        <section
          className={`service-detail-card ${selectedService.className}`}
        >
          <Link to="/#services" className="service-detail-back">
            ← All services
          </Link>

          <div className="service-detail-icon">
            {selectedService.icon}
          </div>

          <span className="section-label">CARE AT YOUR HOME</span>
          <h1>{selectedService.title}</h1>
          <p className="service-detail-description">
            {selectedService.details}
          </p>

          <h2>What to expect</h2>
          <ul>
            {selectedService.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="service-detail-actions">
            <Link to="/patient/appointments" className="primary-btn">
              Book this service →
            </Link>
            <Link to="/#services" className="service-detail-secondary">
              Explore other services
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="home-page">

      {/* ================================
          HERO
      ================================= */}

      <section className="hero-section">
        <div className="hero-content">

          <div className="hero-badge">
            🩺 Professional Home Healthcare
          </div>

          <h1>
            Quality Healthcare
            <br />
            <span>At Your Doorstep.</span>
          </h1>

          <p>
            CareNest brings professional and compassionate
            healthcare services directly to your home.
            Because quality care should always feel close.
          </p>

          <div className="hero-buttons">
            <Link
              to="/signup"
              className="primary-btn"
            >
              Get Started →
            </Link>

            <a
              href="#services"
              className="secondary-btn"
            >
              Explore Services
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <strong>24/7</strong>
              <span>Care Support</span>
            </div>

            <div>
              <strong>6+</strong>
              <span>Healthcare Services</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Compassionate Care</span>
            </div>
          </div>

        </div>

        <div className="hero-image-area">
          <div className="hero-image-card">

            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=85"
              alt="Professional nurse providing home healthcare"
            />

            <div className="floating-care-card">
              <div className="care-icon">
                💙
              </div>

              <div>
                <strong>Trusted Home Care</strong>
                <small>Professional & compassionate</small>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================
          SERVICES
      ================================= */}

      <section
        className="services-section"
        id="services"
      >
        <div className="section-heading">

          <div className="section-label">
            OUR SERVICES
          </div>

          <h2>
            Healthcare Designed Around You
          </h2>

          <p>
            Professional healthcare services delivered
            at your doorstep with comfort, safety and care.
          </p>

        </div>

        <div className="services-grid">

          {services.map((service) => (
            <Link
              key={service.id}
              to={`/services/${service.id}`}
              className={`service-card ${service.className}`}
            >
              <div className="service-icon">
                {service.icon}
              </div>

              <div className="service-content">
                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <span className="service-link">
                  View Details
                  <b>→</b>
                </span>
              </div>
            </Link>
          ))}

        </div>
      </section>

      {/* ================================
          ABOUT
      ================================= */}

      <section
        className="about-section"
        id="about"
      >
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1100&q=85"
            alt="Professional nurse caring for patient at home"
          />
        </div>

        <div className="about-content">

          <div className="section-label">
            ABOUT CARENEST
          </div>

          <h2>
            Care That Comes
            <br />
            <span>Closer to Home.</span>
          </h2>

          <p>
            CareNest is a home healthcare platform designed
            to connect patients and families with dependable
            healthcare support at home.
          </p>

          <p>
            From nursing and patient care to elder care,
            physiotherapy and medication assistance, we make
            quality healthcare more accessible and convenient.
          </p>

          <div className="about-points">

            <div>
              <span>✓</span>
              <p>Professional healthcare support</p>
            </div>

            <div>
              <span>✓</span>
              <p>Comfortable care at your doorstep</p>
            </div>

            <div>
              <span>✓</span>
              <p>Patient-focused and compassionate service</p>
            </div>

          </div>

          <Link
            to="/signup"
            className="about-btn"
          >
            Start Your Care Journey →
          </Link>

        </div>
      </section>

      {/* ================================
          WHY CHOOSE US
      ================================= */}

      <section
        className="why-section"
        id="why"
      >
        <div className="section-heading">

          <div className="section-label">
            WHY CARENEST
          </div>

          <h2>Why Choose Us?</h2>

          <p>
            We combine professional healthcare with
            compassionate support to make home care
            simple, safe and comfortable.
          </p>

        </div>

        <div className="why-grid">

          <div className="why-card">
            <div className="why-icon">
              <TrustedIcon />
            </div>

            <h3>Trusted Care</h3>

            <p>
              Safe and dependable healthcare services
              for you and your loved ones.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <ProfessionalIcon />
            </div>

            <h3>Professional Team</h3>

            <p>
              Skilled and trained healthcare professionals
              dedicated to quality care.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <CompassionateIcon />
            </div>

            <h3>Compassionate Care</h3>

            <p>
              We treat every patient with kindness,
              respect and personal attention.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <AvailableIcon />
            </div>

            <h3>24 / 7 Support</h3>

            <p>
              Our care support is available whenever
              you need assistance.
            </p>
          </div>

        </div>
      </section>

      {/* ================================
          CTA
      ================================= */}

      <section className="cta-section">
        <div className="cta-content">

          <span>YOUR HEALTH. OUR PRIORITY.</span>

          <h2>Better Care Begins at Home.</h2>

          <p>
            Get the right healthcare support for yourself
            or your loved ones with CareNest.
          </p>

          <Link
            to="/signup"
            className="cta-button"
          >
            Get Started Today →
          </Link>

        </div>
      </section>

      {/* ================================
          CONTACT
      ================================= */}

      <section
        className="contact-section"
        id="contact"
      >
        <div className="contact-heading">

          <div className="section-label">
            GET IN TOUCH
          </div>

          <h2>We're Here to Help</h2>

          <p>
            Have questions about our home healthcare
            services? Reach out to our team and we'll
            be happy to assist you.
          </p>

        </div>

        <div className="contact-container">

          <div className="contact-info">

            <div className="contact-card">
              <div className="contact-icon phone-icon">
                📞
              </div>

              <div>
                <h3>Call Us</h3>
                <p>+91 98765 43210</p>
                <span>Available for healthcare enquiries</span>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon email-icon">
                ✉️
              </div>

              <div>
                <h3>Email Us</h3>
                <p>carenest@gmail.com</p>
                <span>We'll respond as soon as possible</span>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon location-icon">
                📍
              </div>

              <div>
                <h3>Our Location</h3>
                <p>Tamil Nadu, India</p>
                <span>
                  Home healthcare services across your area
                </span>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon time-icon">
                🕐
              </div>

              <div>
                <h3>Care Support</h3>
                <p>24 / 7 Support</p>
                <span>We're available when you need us</span>
              </div>
            </div>

          </div>

          <div className="contact-message">

            <div className="contact-message-badge">
              💙 CareNest Support
            </div>

            <h3>
              Your Care,
              <span> Our Priority.</span>
            </h3>

            <p>
              Whether you need home nursing, patient care,
              elder care, physiotherapy or other healthcare
              support, our team is ready to help you find
              the right care for your loved ones.
            </p>

            <Link
              to="/signup"
              className="contact-btn"
            >
              Get Started →
            </Link>

          </div>

        </div>
      </section>

      {/* ================================
          FOOTER
      ================================= */}

      <footer className="home-footer">

        <div className="footer-brand">

          <h3>🏥 CareNest</h3>

          <p>
            Healthcare at Your Doorstep.
            Professional and compassionate care
            for you and your loved ones.
          </p>

        </div>

        <div className="footer-links">

          <h4>Quick Links</h4>

          <Link to="/">Home</Link>

          <a href="#services">Services</a>

          <a href="#about">About</a>

          <a href="#contact">Contact</a>

        </div>

        <div className="footer-contact">

          <h4>Contact</h4>

          <p>📞 +91 98765 43210</p>

          <p>✉️ carenest@gmail.com</p>

          <p>🕐 24 / 7 Care Support</p>

          <p>📍 Tamil Nadu, India</p>

        </div>

        <div className="footer-bottom">

          <p>© 2026 CareNest. All Rights Reserved.</p>

          <span>Healthcare at Your Doorstep</span>

        </div>

      </footer>

    </div>
  );
}

export default Home;