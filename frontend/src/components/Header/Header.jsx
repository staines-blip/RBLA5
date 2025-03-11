import React, { useState, useEffect, useContext } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faSearch, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const CartContext = React.createContext({ cartCount: 0 });

export const Header = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const { cartCount } = useContext(CartContext);

  const productCategories = [
    { name: "Bamboo", path: "/bamboo" },
    { name: "Paper Files", path: "/paperfiles" },
    { name: "Towels", path: "/towels" },
    { name: "Bags", path: "/bags" },
    { name: "Napkins", path: "/napkins" },
    { name: "Bedsheets", path: "/bedsheets" },
    { name: "Cup Coasters", path: "/cupcoaster" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsHeaderVisible(true);
      } 
      else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        setIsHeaderVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.products-dropdown')) {
        setIsProductsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      if (response.ok) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const toggleProducts = (e) => {
    e.stopPropagation();
    setIsProductsOpen(!isProductsOpen);
  };

  return (
    <div className={`header-container ${isHeaderVisible ? "" : "header-hidden"}`}>
      <div className="announcement-bar">
        Free shipping on orders above ₹999 | Easy Returns | COD Available
      </div>

      <div className="top-bar">
        <div className="logo">
          <Link to="/">RBLA</Link>
        </div>
        <div className="top-right">
          <div className="search-container">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              placeholder="Search products..."
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={handleSearch} />
          </div>
          <div className="account-links">
            <Link to="/login">ACCOUNT</Link>
            <Link to="/cart">
              <FontAwesomeIcon icon={faShoppingCart} /> CART ({cartCount})
            </Link>
          </div>
        </div>
      </div>

      <nav className="main-nav">
        <ul>
          <li><Link to="/aboutpage">ABOUT US</Link></li>
          <li className={`products-dropdown ${isProductsOpen ? 'active' : ''}`}>
            <div className="nav-link" onClick={toggleProducts}>
              PRODUCTS <FontAwesomeIcon icon={faChevronDown} className={`dropdown-icon ${isProductsOpen ? 'open' : ''}`} />
            </div>
            <div className={`dropdown-menu ${isProductsOpen ? 'show' : ''}`}>
              {productCategories.map((category) => (
                <Link 
                  key={category.path} 
                  to={category.path}
                  className="dropdown-item"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </li>
          <li><Link to="/gallery">GALLERY</Link></li>
          <li><Link to="/contactus">CONTACT US</Link></li>
        </ul>
      </nav>

      {searchResults.length > 0 && (
        <div className="search-results">
          <ul>
            {searchResults.map((product) => (
              <li key={product._id}>
                <Link to={`/product/${product._id}`}>{product.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
