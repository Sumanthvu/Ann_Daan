import React from 'react';
// import '../styles/Header.css';
import logo from '../assets/img/Logo.png';
import '../styles/main.css';

function Header() {
  return (
    <header>
      <div className="header-content">
        <div className="logo">
          <img src={logo} alt="Ann Daan Logo" />
          <h1>Ann Daan</h1>
        </div>
        <nav>
          <ul>
            <li><a href="#one">Home</a></li>
            <li><a href="#contribute">Contribute</a></li>
            <li><a href="#get-help">Get Help</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about-us">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;