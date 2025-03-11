import React, { useState, useEffect } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { isLoggedIn, logout } from '../../services/userapi/authservice';

const Header = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const productCategories = [
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
      } else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
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

  const handleLogout = () => {
    logout();
    navigate('/loginsignup');
  };

  return (
    <div className={`header-container ${isHeaderVisible ? "" : "header-hidden"}`}>
      <div className="announcement-bar">
        Free Shipping on Orders Above ₹499! | Easy Returns | COD Available
      </div>

      <div className="top-bar">
        <div className="logo">
          <Link to="/">
            <h1>RBLA</h1>
          </Link>
        </div>

        <div className="top-right">
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                placeholder="Search products..."
              />
              <button className="search-button" onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} />
              </button>
              {loggedIn && (
                <div className="login-status">
                  <FontAwesomeIcon icon={faUser} className="status-icon" />
                  <span>Logged In</span>
                </div>
              )}
            </div>
          </div>
          <div className="account-links">
            {loggedIn ? (
              <button onClick={handleLogout} className="account-link">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>LOGOUT</span>
              </button>
            ) : (
              <Link to="/loginsignup" className="account-link">
                <FontAwesomeIcon icon={faUser} />
                <span>SIGNUP/SIGNIN</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <nav className="main-nav">
        <ul>
          <li><Link to="/">HOME</Link></li>
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
