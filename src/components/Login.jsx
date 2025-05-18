import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.data.username,
        role: response.data.role
      }));
      
      if (response.data.role === 'ROLE_RESTAURANT') {
        navigate('/restaurant/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Invalid username or password');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <div className="login-content">
            <div className="login-left">
              <div className="login-header">
                <img src="/src/assets/img/Logo.png" alt="Ann Daan Logo" className="login-logo" />
                <h1>Welcome Back</h1>
                <p>Sign in to manage your food donations.</p>
              </div>
              
              {error && (
                <div className="error-message">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <div className="input-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
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
                  <a href="#" className="forgot-password-link">Forgot password?</a>
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
                <Link to="/" className="back-home-link">Back to Home</Link>
              </div>
            </div>
            
            <div className="login-right">
              <div className="login-image-container">
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
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fff1e6 0%, #ffe0c2 100%);
          padding: 20px; /* Keeps card from touching edges on small viewports */
          box-sizing: border-box; /* Ensures padding is included in height/width */
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .login-container {
          width: 100%;
          max-width: 1000px; /* Slightly reduced max-width */
          background: white;
          border-radius: 12px; /* Slightly less rounded */
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: flex; /* Make login-container a flex container itself */
        }
        
        .login-content { /* This div might be redundant if login-container is already flex */
          display: flex;
          width: 100%; /* Ensure it takes full width of login-container */
          height: 100%;
        }
        
        .login-left {
          flex: 1.1; /* Adjusted flex ratio slightly */
          padding: 25px 35px; /* Reduced padding */
          display: flex;
          flex-direction: column;
          justify-content: center; /* Keeps content centered if column is tall */
        }
        
        .login-right {
          flex: 0.9; /* Adjusted flex ratio slightly */
          display: none; 
        }
        
        @media (min-width: 860px) { /* Adjusted breakpoint */
          .login-right {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 20px; /* Reduced margin */
        }
        
        .login-logo {
          width: 60px; /* Reduced size */
          height: auto;
          margin-bottom: 10px; /* Reduced margin */
        }
        
        .login-header h1 {
          font-size: 22px; /* Reduced size */
          color: #D9534F; 
          margin-bottom: 6px; /* Reduced margin */
          font-weight: 600;
        }
        
        .login-header p {
          color: #555;
          font-size: 14px; /* Reduced size */
          line-height: 1.4;
        }
        
        .error-message {
          display: flex;
          align-items: center;
          background-color: #f2dede;
          color: #a94442;
          padding: 10px 12px; /* Reduced padding */
          border-radius: 6px; /* Slightly less rounded */
          margin-bottom: 15px; /* Reduced margin */
          font-size: 13px; /* Reduced size */
        }
        
        .error-icon {
          margin-right: 8px; /* Reduced margin */
          flex-shrink: 0;
        }
        
        .login-form {
          margin-bottom: 15px; /* Reduced margin */
        }
        
        .form-group {
          margin-bottom: 12px; /* Reduced margin */
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px; /* Reduced margin */
          font-weight: 500;
          color: #444;
          font-size: 13px; /* Reduced size */
        }
        
        .input-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding-left: 12px; 
          background: white;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .input-wrapper:focus-within {
          border-color: #D9534F;
          box-shadow: 0 0 0 2px rgba(217, 83, 79, 0.1); /* Softer shadow */
        }
        
        .input-icon {
          color: #888;
          margin-right: 8px;
        }
        
        .input-wrapper input {
          flex: 1;
          border: none;
          padding: 10px 12px 10px 0; /* Reduced padding */
          font-size: 14px; /* Reduced size */
          outline: none;
          background: transparent;
        }
         .input-wrapper input::placeholder {
            color: #aaa;
        }
        
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px; /* Reduced margin */
          font-size: 12px; /* Reduced size */
        }
        
        .remember-me {
          display: flex;
          align-items: center;
          color: #555;
        }
        
        .remember-me input {
          margin-right: 6px;
          width: 14px;
          height: 14px;
        }
         .remember-me label {
          font-weight: normal;
          margin-bottom: 0;
        }
        
        .forgot-password-link {
          color: #D9534F;
          text-decoration: none;
        }
        
        .forgot-password-link:hover {
          text-decoration: underline;
        }
        
        .login-button {
          width: 100%;
          padding: 12px; /* Reduced padding */
          background-color: #D9534F;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 15px; /* Reduced size */
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .login-button:hover {
          background-color: #C9302C;
        }
        
        .login-button:disabled {
          background-color: #f0adad;
          cursor: not-allowed;
        }
        
        .loading-spinner {
          width: 18px; /* Reduced size */
          height: 18px; /* Reduced size */
          border: 2px solid rgba(255, 255, 255, 0.3); /* Thinner border */
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite; /* Faster spin */
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .login-footer {
          text-align: center;
          color: #555;
          font-size: 13px; /* Reduced size */
          margin-top: 15px; /* Added margin for separation */
        }
        
        .login-footer p {
          margin-bottom: 8px; /* Space between lines */
        }
        
        .login-footer a {
          color: #D9534F;
          text-decoration: none;
          font-weight: 500;
        }
        
        .login-footer a:hover {
          text-decoration: underline;
        }
        
        /* .back-home-link styling is implicitly covered by .login-footer a */
        
        .login-image-container {
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .login-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 15%, transparent 100%);
          color: white;
          padding: 25px 30px; /* Reduced padding */
        }
        
        .image-overlay h2 {
          font-size: 20px; /* Reduced size */
          margin-bottom: 8px; /* Reduced margin */
          font-weight: 600;
        }
        .image-overlay p {
          font-size: 14px; /* Reduced size */
          line-height: 1.5;
        }
      `}</style>
    </>
  );
};

export default Login;