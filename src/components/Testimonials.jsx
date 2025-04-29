import React from 'react';
// import '../styles/Testimonials.css';
import '../styles/main.css';

function Testimonials() {
  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <h2>What People Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial fade-in">
            <p className="testimonial-content">
              "Ann Daan has made a huge difference in our community. Their dedication to fighting 
              hunger is inspiring."
            </p>
            <p className="testimonial-author">- Varun Shinde, Local Resident</p>
          </div>
          <div className="testimonial fade-in">
            <p className="testimonial-content">
              "As a restaurant owner, I'm grateful for the opportunity to donate our surplus food 
              and make a positive impact."
            </p>
            <p className="testimonial-author">- Virat Sharma, Restaurant Owner</p>
          </div>
          <div className="testimonial fade-in">
            <p className="testimonial-content">
              "The volunteers at Ann Daan are amazing. Their kindness and hard work truly make a 
              difference."
            </p>
            <p className="testimonial-author">- John Doe, Volunteer</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;