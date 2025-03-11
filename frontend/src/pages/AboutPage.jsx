import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AboutPage.css";
import varlogo from "../components/Assets/varlogo.png";
import about2 from "../components/Assets/about2.png";
import about1 from "../components/Assets/about1.png";
import about3 from "../components/Assets/about3.png";
import homepage from "../components/Assets/homepage.jpg";
import homepage2 from "../components/Assets/homepage2.jpg";
import vaalogo from "../components/Assets/vaalogo.png";
import sirlogo from "../components/Assets/sirlogo.png";

const AboutPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleUnitClick = (unit) => {
    navigate(`/${unit.toLowerCase()}`);
  };

  const units = [
    { name: "Varnam", logo: varlogo },
    { name: "Vaagai", logo: vaalogo },
    { name: "Siragugal", logo: sirlogo }
  ];

  return (
    <div className="about-container">
      <div className="about-content">
        <aside className="about-sidebar">
          <div className="vertical-text">ABOUT US</div>
        </aside>
        <main className="about-main">
          <div className="hero-section">
            <div className="hero-background" style={{ backgroundImage: `url(${homepage})` }}></div>
            <div className="hero-background hero-background-2" style={{ backgroundImage: `url(${homepage2})` }}></div>
            <div className="hero-content">
              <h1>REHABILITATE</h1>
              <p>Empowering survivors through sustainable rehabilitation</p>
            </div>
          </div>
          <div className="about-text">
            <h1>OUR MISSION</h1>
            <div className="intro-text">
              Since 2023, RBLA has been at the forefront of transforming lives through 
              comprehensive rehabilitation programs. We empower survivors of bonded labor 
              with skills, opportunities, and support to build independent futures.
            </div>

            <div className="mission-text">
              <h2>Our Approach</h2>
              <p>
                The Rehabilitation of Bonded Labourers Act (RBLA) combines sustainable 
                practices with economic empowerment. We create pathways to independence 
                through skill development, community support, and dignified employment 
                opportunities.
              </p>
              <div className={`expandable-content ${isExpanded ? "expanded" : ""}`}>
                <p>Through our specialized units, we focus on:</p>
                <ul>
                  <li>Comprehensive skill development programs</li>
                  <li>Sustainable employment creation</li>
                  <li>Quality product development</li>
                  <li>Community-based rehabilitation</li>
                  <li>Environmental responsibility</li>
                </ul>
              </div>
              <button 
                className="read-more-btn" 
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-controls="expandable-content"
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            </div>

            <div className="units-section">
              <h2>Our Units</h2>
              <div className="units-grid">
                {units.map((unit) => (
                  <div
                    key={unit.name}
                    className="unit-card"
                    onClick={() => handleUnitClick(unit.name)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleUnitClick(unit.name);
                      }
                    }}
                    aria-label={`Visit ${unit.name} page`}
                  >
                    <img src={unit.logo} alt={`${unit.name} Logo`} />
                    <p>{unit.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutPage;
