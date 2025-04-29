import React from 'react';
import '../styles/main.css';
import member1 from '../assets/img/1.jpeg';
import member2 from '../assets/img/2.jpeg';
import member3 from '../assets/img/3.jpeg';
import member4 from '../assets/img/4.jpeg';
import member5 from '../assets/img/5.jpeg';
import member6 from '../assets/img/6.jpeg';
import member7 from '../assets/img/7.jpeg';
import member8 from '../assets/img/8.jpeg';

function AboutUs() {
  const teamMembers = [
    { img: member1, name: 'Vaidik Saxena', id: 'LCS2024016' },
    { img: member2, name: 'Sumanth V U', id: 'LIT2024058' },
    { img: member3, name: 'Mozammil Ali', id: 'LCS2024035' },
    { img: member4, name: 'Chowdam Tanmai', id: 'LCS2024016' },
    { img: member5, name: 'Sandesh Raj', id: 'LCS2024004' },
    { img: member6, name: 'Vansh Tomar', id: 'LCS2024043' },
    { img: member7, name: 'Gubba Pavani', id: 'LIT2024035' },
    { img: member8, name: 'Shaik Meer G S', id: 'LCS2024025' }
  ];

  return (
    <section id="about-us" className="section about-us">
      <div className="container">
        <h2><strong>Our Team</strong></h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div id="check" key={index}>
              <div className="team-member">
                <img src={member.img} alt={`Team Member ${index + 1}`} />
              </div>
              <p id="pid" style={{ color: 'black' }}><strong>{member.name}</strong></p>
              <p id="pid">{member.id}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutUs;