import React from 'react';
// import '../styles/Footer.css';
import logo from '../assets/img/logo2.png';
import '../styles/main.css';

function Footer() {
  return (
    <footer>
      <div className="container footer-content">
        <div className="footer-main">
          <div className="footer-section branding">
            <div style={{ marginLeft: '18%' }}>
              <img src={logo} alt="Ann Daan Logo" className="footer-logo" />
              <h3>Ann Daan</h3>
            </div>
            <p>Fighting hunger, reducing waste, building community.</p>
          </div>

          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#food-donors">Food Donors</a></li>
              <li><a href="#volunteers">Volunteers</a></li>
              <li><a href="#charities">Charities</a></li>
              <li><a href="#our-team">Our Team</a></li>
              <li><a href="#faqs">FAQs</a></li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3>Contact Us</h3>
            <address>
              <p><i className="fa-solid fa-location-dot"></i> IIITL, Chakganjaraia,<br />C.G. City Lucknow, 226002</p>
              <p><i className="fa-solid fa-phone"></i> +91123467899</p>
              <p><i className=""></i> <a href="mailto:annadaan@gmail.com">annadaan@gmail.com</a></p>
            </address>
          </div>

          <div className="footer-section newsletter">
            <h3>Join Our Newsletter</h3>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" required />
              <button type="submit" className="btn-subscribe">Subscribe</button>
            </form>
            <div className="social-media">
              {/* Social media icons can be added here */}
            </div>
          </div>
        </div>
      </div>

      <div className="donate-banner">
        <p>Help us make a difference today</p>
        <a href="#donate" className="btn-donate">DONATE NOW</a>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2024 Ann Daan. All rights reserved.</p>
          <ul className="footer-policies">
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;