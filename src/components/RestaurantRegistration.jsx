"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const RestaurantRegistration = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    description: "",
  })

  const [errors, setErrors] = useState({})
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [enteredOtp, setEnteredOtp] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.restaurantName) newErrors.restaurantName = "Restaurant name is required"
    if (!formData.ownerName) newErrors.ownerName = "Owner name is required"

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.address) newErrors.address = "Address is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.pincode) newErrors.pincode = "Pincode is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const sendOtp = async () => {
    if (validateForm()) {
      try {
        setLoading(true)
        // Send OTP to the provided email
        const response = await axios.post("http://localhost:8080/api/auth/send-otp", {
          email: formData.email,
          phone: formData.phone,
        })

        if (response.data.success) {
          setOtpSent(true)
          setOtp(response.data.otp) // In a real app, the OTP would not be returned to the frontend
          alert("OTP sent to your email and phone. Please verify.")
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
      const response = await axios.post("http://localhost:8080/api/auth/verify-otp", {
        email: formData.email,
        otp: enteredOtp,
      })

      if (response.data.success) {
        // If OTP is verified, register the restaurant
        registerRestaurant()
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

  const registerRestaurant = async () => {
    try {
      setLoading(true)
      // Register the restaurant
      const response = await axios.post("http://localhost:8080/api/restaurants/register", formData)

      if (response.data.success) {
        alert("Restaurant registered successfully!")
        // Redirect to login page after successful registration
        navigate("/login")
      } else {
        alert("Failed to register restaurant. Please try again.")
      }
    } catch (error) {
      console.error("Error registering restaurant:", error)
      alert("Error registering restaurant. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!otpSent) {
      sendOtp()
    } else {
      verifyOtp()
    }
  }

  return (
    <div className="registration-container">
      <div className="registration-form-container">
        <h2>Restaurant Registration</h2>
        <form onSubmit={handleSubmit}>
          {!otpSent ? (
            <>
              <div className="form-group">
                <label>Restaurant Name</label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  className={errors.restaurantName ? "error" : ""}
                />
                {errors.restaurantName && <span className="error-message">{errors.restaurantName}</span>}
              </div>

              <div className="form-group">
                <label>Owner Name</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className={errors.ownerName ? "error" : ""}
                />
                {errors.ownerName && <span className="error-message">{errors.ownerName}</span>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? "error" : ""}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? "error" : ""}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? "error" : ""}
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>

                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={errors.pincode ? "error" : ""}
                  />
                  {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4"></textarea>
              </div>

              <button type="submit" className="register-button" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          ) : (
            <div className="otp-verification">
              <h3>OTP Verification</h3>
              <p>An OTP has been sent to your email and phone. Please enter it below to verify.</p>

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

              <button type="submit" className="register-button" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Register"}
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

        <div className="login-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
      <style jsx>{`
        .registration-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background-color: #f5f5f5;
        }

        .registration-form-container {
          width: 100%;
          max-width: 800px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }

        .registration-form-container h2 {
          text-align: center;
          margin-bottom: 30px;
          color: #333;
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

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #4caf50;
          outline: none;
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #f44336;
        }

        .error-message {
          color: #f44336;
          font-size: 14px;
          margin-top: 5px;
          display: block;
        }

        .form-row {
          display: flex;
          gap: 15px;
        }

        .form-row .form-group {
          flex: 1;
        }

        .register-button {
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

        .register-button:hover {
          background-color: #388e3c;
        }

        .register-button:disabled {
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

        .otp-verification {
          text-align: center;
          padding: 20px 0;
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

        @media (max-width: 768px) {
          .registration-form-container {
            padding: 20px;
          }

          .form-row {
            flex-direction: column;
            gap: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default RestaurantRegistration
