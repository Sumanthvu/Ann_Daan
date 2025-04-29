import React from 'react';
// import '../styles/HowItWorks.css';
import donateImg from '../assets/img/Donate.png';
import secureImg from '../assets/img/Secure.png';
import pickupImg from '../assets/img/pick.png';
import '../styles/main.css';

function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <h2>How It Works</h2>
        <div style={{ margin: '50px', gap: '55px' }} className="how-it-works">
          <div className="step slide-in-left">
            <img style={{ height: '300px', width: '300px' }} src={donateImg} alt="Donate Food" />
            <h3>Food is Donated</h3>
            <p>
              Generous donations of surplus and fresh food from local businesses, farmers, and 
              community members.
            </p>
          </div>
          <div className="step fade-in">
            <img style={{ height: '300px', width: '300px' }} src={secureImg} alt="Secure Food" />
            <h3>Food is Secured</h3>
            <p>
              Food is secured through our network of generous donors and partners, ensuring it 
              reaches those in need.
            </p>
          </div>
          <div className="step slide-in-right">
            <img style={{ height: '300px', width: '300px' }} src={pickupImg} alt="Pick Up Food" />
            <h3>Food is Picked Up</h3>
            <p>
              Our team ensures that every donation is picked up promptly and delivered safely to 
              those who need it most.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;