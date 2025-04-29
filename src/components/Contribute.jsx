import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css';

function Contribute() {
  return (
    <>
      <section className="contribute" id="contribute">
        <div className="container2">
          <h2 id="animationid">Contribute</h2>
          <div className="content-box">
            <img 
              src="https://www.harekrishnacharities.org/assets/img/blogs/2023/03/donate-food-for-student-education.jpeg" 
              id="imgid1" 
              alt="Donate food"
            />
          </div>
          <Link to="/donate-food" className="btn">Donate</Link>
        </div>
        <div className="container1">
          <h2 id="animationid">Get Help!</h2>
          <div className="content-box">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWBJQIfhNfNJZDohx5KynCBYw7EYq4meyaVw&s" 
              id="imgid1" 
              alt="Get help"
            />
          </div>
          <Link to="/get-food" className="btn">Get Help</Link>
        </div>
      </section>

      <section className="div2">
        <div className="container1">
          <h2 id="animationid">Restaurants</h2>
          <div className="content-box">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_k2Ytzi0Uq-buNPsBSWNAEN8yyihkwm6-Ug&s" 
              id="imgid1" 
              alt="Restaurants"
            />
          </div>
          <Link to="/hotel-registration" className="btn">Register</Link>
        </div>
        <div className="container1">
          <h2 id="animationid">Volunteer!</h2>
          <div className="content-box">
            <img 
              src="https://thumbs.dreamstime.com/z/baking-family-icing-mother-daughter-learning-decoration-home-kitchen-food-kids-help-girl-mom-happy-muffins-cupcakes-325971149.jpg" 
              id="imgid1" 
              alt="Volunteer"
            />
          </div>
          <Link to="/volunteer-registration" className="btn">Register</Link>
        </div>
      </section>
    </>
  );
}

export default Contribute;