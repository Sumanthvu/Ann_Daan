import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Hardcoded restaurant users for demo purposes
const DEMO_USERS = [
  {
    name: "Tasty Bites",
    email: "tasty@bites.com",
    password: "tasty123"
  },
  {
    name: "Spicy Treat",
    email: "spicy@treat.com",
    password: "spicy123"
  }
];

const RestaurantRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactNumber: '',
    description: '',
    cuisineType: '',
    openingHours: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.name.trim()) newErrors.name = 'Restaurant name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    // Check if the registration matches any of our hardcoded demo users
    const isDemoUser = DEMO_USERS.some(
      user => user.name === formData.name && 
              user.email === formData.email && 
              user.password === formData.password
    );
    
    if (isDemoUser) {
      // For demo users, simulate a successful registration
      setSuccessMessage('Registration successful! You can now log in with your credentials.');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      // For non-demo users, proceed with the normal backend registration
      try {
        // Create user registration data
        const registrationData = {
          username: formData.email, // Using email as username
          email: formData.email,
          password: formData.password,
          role: ["restaurant"] // Specify role as restaurant
        };
        
        // Register user first
        const userResponse = await axios.post('http://localhost:8080/api/auth/signup', registrationData);
        
        if (userResponse.data) {
          // Then create restaurant profile
          const restaurantData = {
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            contactNumber: formData.contactNumber,
            email: formData.email,
            description: formData.description || '',
            cuisineType: formData.cuisineType || '',
            openingHours: formData.openingHours || '',
            userId: userResponse.data.id // Link to user account
          };
          
          await axios.post('http://localhost:8080/api/restaurants', restaurantData);
          
          setSuccessMessage('Registration successful! You can now log in with your credentials.');
          
          // Redirect to login page after a short delay
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Registration error:', error);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message || 'Registration failed. Please try again.');
        } else {
          setErrorMessage('Registration failed. Please try again later.');
        }
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-header">
          <img src="/src/assets/img/Logo.png" alt="Ann Daan Logo" className="registration-logo" />
          <h1>Restaurant Registration</h1>
          <p>Join our network of restaurants fighting food waste and hunger</p>
        </div>
        
        {errorMessage && (
          <div className="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="success-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{successMessage}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-section">
            <h2>Restaurant Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Restaurant Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password*</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password*</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number*</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={errors.contactNumber ? 'error' : ''}
                />
                {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="cuisineType">Cuisine Type</label>
                <input
                  type="text"
                  id="cuisineType"
                  name="cuisineType"
                  value={formData.cuisineType}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="openingHours">Opening Hours</label>
              <input
                type="text"
                id="openingHours"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                placeholder="e.g., Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
              />
            </div>
          </div>
          
          <div className="form-section">
            <h2>Address Information</h2>
            
            <div className="form-group full-width">
              <label htmlFor="address">Street Address*</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City*</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State*</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={errors.state ? 'error' : ''}
                />
                {errors.state && <span className="error-text">{errors.state}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="pincode">Pincode*</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={errors.pincode ? 'error' : ''}
                />
                {errors.pincode && <span className="error-text">{errors.pincode}</span>}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Additional Information</h2>
            
            <div className="form-group full-width">
              <label htmlFor="description">Restaurant Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about your restaurant, the type of food you serve, and your commitment to reducing food waste..."
              ></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Register Restaurant'
              )}
            </button>
          </div>
          
          <div className="login-link">
            Already registered? <a href="/login">Login here</a>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        .registration-page {
          min-height: 100vh;
          background-color: #f8f9fa;
          padding: 40px 20px;
        }
        
        .registration-container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          padding: 40px;
        }
        
        .registration-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .registration-logo {
          width: 80px;
          height: 80px;
          margin-bottom: 20px;
        }
        
        .registration-header h1 {
          font-size: 28px;
          color: #333;
          margin-bottom: 10px;
        }
        
        .registration-header p {
          color: #666;
          font-size: 16px;
        }
        
        .error-message, .success-message {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        
        .error-message {
          background-color: #fee2e2;
          color: #b91c1c;
        }
        
        .success-message {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .error-message svg, .success-message svg {
          margin-right: 10px;
          flex-shrink: 0;
        }
        
        .registration-form {
          margin-top: 20px;
        }
        
        .form-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .form-section h2 {
          font-size: 20px;
          color: #333;
          margin-bottom: 20px;
        }
        
        .form-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .form-group {
          flex: 1;
          min-width: 250px;
        }
        
        .form-group.full-width {
          width: 100%;
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }
        
        .form-group input, .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        
        .form-group input:focus, .form-group textarea:focus {
          border-color: #4f46e5;
          outline: none;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }
        
        .form-group input.error, .form-group textarea.error {
          border-color: #ef4444;
        }
        
        .error-text {
          display: block;
          color: #ef4444;
          font-size: 14px;
          margin-top: 5px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
        }
        
        .cancel-button, .submit-button {
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .cancel-button {
          background-color: white;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }
        
        .cancel-button:hover {
          background-color: #f9fafb;
        }
        
        .submit-button {
          background-color: #4f46e5;
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 180px;
        }
        
        .submit-button:hover {
          background-color: #4338ca;
        }
        
        .submit-button:disabled {
          background-color: #a5a5a5;
          cursor: not-allowed;
        }
        
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .login-link {
          text-align: center;
          margin-top: 20px;
          color: #6b7280;
        }
        
        .login-link a {
          color: #4f46e5;
          text-decoration: none;
        }
        
        .login-link a:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 768px) {
          .registration-container {
            padding: 20px;
          }
          
          .form-row {
            flex-direction: column;
            gap: 15px;
          }
          
          .form-group {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default RestaurantRegistration;