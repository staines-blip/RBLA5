import React from "react";
import "./ProductPage.css";
import PD1 from "../components/Assets/PD1.png";
import PD2 from "../components/Assets/PD2.png";
import PD3 from "../components/Assets/PD3.png";
import PD4 from "../components/Assets/PD4.png";
import PD5 from "../components/Assets/PD5.png";
import PD6 from "../components/Assets/PD6.png";
import PD7 from "../components/Assets/PD7.png";
import PD8 from "../components/Assets/PD8.png";

const ProductPage = () => {
  const products = [
    { id: 1, name: "CUP COASTER",  image: PD1 },
    { id: 2, name: "NAPKINS",  image: PD2 },
    { id: 3, name: "KEY HOLDER",  image: PD3 },
    { id: 4, name: "PAPER FILES",  image: PD4 },
    { id: 5, name: "GIFT BOX",  image: PD5 },
    { id: 6, name: "TOWELS",  image: PD6 },
    { id: 7, name: "BEDSHEETS",  image: PD7 },
    { id: 8, name: "BAGS",  image: PD8 },
  ];


  return (
    <div className="product-page">
      {/* Banner */}
      <div className="banner">
        <h1>Our Products</h1>
        <p>Discover a variety of items crafted with care.</p>
      </div>

      

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <button>More</button>
            </div>
          ))}
        </div>
      </div>
  );
};

export default ProductPage;
