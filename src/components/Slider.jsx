import React, { useState, useEffect } from 'react';
// import '../styles/Slider.css';
import img1 from '../assets/img/img1.jpg';
import img2 from '../assets/img/img2.jpg';
import img3 from '../assets/img/img3.jpg';
import img4 from '../assets/img/img4.jpg';
import '../styles/main.css';

function Slider() {
  const [slideIndex, setSlideIndex] = useState(1);

  useEffect(() => {
    showSlides(slideIndex);
  }, [slideIndex]);

  function plusSlides(n) {
    setSlideIndex(prevIndex => {
      let newIndex = prevIndex + n;
      if (newIndex > 4) {
        newIndex = 1;
      }
      if (newIndex < 1) {
        newIndex = 4;
      }
      return newIndex;
    });
  }

  function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    
    if (!slides.length) return;
    
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    
    slides[n - 1].style.display = "block";
  }

  return (
    <section className="slider-container">
      <div className="slider">
        <div className="mySlides fade">
          <div className="numbertext">1 / 4</div>
          <div className="img-container">
            <img src={img1} alt="Slide 1" />
          </div>
        </div>

        <div className="mySlides fade">
          <div className="numbertext">2 / 4</div>
          <div className="img-container">
            <img src={img2} alt="Slide 2" />
          </div>
        </div>

        <div className="mySlides fade">
          <div className="numbertext">3 / 4</div>
          <div className="img-container">
            <img src={img3} alt="Slide 3" />
          </div>
        </div>

        <div className="mySlides fade">
          <div className="numbertext">4 / 4</div>
          <div className="img-container">
            <img src={img4} alt="Slide 4" />
          </div>
        </div>

        <a className="prev" onClick={() => plusSlides(-1)}>❮</a>
        <a className="next" onClick={() => plusSlides(1)}>❯</a>
      </div>
    </section>
  );
}

export default Slider;