import { API_ORIGIN } from "../apiBase.js";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const passwordError =
    "Password must contain 8 characters, uppercase, lowercase, number and special character.";

  const isStrongPassword = (value) => {
    return (
      value.length >= 8 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value) &&
      /[^A-Za-z0-9]/.test(value)
    );
  };

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const validateEmail = () => {
    if (!email.trim()) {
      return "Email is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Enter a valid email address.";
    }

    return "";
  };

  const validateForm = () => {
    if (!name.trim()) {
      return "Full name is required.";
    }

    const emailError = validateEmail();

    if (emailError) {
      return emailError;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return "Enter a valid 10-digit mobile number.";
    }

    if (!selectedRole) {
      return "Please select your role.";
    }

    if (!isStrongPassword(password)) {
      return passwordError;
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    if (!otpVerified) {
      return "Please verify your email with OTP.";
    }

    return "";
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;

    setEmail(newEmail);
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    clearMessages();
  };

  const handleSendOtp = async () => {
    clearMessages();

    const emailError = validateEmail();

    if (emailError) {
      setErrorMessage(emailError);
      return;
    }

    setIsOtpLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch(
        `${API_ORIGIN}/api/otp/send?email=${encodeURIComponent(
          normalizedEmail
        )}`,
        {
          method: "POST",
        }
      );

      const data = await response.text();

      if (response.ok) {
        setOtpSent(true);
        setOtpVerified(false);
        setSuccessMessage(
          "OTP sent successfully. Please check your email."
        );
      } else {
        setErrorMessage(data || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Send OTP error:", error);

      setErrorMessage(
        "Backend connection failed. Please start the backend."
      );
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    clearMessages();

    if (!otpSent) {
      setErrorMessage("Please send OTP first.");
      return;
    }

    if (!/^[0-9]{6}$/.test(otp)) {
      setErrorMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsOtpLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch(
        `${API_ORIGIN}/api/otp/verify?email=${encodeURIComponent(
          normalizedEmail
        )}&otp=${encodeURIComponent(otp)}`,
        {
          method: "POST",
        }
      );

      const data = await response.text();

      if (response.ok) {
        setOtpVerified(true);
        setSuccessMessage("Email verified successfully.");
      } else {
        setOtpVerified(false);
        setErrorMessage(data || "Invalid or expired OTP.");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);

      setErrorMessage(
        "Backend connection failed. Please start the backend."
      );
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    clearMessages();

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const role =
        selectedRole === "nurse" ? "NURSE" : "PATIENT";

      const response = await fetch(
        `${API_ORIGIN}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: normalizedEmail,
            password: password,
            role: role,
          }),
        }
      );

      const contentType = response.headers.get("content-type");

      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        setSignupSuccess(true);
        setSuccessMessage("Registration successful!");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        const backendMessage =
          typeof data === "string"
            ? data
            : data.message || "Registration failed.";

        setErrorMessage(backendMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);

      setErrorMessage(
        "Backend connection failed. Please start the backend."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <div className="signup-badge">
            <span>+</span>
            CARENEST
          </div>

          <h2>Create Account</h2>

          <p>Fill in your details to get started</p>
        </div>

        {errorMessage && (
          <div className="signup-error-message">
            {errorMessage}
          </div>
        )}

        {successMessage && !signupSuccess && (
          <div className="signup-inline-success">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <div className="otp-email-row">
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading || isOtpLoading}
              />

              <button
                type="button"
                className="otp-button"
                onClick={handleSendOtp}
                disabled={
                  isOtpLoading || isLoading || otpVerified
                }
              >
                {isOtpLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>

            {otpSent && !otpVerified && (
              <div className="otp-verification-box">
                <label
                  htmlFor="otp"
                  className="otp-verification-label"
                >
                  Enter Email OTP
                </label>

                <input
                  id="otp"
                  type="text"
                  className="otp-input"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    )
                  }
                  maxLength="6"
                  disabled={isOtpLoading || isLoading}
                />

                <button
                  type="button"
                  className="verify-otp-button"
                  onClick={handleVerifyOtp}
                  disabled={isOtpLoading || isLoading}
                >
                  {isOtpLoading ? "Verifying..." : "Verify OTP"}
                </button>

                <p className="otp-info-text">
                  Check your email and enter the 6-digit OTP.
                </p>
              </div>
            )}

            {otpVerified && (
              <div className="otp-verified-message">
                <span className="otp-verified-icon">✓</span>
                Email verified successfully.
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Mobile Number</label>

            <input
              id="phone"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
              maxLength="10"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Select Your Role</label>

            <div className="role-selection">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="patient"
                  checked={selectedRole === "patient"}
                  onChange={(e) =>
                    setSelectedRole(e.target.value)
                  }
                  disabled={isLoading}
                />

                <span>Patient</span>
              </label>

              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="nurse"
                  checked={selectedRole === "nurse"}
                  onChange={(e) =>
                    setSelectedRole(e.target.value)
                  }
                  disabled={isLoading}
                />

                <span>Nurse</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />

              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <span className="password-hint">
              Use 8+ characters with uppercase, lowercase, number
              and special character.
            </span>

            {password && !isStrongPassword(password) && (
              <span className="password-error-hint">
                {passwordError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="password-wrapper">
              <input
                id="confirmPassword"
                type={
                  showConfirmPassword ? "text" : "password"
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                disabled={isLoading}
              />

              <button
                type="button"
                className="password-toggle"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                aria-pressed={showConfirmPassword}
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? "🙈" : "👁"}
              </button>
            </div>

            {confirmPassword &&
              password !== confirmPassword && (
                <span className="password-error-hint">
                  Passwords do not match.
                </span>
              )}
          </div>

          <button
            type="submit"
            className="signup-submit-button"
            disabled={isLoading || signupSuccess}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="login-link">
          Already have an account?
          <Link to="/login">Login</Link>
        </p>
      </div>

      {signupSuccess && (
        <div className="signup-success-message">
          <span className="success-icon">✓</span>
          Registration successful! Redirecting to login...
        </div>
      )}
    </div>
  );
}

export default SignUp;