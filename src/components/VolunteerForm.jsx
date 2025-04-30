import React from 'react';
import '../styles/VolunteerForm.css';

const VolunteerForm = () => {
  return (
    <div className="holder">
      <h1>Volunteer Registration</h1>
      <img
        src="https://foundersguide.com/wp-content/uploads/2019/09/delivery.jpg"
        alt="Volunteering"
        className="volunteer-img"
      />
      <p>Join us to help fight hunger in the society!</p>
      <form>
        <label htmlFor="first-name">First Name</label>
        <input type="text" id="first-name" name="first-name" placeholder="Enter Your First Name" />

        <label htmlFor="last-name">Last Name</label>
        <input type="text" id="last-name" name="last-name" placeholder="Enter Your Last Name" />

        <label htmlFor="dob">Date Of Birth</label>
        <input type="date" id="dob" name="dob" />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Enter Your Email" />

        <label htmlFor="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone" placeholder="Contact Number" />

        <label htmlFor="availability">Availability:</label>
        <select id="availability" name="availability">
          <option value="">Select...</option>
          <option value="weekdays">Weekdays</option>
          <option value="weekends">Weekends</option>
          <option value="anytime">Anytime</option>
        </select>

        <label htmlFor="working-hours">Working Hours:</label>
        <select id="working-hours" name="working-hours">
          <option value="">Select...</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="6">6</option>
          <option value="8">8</option>
          <option value="10">10</option>
        </select>

        <label htmlFor="password">Create A Password</label>
        <input type="password" id="password" name="password" placeholder="Enter Your Password" />

        <label htmlFor="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password" />

        <button type="submit">Register Now</button>
      </form>
    </div>
  );
};

export default VolunteerForm;
