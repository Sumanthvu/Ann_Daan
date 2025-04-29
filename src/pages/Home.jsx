import React from 'react';
import Header from '../components/Header';
import Slider from '../components/Slider';
import Mission from '../components/Mission';
import Testimonials from '../components/Testimonials';
import Contribute from '../components/Contribute';
import HowItWorks from '../components/HowItWords';
import AboutUs from '../components/AboutUs';
import Footer from '../components/Footer';
import '../styles/main.css';

function Homepage() {
  return (
    <div className="App">
      <Header />
      <Slider />
      <div id="one" style={{ marginTop: '25%' }}>
        <h1>Welcome to Ann Daan</h1>
      </div>
      <Mission />
      <Testimonials />
      <Contribute />
      <HowItWorks />
      <AboutUs />
      <Footer />
    </div>
  );
}

export default Homepage;