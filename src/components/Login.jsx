"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Login = () => {
  const navigate = useNavigate()
  const [loginMethod, setLoginMethod] = useState("email") // 'email' or 'phone'
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [otpSent, setOtpSent] = useState(false)
  const [enteredOtp, setEnteredOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (loginMethod === "email") {
      if (!formData.email) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid"
      }
    } else {
      if (!formData.phone) {
        newErrors.phone = "Phone number is required"
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone number must be 10 digits"
      }
    }

    if (!forgotPassword && !formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const sendOtp = async () => {
    if (validateForm()) {
      try {
        setLoading(true)
        // Send OTP to the provided email or phone
        const payload = loginMethod === "email" ? { email: formData.email } : { phone: formData.phone }

        const response = await axios.post("http://localhost:8080/api/auth/send-otp", payload)

        if (response.data.success) {
          setOtpSent(true)
          alert("OTP sent. Please verify.")
        } else {
          alert("Failed to send OTP. Please try again.")
        }
      } catch (error) {
        console.error("Error sending OTP:", error)
        alert("Error sending OTP. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
  }

  const verifyOtp = async () => {
    if (!enteredOtp) {
      alert("Please enter the OTP")
      return
    }

    try {
      setLoading(true)
      // Verify OTP
      const payload = {
        otp: enteredOtp,
        ...(loginMethod === "email" ? { email: formData.email } : { phone: formData.phone }),
      }

      const response = await axios.post("http://localhost:8080/api/auth/verify-otp", payload)

      if (response.data.success) {
        if (forgotPassword) {
          // Navigate to reset password page
          navigate("/reset-password", {
            state: {
              verified: true,
              ...(loginMethod === "email" ? { email: formData.email } : { phone: formData.phone }),
            },
          })
        } else {
          // If OTP is verified, proceed with login
          loginUser()
        }
      } else {
        alert("Invalid OTP. Please try again.")
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      alert("Error verifying OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const loginUser = async () => {
    if (forgotPassword) {
      // This is handled in verifyOtp
      return
    }

    try {
      setLoading(true)
      // Login the user
      const payload = {
        ...(loginMethod === "email" ? { email: formData.email } : { phone: formData.phone }),
        password: formData.password,
      }

      const response = await axios.post("http://localhost:8080/api/auth/login", payload)

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        alert("Login successful!")
        // Redirect to restaurant dashboard after successful login
        navigate("/restaurant/dashboard")
      } else {
        alert("Invalid credentials. Please try again.")
      }
    } catch (error) {
      console.error("Error logging in:", error)
      alert("Error logging in. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (forgotPassword) {
      if (!otpSent) {
        sendOtp()
      } else {
        verifyOtp()
      }
    } else {
      if (loginMethod === "otp") {
        if (!otpSent) {
          sendOtp()
        } else {
          verifyOtp()
        }
      } else {
        // Regular email/phone + password login
        if (validateForm()) {
          loginUser()
        }
      }
    }
  }

  const toggleLoginMethod = (method) => {
    setLoginMethod(method)
    setOtpSent(false)
    setEnteredOtp("")
    setErrors({})
  }

  const handleForgotPassword = () => {
    setForgotPassword(true)
    setOtpSent(false)
    setEnteredOtp("")
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>{forgotPassword ? "Reset Password" : "Login"}</h2>

        {!forgotPassword && (
          <div className="login-tabs">
            <button
              className={`tab-button ${loginMethod === "email" || loginMethod === "password" ? "active" : ""}`}
              onClick={() => toggleLoginMethod("email")}
            >
              Email & Password
            </button>
            <button
              className={`tab-button ${loginMethod === "phone" ? "active" : ""}`}
              onClick={() => toggleLoginMethod("phone")}
            >
              Phone & Password
            </button>
            <button
              className={`tab-button ${loginMethod === "otp" ? "active" : ""}`}
              onClick={() => toggleLoginMethod("otp")}
            >
              Login with OTP
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {forgotPassword || loginMethod !== "otp" || !otpSent ? (
            <>
              {(loginMethod === "email" || forgotPassword) && (
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                    placeholder="Enter your email"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              )}

              {loginMethod === "phone" && (
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? "error" : ""}
                    placeholder="Enter your phone number"
                    maxLength="10"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              )}

              {!forgotPassword && loginMethod !== "otp" && (
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "error" : ""}
                    placeholder="Enter your password"
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
              )}

              {!forgotPassword && loginMethod !== "otp" && (
                <div className="forgot-password">
                  <button type="button" onClick={handleForgotPassword}>
                    Forgot Password?
                  </button>
                </div>
              )}

              <button type="submit" className="login-button" disabled={loading}>
                {loading
                  ? "Processing..."
                  : forgotPassword
                    ? "Send Reset OTP"
                    : loginMethod === "otp"
                      ? "Send OTP"
                      : "Login"}
              </button>
            </>
          ) : (
            <div className="otp-verification">
              <h3>OTP Verification</h3>
              <p>
                An OTP has been sent to your {loginMethod === "email" ? "email" : "phone"}. Please enter it below to
                verify.
              </p>

              <div className="form-group">
                <label>Enter OTP</label>
                <input
                  type="text"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                />
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              <p className="resend-otp">
                Didn't receive OTP?{" "}
                <button type="button" onClick={sendOtp} disabled={loading}>
                  Resend OTP
                </button>
              </p>
            </div>
          )}
        </form>

        <div className="register-link">
          Don't have an account? <a href="/restaurant-registration">Register</a>
        </div>
      </div>
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background-color: #f5f5f5;
        }

        .login-form-container {
          width: 100%;
          max-width: 450px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }

        .login-form-container h2 {
          text-align: center;
          margin-bottom: 25px;
          color: #333;
        }

        .login-tabs {
          display: flex;
          margin-bottom: 25px;
          border-bottom: 1px solid #ddd;
        }

        .tab-button {
          flex: 1;
          padding: 12px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          font-size: 14px;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tab-button.active {
          color: #4caf50;
          border-bottom-color: #4caf50;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #555;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .form-group input:focus {
          border-color: #4caf50;
          outline: none;
        }

        .form-group input.error {
          border-color: #f44336;
        }

        .error-message {
          color: #f44336;
          font-size: 14px;
          margin-top: 5px;
          display: block;
        }

        .forgot-password {
          text-align: right;
          margin-bottom: 20px;
        }

        .forgot-password button {
          background: none;
          border: none;
          color: #4caf50;
          font-size: 14px;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .login-button:hover {
          background-color: #388e3c;
        }

        .login-button:disabled {
          background-color: #9e9e9e;
          cursor: not-allowed;
        }

        .register-link {
          text-align: center;
          margin-top: 20px;
          font-size: 16px;
        }

        .register-link a {
          color: #4caf50;
          text-decoration: none;
          font-weight: 500;
        }

        .register-link a:hover {
          text-decoration: underline;
        }

        .otp-verification {
          text-align: center;
          padding: 10px 0;
        }

        .otp-verification h3 {
          margin-bottom: 15px;
          color: #333;
        }

        .otp-verification p {
          margin-bottom: 20px;
          color: #666;
        }

        .resend-otp {
          margin-top: 15px;
          font-size: 14px;
        }

        .resend-otp button {
          background: none;
          border: none;
          color: #4caf50;
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          font-size: 14px;
        }

        .resend-otp button:hover {
          color: #388e3c;
        }

        .resend-otp button:disabled {
          color: #9e9e9e;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .login-form-container {
            padding: 20px;
          }

          .login-tabs {
            flex-direction: column;
            border-bottom: none;
          }

          .tab-button {
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 8px;
          }

          .tab-button.active {
            background-color: #f0f8f0;
            border-color: #4caf50;
          }
        }
      `}</style>
    </div>
  )
}

export default Login
