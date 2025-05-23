"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [identifier, setIdentifier] = useState(null)

  useEffect(() => {
    // Check if user came from the forgot password flow
    if (location.state?.verified) {
      setVerified(true)
      if (location.state?.email) {
        setIdentifier({ type: "email", value: location.state.email })
      } else if (location.state?.phone) {
        setIdentifier({ type: "phone", value: location.state.phone })
      } else {
        // If no identifier is found, redirect to login
        navigate("/login")
      }
    } else {
      // If not verified, redirect to login
      navigate("/login")
    }
  }, [location, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        setLoading(true)

        // Reset password
        const payload = {
          password: formData.password,
          ...(identifier.type === "email" ? { email: identifier.value } : { phone: identifier.value }),
        }

        const response = await axios.post("http://localhost:8080/api/auth/reset-password", payload)

        if (response.data.success) {
          alert("Password reset successfully!")
          navigate("/login")
        } else {
          alert("Failed to reset password. Please try again.")
        }
      } catch (error) {
        console.error("Error resetting password:", error)
        alert("Error resetting password. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
  }

  if (!verified || !identifier) {
    return <div className="loading">Redirecting...</div>
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-form-container">
        <h2>Reset Password</h2>
        <p>Please enter your new password below.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="Enter new password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="reset-button" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="login-link">
          Remember your password? <a href="/login">Login</a>
        </div>
      </div>
      <style jsx>{`
        .reset-password-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background-color: #f5f5f5;
        }

        .reset-password-form-container {
          width: 100%;
          max-width: 450px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }

        .reset-password-form-container h2 {
          text-align: center;
          margin-bottom: 15px;
          color: #333;
        }

        .reset-password-form-container p {
          text-align: center;
          margin-bottom: 25px;
          color: #666;
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

        .reset-button {
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

        .reset-button:hover {
          background-color: #388e3c;
        }

        .reset-button:disabled {
          background-color: #9e9e9e;
          cursor: not-allowed;
        }

        .login-link {
          text-align: center;
          margin-top: 20px;
          font-size: 16px;
        }

        .login-link a {
          color: #4caf50;
          text-decoration: none;
          font-weight: 500;
        }

        .login-link a:hover {
          text-decoration: underline;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-size: 18px;
          color: #666;
        }

        @media (max-width: 480px) {
          .reset-password-form-container {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  )
}

export default ResetPassword
