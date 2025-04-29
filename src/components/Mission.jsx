import React from 'react';
// import '../styles/Mission.css';
import '../styles/main.css';

function Mission() {
  return (
    <section id="mission" className="section">
      <div className="container">
        <h2>Our Mission</h2>
        <div className="mission-content">
          <div className="mission-text" id="min">
            <p>
              At Ann Daan, we believe that no one should go hungry while good food goes to waste. 
              Our mission is to create a sustainable and efficient food donation ecosystem that 
              connects surplus food with those in need, fostering a sense of community and social 
              responsibility.
            </p>
          </div>

          <div className="mission-stats">
            <div className="stat-item">
              <i className="fas fa-utensils"></i>
              <span className="number">1M+</span>
              <span className="label">Meals Served</span>
            </div>
            <div className="stat-item">
              <i className="fas fa-users"></i>
              <span className="number">50K+</span>
              <span className="label">Lives Impacted</span>
            </div>
            <div className="stat-item">
              <i className="fas fa-map-marker-alt"></i>
              <span className="number">69+</span>
              <span className="label">Cities Covered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Mission;