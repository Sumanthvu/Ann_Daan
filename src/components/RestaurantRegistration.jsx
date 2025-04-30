import React, { useState } from 'react';
import '../styles/styles.css';

function RestaurantRegistration() {
  const [formData, setFormData] = useState({
    restaurantName: '',
    address: '',
    email: '',
    phoneNumber: '',
    ownerName: '',
    workingHoursFrom: '',
    workingHoursTo: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', formData);
    alert('Registration successful!');
  };

  return (
    <div className="app-container">
      <header>
        <div className="container">
          <h1>Save and Serve Leftover Food</h1>
          <p>Your efforts can bring hope to many. Let's make a difference together!</p>
        </div>
      </header>

      <main>
        <div className="container">
          <section className="form-section">
            <div className="form-wrapper">
              <h2>Registration Form</h2>
              <form id="registrationForm" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="restaurantName">Restaurant Name:</label>
                  <input 
                    type="text" 
                    placeholder="Hotel Name" 
                    id="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address:</label>
                  <input 
                    type="text" 
                    placeholder="Address" 
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input 
                    type="email" 
                    placeholder="Enter Email" 
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">Mobile Number:</label>
                  <input 
                    type="tel" 
                    id="phoneNumber" 
                    placeholder="Enter Mobile Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ownerName">Owner Name:</label>
                  <input 
                    type="text" 
                    id="ownerName" 
                    placeholder="Owner's name"
                    value={formData.ownerName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="workingHoursFrom">Working Hours - From:</label>
                  <input 
                    type="time" 
                    id="workingHoursFrom"
                    value={formData.workingHoursFrom}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="workingHoursTo">To:</label>
                  <input 
                    type="time" 
                    id="workingHoursTo"
                    value={formData.workingHoursTo}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Create a password:</label>
                  <input 
                    type="password" 
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm password:</label>
                  <input 
                    type="password" 
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <button type="submit" className="submit-btn">Register Now</button>
              </form>
            </div>
            
            <div className="slogans">
              <h3>"Reviving Leftovers, Reviving Lives!"</h3>
              <img src="projectimg1.jpg" alt="End Food Waste!" style={{ maxWidth: '100%', height: 'auto' }} />
              <h3>"Together, we can make a change!"</h3>
            </div>
          </section>
        </div>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2024 Save and Serve Leftover Food | All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}

export default RestaurantRegistration;