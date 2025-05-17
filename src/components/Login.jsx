import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.data.username,
        role: response.data.role
      }));
      
      // Redirect based on role
      if (response.data.role === 'ROLE_RESTAURANT') {
        navigate('/restaurant/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Invalid username or password');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <p>Don't have an account? <a href="/restaurant-registration">Register your restaurant</a></p>
              <a href="/" className="back-home">Back to Home</a>
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
      
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          padding: 20px;
        }
        
        .login-container {
          width: 100%;
          max-width: 1200px;
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
          flex: 1;
          padding: 40px;
        }
        
        .login-right {
          flex: 1;
          display: none;
        }
        
        @media (min-width: 768px) {
          .login-right {
            display: block;
          }
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .login-logo {
          width: 80px;
          height: 80px;
          margin-bottom: 20px;
        }
        
        .login-header h1 {
          font-size: 28px;
          color: #333;
          margin-bottom: 10px;
        }
        
        .login-header p {
          color: #666;
          font-size: 16px;
        }
        
        .error-message {
          display: flex;
          align-items: center;
          background-color: #fee2e2;
          color: #b91c1c;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        
        .error-message svg {
          margin-right: 10px;
          flex-shrink: 0;
        }
        
        .login-form {
          margin-bottom: 30px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }
        
        .input-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 0 15px;
          background: white;
          transition: border-color 0.3s;
        }
        
        .input-wrapper:focus-within {
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }
        
        .input-wrapper svg {
          color: #6b7280;
          margin-right: 10px;
        }
        
        .input-wrapper input {
          flex: 1;
          border: none;
          padding: 12px 0;
          font-size: 16px;
          outline: none;
          background: transparent;
        }
        
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          font-size: 14px;
        }
        
        .remember-me {
          display: flex;
          align-items: center;
        }
        
        .remember-me input {
          margin-right: 8px;
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
          padding: 14px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .login-button:hover {
          background-color: #4338ca;
        }
        
        .login-button:disabled {
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
        
        .login-footer {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        
        .login-footer a {
          color: #4f46e5;
          text-decoration: none;
        }
        
        .login-footer a:hover {
          text-decoration: underline;
        }
        
        .back-home {
          display: inline-block;
          margin-top: 10px;
        }
        
        .login-image {
          height: 100%;
          position: relative;
        }
        
        .login-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          color: white;
          padding: 30px;
        }
        
        .image-overlay h2 {
          font-size: 24px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default Login;