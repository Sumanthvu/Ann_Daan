import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Make sure to import Link

const RestaurantRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactNumber: '',
    email: '',
    description: '',
    cuisineType: '',
    openingHours: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username || formData.username.length < 4) newErrors.username = 'Username must be at least 4 characters';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.name) newErrors.name = 'Restaurant name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
    if (!formData.contactNumber || !/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = 'Contact number must be 10 digits';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:8080/api/restaurants/register', formData);
      alert('Registration successful! Please login to continue.');
      navigate('/login');
    } catch (error) {
      let errorMsg = 'Registration failed. Please try again.';
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'object' && error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (typeof error.response.data === 'object' && Object.keys(error.response.data).length > 0) {
          setErrors(prevErrors => ({ ...prevErrors, ...error.response.data }));
          errorMsg = "Please check the errors in the form.";
        } else if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        }
      }
      setErrors(prevErrors => ({ ...prevErrors, general: errorMsg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-container">
        <div className="form-card">
          <div className="form-header">
            {/* If you have a logo, you can place it here */}
            {/* <img src="/src/assets/img/Logo.png" alt="Logo" className="logo" /> */}
            <h1>Restaurant Registration</h1>
            <p>Join our platform and start serving your delicious food!</p>
          </div>

          {errors.general && (
            <div className="error-message general-error">
              <strong>Error:</strong> {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Account Information</h2>
              <div className="grid-container">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input id="username" name="username" type="text" value={formData.username} onChange={handleChange} className={errors.username ? 'input-error' : ''} />
                  {errors.username && <p className="error-text">{errors.username}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className={errors.password ? 'input-error' : ''} />
                  {errors.password && <p className="error-text">{errors.password}</p>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Restaurant Information</h2>
              <div className="grid-container">
                <div className="form-group full-width">
                  <label htmlFor="name">Restaurant Name</label>
                  <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className={errors.name ? 'input-error' : ''} />
                  {errors.name && <p className="error-text">{errors.name}</p>}
                </div>
                <div className="form-group full-width">
                  <label htmlFor="address">Address</label>
                  <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} className={errors.address ? 'input-error' : ''} />
                  {errors.address && <p className="error-text">{errors.address}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input id="city" name="city" type="text" value={formData.city} onChange={handleChange} className={errors.city ? 'input-error' : ''} />
                  {errors.city && <p className="error-text">{errors.city}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input id="state" name="state" type="text" value={formData.state} onChange={handleChange} className={errors.state ? 'input-error' : ''} />
                  {errors.state && <p className="error-text">{errors.state}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="pincode">Pincode</label>
                  <input id="pincode" name="pincode" type="text" value={formData.pincode} onChange={handleChange} className={errors.pincode ? 'input-error' : ''} />
                  {errors.pincode && <p className="error-text">{errors.pincode}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="contactNumber">Contact Number</label>
                  <input id="contactNumber" name="contactNumber" type="tel" value={formData.contactNumber} onChange={handleChange} className={errors.contactNumber ? 'input-error' : ''} />
                  {errors.contactNumber && <p className="error-text">{errors.contactNumber}</p>}
                </div>
                <div className="form-group full-width">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={errors.email ? 'input-error' : ''} />
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Additional Information <span>(Optional)</span></h2>
              <div className="grid-container">
                <div className="form-group full-width">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="cuisineType">Cuisine Type</label>
                  <input id="cuisineType" name="cuisineType" type="text" placeholder="e.g., Italian, Indian" value={formData.cuisineType} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="openingHours">Opening Hours</label>
                  <input id="openingHours" name="openingHours" type="text" placeholder="e.g., Mon-Fri: 9AM-10PM" value={formData.openingHours} onChange={handleChange} />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <button type="submit" disabled={isSubmitting} className="submit-button">
                {isSubmitting ? 'Registering...' : 'Register Restaurant'}
              </button>
            </div>
            
            <div className="form-footer">
              Already have an account? <Link to="/login">Login here</Link>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fff1e6 0%, #ffe0c2 100%); /* Warm gradient background */
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .form-card {
          background-color: #ffffff;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 700px; /* Adjusted for registration form */
          margin: 20px 0;
        }
        .form-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .form-header .logo {
          width: 80px; /* Adjust as needed */
          height: auto;
          margin-bottom: 15px;
        }
        .form-header h1 {
          font-size: 28px;
          color: #D9534F; /* Primary warm color (e.g., a terracotta red/orange) */
          margin-bottom: 8px;
          font-weight: 600;
        }
        .form-header p {
          font-size: 16px;
          color: #555;
        }
        .form-section {
          margin-bottom: 30px;
        }
        .form-section h2 {
          font-size: 20px;
          color: #333;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        .form-section h2 span {
          font-size: 0.8em;
          font-weight: normal;
          color: #777;
        }
        .grid-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 600px) {
          .grid-container {
            grid-template-columns: 1fr 1fr;
          }
        }
        .form-group {
          margin-bottom: 5px; /* Reduced margin as gap handles spacing */
        }
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        .form-group label {
          display: block;
          font-size: 14px;
          color: #444;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .form-group input[type="text"],
        .form-group input[type="password"],
        .form-group input[type="email"],
        .form-group input[type="tel"],
        .form-group textarea {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-sizing: border-box;
          font-size: 15px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #D9534F; /* Primary warm color */
          box-shadow: 0 0 0 3px rgba(217, 83, 79, 0.15);
        }
        .form-group input.input-error,
        .form-group textarea.input-error {
          border-color: #c9302c; /* Error color */
        }
        .error-text {
          color: #c9302c; /* Error color */
          font-size: 13px;
          margin-top: 5px;
        }
        .error-message.general-error {
          background-color: #f2dede;
          color: #a94442;
          padding: 15px;
          border: 1px solid #ebccd1;
          border-radius: 8px;
          margin-bottom: 25px;
          text-align: center;
        }
        .submit-button {
          width: 100%;
          padding: 14px 15px;
          background-color: #D9534F; /* Primary warm color */
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .submit-button:hover {
          background-color: #C9302C; /* Darker shade for hover */
        }
        .submit-button:disabled {
          background-color: #f0adad;
          cursor: not-allowed;
        }
        .form-footer {
          text-align: center;
          margin-top: 25px;
          font-size: 15px;
          color: #555;
        }
        .form-footer a {
          color: #D9534F; /* Primary warm color */
          text-decoration: none;
          font-weight: 500;
        }
        .form-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
};

export default RestaurantRegistration;