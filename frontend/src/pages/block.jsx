import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "./block.css";
import vaalogo from "../components/Assets/vaalogo.png"; // Adjust the path if needed
import img1 from "../components/Assets/v6.png"; // Replace with actual image paths
import img2 from "../components/Assets/v7.png";
import img3 from "../components/Assets/v8.png";
import Slider from "react-slick";

const Block = () => {
  const navigate = useNavigate(); // React Router navigation hook

  const settings = {
    infinite: true,         // Enable infinite scrolling
    speed: 500,            // Transition speed in milliseconds
    slidesToShow: 1,       // Number of slides visible
    slidesToScroll: 1,     // Number of slides to scroll at a time
    arrows: false,         // Hide navigation arrows for a cleaner UI
    autoplay: true,        // Auto-scroll slides
    autoplaySpeed: 2000,   // Speed for autoplay (2 seconds)
    pauseOnHover: false,   // Keep autoplay running even when hovered
    fade: true,            // Smooth fade transition between slides
    cssEase: "linear",     // Ensures a smooth transition effect
  };
  
  

  return (
    <div className="block-page">
      {/* Header */}
      <header className="block-header">
        <img src={vaalogo} alt="Block Logo" className="block-logo" />
        <h1>Block Printing</h1>
        <p>Your partner in excellence and innovation.</p>
      </header>

      {/* About Section */}
      <section className="block-about">
        <h2>About Block Unit</h2>
        <p>
          The Block Unit is dedicated to delivering world-class solutions and
          fostering growth in the technology sector. With a passionate team of
          experts, we aim to push boundaries, achieve milestones, and inspire
          change.
        </p>
      </section>

      {/* Hero Section */}
      <div className="hero-section">
      <Slider {...settings}>
          <div>
            <img src={img1} alt="Handcrafted Item 1" className="slider-image" />
          </div>
          <div>
            <img src={img2} alt="Handcrafted Item 2" className="slider-image" />
          </div>
          <div>
            <img src={img3} alt="Handcrafted Item 3" className="slider-image" />
          </div>
        </Slider>
          <div className="content">
            <p>
            At Varnam, we take pride in preserving and promoting the ancient art of block printing, a tradition that dates back centuries in the rich tapestry of Indian culture. Block printing is more than just a craft; it's a celebration of heritage, creativity, and craftsmanship.Originating in regions like Rajasthan and Gujarat, block printing has been passed down through generations, with artisans honing their skills and refining techniques over centuries. At Varnam, we pay homage to this heritage by working with master craftsmen who embody the spirit of this timeless art form.Block printing is a labor-intensive process that requires precision, patience, and passion. It begins with the carving of intricate designs onto wooden blocks, each meticulously crafted to perfection. These blocks are then dipped into natural dyes made from plants, minerals, and other organic sources, ensuring vibrant colors and eco-friendly production.
            </p>
          </div>
        </div>
    </div> 
  );
};

export default Block;
