import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for completeness
import axios from 'axios';

// Hardcoded restaurant users for demo purposes
const DEMO_USERS = [
  {
    name: "Tasty Bites",
    email: "tasty@bites.com",
    username: "tasty@bites.com", // Using email as username
    password: "tasty123",
    role: "ROLE_RESTAURANT" // Ensure this role matches your condition
  },
  {
    name: "Spicy Treat",
    email: "spicy@treat.com",
    username: "spicy@treat.com", // Using email as username
    password: "spicy123",
    role: "ROLE_RESTAURANT" // Ensure this role matches your condition
  }
];

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', // This will hold the email input
    password: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true); // Set loading to true at the beginning
    
    // Check if the credentials match any of our hardcoded demo users
    const demoUser = DEMO_USERS.find(
      user => user.username === formData.username && user.password === formData.password
    );
    
    if (demoUser) {
      console.log("Demo user found:", demoUser);
      // For demo users, simulate a successful login
      localStorage.setItem('token', 'demo-token-for-hardcoded-user'); // Use a distinct demo token
      localStorage.setItem('user', JSON.stringify({
        username: demoUser.username, // This is the email
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role 
      }));
      
      setSuccessMessage('Login successful! Redirecting to dashboard...');
      
      // Redirect after a short delay to show the success message
      // No need to check role here if all demo users are restaurants for this specific redirection path
      setTimeout(() => {
        console.log("Navigating to /restaurant/dashboard for demo user.");
        navigate('/restaurant/dashboard');
        setIsLoading(false); // Reset loading after navigation is initiated
      }, 1000); // Increased delay to 1 second
    } else {
      console.log("Demo user not found, attempting API login.");
      // For non-demo users, proceed with the normal backend authentication
      try {
        const response = await axios.post('http://localhost:8080/api/auth/login', formData);
        console.log("API Login Response:", response.data);
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          username: response.data.username, // Assuming backend returns username
          role: response.data.role
        }));
        
        setSuccessMessage('Login successful! Redirecting...');
        
        // Redirect based on role
        if (response.data.role === 'ROLE_RESTAURANT') {
          console.log("API user role is ROLE_RESTAURANT. Navigating to dashboard.");
          setTimeout(() => {
            navigate('/restaurant/dashboard');
            setIsLoading(false); // Reset loading after navigation
          }, 1000); // Increased delay
        } else {
          console.log(`API user role is ${response.data.role}. Navigating to /. `);
          setTimeout(() => {
            navigate('/');
            setIsLoading(false); // Reset loading after navigation
          }, 1000); // Increased delay
        }
      } catch (err) { 
        console.error("API Login Error:", err.response || err);
        if (err.response && err.response.data) {
          setError(err.response.data.message || 'Invalid username or password');
        } else {
          setError('Login failed. Please try again.');
        }
        setIsLoading(false); // Reset loading on error
      }
    }
  };

  return (
    <> {/* Added Fragment because <style jsx> needs a single root from the component's render */}
      <div className="login-page">
        <div className="login-container">
          <div className="login-content">
            <div className="login-left">
              <div className="login-header">
                <img src="/src/assets/img/Logo.png" alt="Ann Daan Logo" className="login-logo" />
                <h1>Welcome Back</h1>
                <p>Sign in to your restaurant account to manage your food donations and make a difference.</p>
              </div>
              
              {error && (
                <div className="error-message">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="message-icon">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              
              {successMessage && (
                <div className="success-message">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="message-icon">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>{successMessage}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="username">Email</label> {/* Changed label to Email */}
                  <div className="input-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <input
                      type="text" // Changed to text, can be email but text is fine for username field
                      id="username"
                      name="username" // This matches formData.username which expects email for demo users
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-options">
                  <div className="remember-me">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>
                
                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
              
              <div className="login-footer">
                <p>Don't have an account? <Link to="/restaurant-registration">Register your restaurant</Link></p>
                <Link to="/" className="back-home">Back to Home</Link>
              </div>
            </div>
            
            <div className="login-right">
              <div className="login-image">
                <img src="/src/api/i3.jpeg" alt="Restaurant Food Donation" />
                <div className="image-overlay">
                  <h2>Join Our Mission</h2>
                  <p>Help us reduce food waste and fight hunger in our communities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* Styles from your provided login.jsx */
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa; /* Original background */
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .login-container {
          width: 100%;
          max-width: 1100px; /* Adjusted from 1200px for better fit */
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .login-content {
          display: flex;
          flex-direction: row;
        }
        
        .login-left {
          flex: 1.1; /* Give form side a bit more relative space */
          padding: 35px 45px; /* Slightly adjusted padding */
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .login-right {
          flex: 0.9; /* Image side */
          display: none; /* Hidden on small screens */
        }
        
        @media (min-width: 900px) { /* Adjusted breakpoint for showing right panel */
          .login-right {
            display: flex; /* Use flex for alignment of its child */
            align-items: center;
            justify-content: center;
          }
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 25px; /* Adjusted margin */
        }
        
        .login-logo {
          width: 70px; /* Adjusted size */
          height: auto; /* Maintain aspect ratio */
          margin-bottom: 15px;
        }
        
        .login-header h1 {
          font-size: 26px; /* Adjusted size */
          color: #333;
          margin-bottom: 8px;
          font-weight: 600;
        }
        
        .login-header p {
          color: #555; /* Darker gray for better readability */
          font-size: 15px;
          line-height: 1.5;
        }
        
        .error-message, .success-message {
          display: flex;
          align-items: center;
          padding: 10px 12px; /* Uniform padding */
          border-radius: 6px;
          margin-bottom: 18px; /* Uniform margin */
          font-size: 14px;
        }
        
        .error-message {
          background-color: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca; /* Softer border */
        }
        
        .success-message {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0; /* Softer border */
        }
        
        .message-icon { /* Common class for icons in messages */
          margin-right: 8px;
          flex-shrink: 0;
        }
        
        .login-form {
          margin-bottom: 25px; /* Adjusted margin */
        }
        
        .form-group {
          margin-bottom: 18px; /* Adjusted margin */
        }
        
        .form-group label {
          display: block;
          margin-bottom: 6px; /* Adjusted margin */
          font-weight: 500;
          color: #333;
          font-size: 14px;
        }
        
        .input-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid #ccc; /* Slightly darker default border */
          border-radius: 6px;
          padding-left: 12px; /* Space for icon */
          background: white;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .input-wrapper:focus-within {
          border-color: #4f46e5; /* Original focus color */
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15); /* Enhanced focus ring */
        }
        
        .input-icon {
          color: #777; /* Slightly darker icon color */
          margin-right: 10px;
        }
        
        .input-wrapper input {
          flex: 1;
          border: none;
          padding: 11px 12px 11px 0; /* Adjusted padding for better vertical centering */
          font-size: 15px;
          outline: none;
          background: transparent;
        }

        .input-wrapper input::placeholder {
          color: #999; /* Lighter placeholder */
        }
        
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          font-size: 13px; /* Adjusted size */
        }
        
        .remember-me {
          display: flex;
          align-items: center;
          color: #444; /* Darker text */
        }
        
        .remember-me input {
          margin-right: 7px; /* Adjusted spacing */
          width: 15px;
          height: 15px;
          accent-color: #4f46e5; /* Color the checkbox */
        }
        .remember-me label { /* Ensure label specific styles */
            font-weight: normal;
            margin-bottom: 0;
        }
        
        .forgot-password {
          color: #4f46e5;
          text-decoration: none;
        }
        
        .forgot-password:hover {
          text-decoration: underline;
        }
        
        .login-button {
          width: 100%;
          padding: 12px 14px; /* Adjusted padding */
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .login-button:hover {
          background-color: #4338ca;
        }
        
        .login-button:disabled {
          background-color: #c7c2f5; /* Lighter purple for disabled */
          cursor: not-allowed;
        }
        
        .loading-spinner {
          width: 18px; /* Adjusted size */
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.4); /* Slightly more visible border */
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite; /* Slightly faster */
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .login-footer {
          text-align: center;
          color: #555;
          font-size: 14px;
          margin-top: 20px; /* Added for spacing */
        }

        .login-footer p {
            margin-bottom: 8px; /* Space between p and a tag if on new lines */
        }
        
        .login-footer a {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 500;
        }
        
        .login-footer a:hover {
          text-decoration: underline;
        }
        
        .back-home { /* Ensures it's treated as a block if needed for spacing */
          display: inline-block; 
          margin-top: 8px;
        }
        
        .login-image { /* Container for the image itself */
          height: 100%;
          width: 100%; /* Make sure it fills login-right */
          position: relative; /* For overlay */
          overflow: hidden; /* If login-right has rounded corners */
        }
        
        .login-image img {
          width: 100%;
          height: 100%;
          object-fit: cover; /* Ensures image covers the area well */
        }
        
        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 25%, transparent); /* Slightly stronger gradient */
          color: white;
          padding: 25px 30px; /* Adjusted padding */
        }
        
        .image-overlay h2 {
          font-size: 22px; /* Adjusted size */
          margin-bottom: 8px;
          font-weight: 600;
        }
        .image-overlay p {
            font-size: 15px;
            line-height: 1.5;
        }
      `}</style>
    </>
  );
};

export default Login;