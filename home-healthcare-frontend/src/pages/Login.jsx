import { API_ORIGIN } from "../apiBase.js";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [challengeId, setChallengeId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoggingIn(true);
    setLoginSuccess(false);
    setLoginError(false);
    setOtpError("");
    setOtpMessage("");

    try {
      const response = await fetch(
        `${API_ORIGIN}/api/users/login?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const user = await response.json();

        const role = user.role?.toUpperCase();

        if (role === "ADMIN" && user.otpRequired && user.challengeId) {
          localStorage.removeItem("adminSessionToken");
          localStorage.removeItem("loggedInUser");
          setChallengeId(user.challengeId);
          setOtp("");
          setOtpMessage("Sending a 6-digit OTP to the admin email address...");
          setIsSendingOtp(true);
          void sendAdminOtp(user.challengeId);
          return;
        }

        if (role !== "NURSE" && role !== "PATIENT") {
          setLoginError(true);
          return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(user));
        setLoginSuccess(true);

        setTimeout(() => {
          if (role === "NURSE") {
            navigate("/dashboard/nurse");
          } else {
            navigate("/dashboard/patient");
          }
        }, 1000);
      } else {
        const message = await response.text();
        console.log(message);

        setLoginError(true);
      }
    } catch (error) {
      console.error(error);

      setLoginError(true);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const sendAdminOtp = async (id) => {
    try {
      const response = await fetch(
        `${API_ORIGIN}/api/users/admin/otp/send?challengeId=${encodeURIComponent(
          id
        )}`,
        { method: "POST" }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Unable to send the OTP email.");
      }

      setOtpMessage("A 6-digit OTP was sent to the admin email address. It expires in 5 minutes.");
    } catch (error) {
      console.error(error);
      setOtpError(error.message || "Could not send the OTP. Please try again.");
      setOtpMessage("");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_ORIGIN}/api/users/admin/otp/verify?challengeId=${encodeURIComponent(
          challengeId
        )}&otp=${encodeURIComponent(otp)}`,
        { method: "POST" }
      );

      const result = await response.json();
      if (!response.ok) {
        setOtpError(result.message || "OTP verification failed.");
        return;
      }

      localStorage.setItem("adminSessionToken", result.accessToken);
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ role: result.role, email })
      );
      navigate("/dashboard/admin", { replace: true });
    } catch {
      setOtpError("Could not verify the OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    setOtpMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_ORIGIN}/api/users/admin/otp/resend?challengeId=${encodeURIComponent(
          challengeId
        )}`,
        { method: "POST" }
      );
      const result = await response.json();

      if (!response.ok) {
        setOtpError(result.message || "Could not resend the OTP.");
        return;
      }

      setOtp("");
      setOtpMessage("A new OTP was sent. The previous OTP is no longer valid.");
    } catch {
      setOtpError("Could not resend the OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>

        <p className="subtitle">
          Login to your Home Healthcare account
        </p>

        {!challengeId ? (
          <>
            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setLoginError(false);
                  setLoginSuccess(false);
                }}
                required
              />

              <label htmlFor="password">Password</label>
              <div className="login-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setLoginError(false);
                    setLoginSuccess(false);
                  }}
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              <div className="forgot-password-link">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <button type="submit" disabled={isLoggingIn}>
                {isLoggingIn ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="signup-link">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <p className="subtitle">
              Enter the 6-digit code sent to the admin email address.
            </p>

            <label htmlFor="admin-otp">6-digit OTP</label>
            <input
              id="admin-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                setOtpError("");
              }}
              aria-describedby="admin-otp-status"
              required
            />

            {otpError && (
              <p id="admin-otp-status" className="error-message" role="alert">
                {otpError}
              </p>
            )}
            {!otpError && otpMessage && (
              <p id="admin-otp-status" role="status">
                {otpMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isSendingOtp || otp.length !== 6}
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isSubmitting || isSendingOtp}
            >
              {isSendingOtp ? "Sending OTP..." : "Resend OTP"}
            </button>
          </form>
        )}
      </div>

      {loginSuccess && (
        <div className="login-message success-message">
          <span className="message-icon">✓</span>
          <span>Login Successful</span>
        </div>
      )}

      {loginError && (
        <div className="login-message error-message">
          <span className="message-icon">!</span>
          <span>
            Invalid login role or email/password
          </span>
        </div>
      )}
    </div>
  );
}

export default Login;