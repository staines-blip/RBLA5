import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutPage.css';

import artisanImage from "../components/Assets/v6.png";
import varlogo from "../components/Assets/varlogo.png";
import vaalogo from "../components/Assets/vaalogo.png";
import sirlogo from "../components/Assets/sirlogo.png";

const AboutPage = () => {
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

        {/* Hero Section */}
        <div className="hero-section">
          <div className="heading">
            <h1>
              A social enterprise An authentic platform for pure craft.
            </h1>
          </div>
          <div className="content">
            <p>
              The India Craft House is a digital platform for some of the world's oldest
              and most intricate craft forms. We started this social enterprise close to
              10 years ago in order to preserve, showcase and share the talent of
              India's artisans with the world. We hope to be able to raise the dignity
              of the Indian artisan in our own way and kindle an interest and support
              for an unsurpassed legacy of craft that spans millennia and spreads
              across the length and breadth of the land. It is our effort to curate an
              undeniably unique selection of traditional art and craft translated into a
              range of beautiful, contemporary products.
            </p>
          </div>
        </div>

        {/* Artisan Section */}
        <div className="section artisan-section">
          <div className="heading">
            <h3>Established in 2010, Gurgaon, India.</h3>
          </div>
          <div className="content">
            <p>
              We are headquartered in Gurgaon, India near the capital city of
              New Delhi. Our objective has always been to empower our
              artisans to deliver sustainable products of the finest quality. We
              devote ourselves to these causes. Each of our products are
              handcrafted and unique. Each product tells the unique story of
              the artisan who made it.
            </p>
            <div className="artisan-image">
              <img src={artisanImage} alt="Artisan crafting" />
            </div>
          </div>
        </div>

        {/* Heritage Section */}
        <div className="section heritage-section">
          <div className="heading">
            <h1>Celebrating a heritage.</h1>
          </div>
          <div className="content">
            <p>
              With a legacy of craft that spans millennia and some of the forms dating as
              far back as to the era of the Indus Valley civilisation, the fantastic world of
              India’s craftspeople remains unsurpassed in its beauty and extent.
              "Craftsmanship in India comes naturally to hundreds of thousands of its
              unlettered people who weave myths, legends and simple daily experiences
              into different forms of creativity that can change shape from day to day, yet
              maintain their consistency for centuries to enrich their lives.
            </p>
          </div>
        </div>

        {/* Units Section */}
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
    </div>
  );
};

export default AboutPage;
