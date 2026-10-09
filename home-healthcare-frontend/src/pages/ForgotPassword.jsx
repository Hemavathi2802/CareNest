import { API_ORIGIN } from "../apiBase.js";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      showMessage("Please enter your email", "error");
      return;
    }

    try {
      const response = await fetch(
        `${API_ORIGIN}/api/password-reset/send-otp?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "POST",
        }
      );

      const result = await response.text();

      if (response.ok) {
        setOtpSent(true);
        showMessage(result, "success");
      } else {
        showMessage(result, "error");
      }
    } catch (error) {
      showMessage("Unable to connect to server", "error");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      showMessage("Please enter OTP", "error");
      return;
    }

    try {
      const response = await fetch(
        `${API_ORIGIN}/api/password-reset/verify-otp?email=${encodeURIComponent(
          email
        )}&otp=${encodeURIComponent(otp)}`,
        {
          method: "POST",
        }
      );

      const result = await response.text();

      if (response.ok) {
        setOtpVerified(true);
        showMessage(result, "success");
      } else {
        showMessage(result, "error");
      }
    } catch (error) {
      showMessage("Unable to connect to server", "error");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      showMessage(
        "Password must contain at least 8 characters",
        "error"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("Passwords do not match", "error");
      return;
    }

    try {
      const response = await fetch(
        `${API_ORIGIN}/api/password-reset/reset-password?email=${encodeURIComponent(
          email
        )}&newPassword=${encodeURIComponent(
          newPassword
        )}&confirmPassword=${encodeURIComponent(confirmPassword)}`,
        {
          method: "POST",
        }
      );

      const result = await response.text();

      if (response.ok) {
        showMessage(result, "success");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showMessage(result, "error");
      }
    } catch (error) {
      showMessage("Unable to connect to server", "error");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">

        <h2>Forgot Password?</h2>

        <p className="forgot-subtitle">
          Reset your CareNest account password
        </p>

        {!otpSent && (
          <div className="forgot-section">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage("");
              }}
              required
            />

            <button type="button" onClick={handleSendOtp}>
              Send OTP
            </button>

          </div>
        )}

        {otpSent && !otpVerified && (
          <div className="forgot-section">

            <label htmlFor="otp">
              Enter OTP
            </label>

            <input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setMessage("");
              }}
              maxLength="6"
              required
            />

            <button type="button" onClick={handleVerifyOtp}>
              Verify OTP
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={handleSendOtp}
            >
              Resend OTP
            </button>

          </div>
        )}

        {otpVerified && (
          <form
            className="forgot-section"
            onSubmit={handleResetPassword}
          >

            <label htmlFor="newPassword">
              New Password
            </label>

            <div className="forgot-password-input-wrapper">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setMessage("");
                }}
                required
              />
              <button
                type="button"
                className="forgot-password-toggle"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                aria-pressed={showNewPassword}
                onClick={() => setShowNewPassword((visible) => !visible)}
              >
                {showNewPassword ? "🙈" : "👁"}
              </button>
            </div>

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="forgot-password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setMessage("");
                }}
                required
              />
              <button
                type="button"
                className="forgot-password-toggle"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                aria-pressed={showConfirmPassword}
                onClick={() =>
                  setShowConfirmPassword((visible) => !visible)
                }
              >
                {showConfirmPassword ? "🙈" : "👁"}
              </button>
            </div>

            <button type="submit">
              Reset Password
            </button>

          </form>
        )}

        {message && (
          <div className={`forgot-message ${messageType}-message`}>
            {message}
          </div>
        )}

        <p className="back-login-link">
          Remember your password?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;