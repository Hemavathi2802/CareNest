
import { API_ORIGIN } from "../apiBase.js";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  const readResponse = async (response) => {
    const text = await response.text();

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  };

  const handleSendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      showMessage("Please enter your email address.", "error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_ORIGIN}/api/password-reset/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
          }),
        }
      );

      const result = await readResponse(response);

      if (!response.ok) {
        showMessage(
          result.message ||
            result.error ||
            "Unable to send OTP. Please try again.",
          "error"
        );
        return;
      }

      setEmail(normalizedEmail);
      setOtpSent(true);
      setOtpVerified(false);
      setOtp("");
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");

      showMessage(
        result.message || "OTP sent. Please check your email.",
        "success"
      );
    } catch {
      showMessage(
        "Unable to connect to the server. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otp.trim())) {
      showMessage("Please enter a valid 6-digit OTP.", "error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_ORIGIN}/api/password-reset/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp: otp.trim(),
          }),
        }
      );

      const result = await readResponse(response);

      if (!response.ok) {
        showMessage(
          result.message ||
            result.error ||
            "OTP verification failed. Please try again.",
          "error"
        );
        return;
      }

      if (!result.resetToken) {
        showMessage(
          "The server did not return a reset token. Please request a new OTP.",
          "error"
        );
        return;
      }

      setResetToken(result.resetToken);
      setOtpVerified(true);

      showMessage(
        result.message || "OTP verified successfully.",
        "success"
      );
    } catch {
      showMessage(
        "Unable to connect to the server. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      showMessage(
        "Password must contain at least 8 characters.",
        "error"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("Passwords do not match.", "error");
      return;
    }

    if (!resetToken) {
      showMessage("Please verify your OTP again.", "error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_ORIGIN}/api/password-reset/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            resetToken,
            newPassword,
          }),
        }
      );

      const result = await readResponse(response);

      if (!response.ok) {
        showMessage(
          result.message ||
            result.error ||
            "Unable to reset password. Please try again.",
          "error"
        );
        return;
      }

      showMessage(
        result.message || "Password reset successfully.",
        "success"
      );

      setResetToken("");
      setOtpVerified(false);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch {
      showMessage(
        "Unable to connect to the server. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
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
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setMessage("");
              }}
              autoComplete="email"
              required
            />

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {otpSent && !otpVerified && (
          <div className="forgot-section">
            <label htmlFor="otp">Enter OTP</label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(event) => {
                setOtp(
                  event.target.value.replace(/\D/g, "").slice(0, 6)
                );
                setMessage("");
              }}
              maxLength={6}
              autoComplete="one-time-code"
              required
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Resend OTP"}
            </button>
          </div>
        )}

        {otpVerified && (
          <form
            className="forgot-section"
            onSubmit={handleResetPassword}
          >
            <label htmlFor="newPassword">New Password</label>

            <div className="forgot-password-input-wrapper">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setMessage("");
                }}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="forgot-password-toggle"
                aria-label={
                  showNewPassword ? "Hide password" : "Show password"
                }
                aria-pressed={showNewPassword}
                onClick={() =>
                  setShowNewPassword((visible) => !visible)
                }
              >
                {showNewPassword ? "Hide" : "Show"}
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
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setMessage("");
                }}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="forgot-password-toggle"
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
                aria-pressed={showConfirmPassword}
                onClick={() =>
                  setShowConfirmPassword((visible) => !visible)
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && (
          <div
            className={`forgot-message ${messageType}-message`}
            role="status"
            aria-live="polite"
          >
            {message}
          </div>
        )}

        <p className="back-login-link">
          Remember your password?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
