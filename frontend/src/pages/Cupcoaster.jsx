import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Cupcoaster.css';
import { WishlistContext } from '../WishlistContext';
import { CartContext } from '../CartContext';
import Header from '../components/Header/Header';
import Marquee from './Marquee';
import Footer from '../components/Footer/Footer';
import { getProductsByCategory } from '../services/publicapi/productAPI';

const Cupcoaster = () => {
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { cart, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [cupcoasters, setCupcoasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCupcoasters = async () => {
      try {
        setLoading(true);
        console.log('Fetching cupcoasters...');
        const response = await getProductsByCategory('Cupcoaster');
        console.log('Cupcoasters API response:', response);
        if (response && response.success) {
          console.log('Setting cupcoasters data:', response.data);
          setCupcoasters(response.data || []);
        } else {
          const errorMsg = response?.message || 'Failed to fetch cupcoasters';
          console.error('API Error:', errorMsg);
          setError(errorMsg);
        }
      } catch (error) {
        const errorMsg = error?.response?.data?.message || error.message || 'Error fetching cupcoasters';
        console.error('Fetch Error:', error);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchCupcoasters();
  }, []);

  const isInWishlist = (product) => wishlist.some((item) => item._id === product._id);
  const isInCart = (product) => cart.some((item) => item._id === product._id);

  // Helper function to get full image URL
  const getImageUrl = (product) => {
    if (!product) return null;
    
    // If image_url starts with http or https, use it as is
    if (product.image_url?.startsWith('http')) {
      return product.image_url;
    }
    
    // If using images array
    if (product.images?.[0]?.startsWith('http')) {
      return product.images[0];
    }
    
    // Otherwise, prepend the backend URL
    const baseUrl = 'http://localhost:5000';
    return product.image_url ? 
      `${baseUrl}${product.image_url}` : 
      product.images?.[0] ? 
        `${baseUrl}${product.images[0]}` : 
        '/placeholder.jpg';
  };

  return (
    <div className="cupcoaster-container">
      <Header />
      <Marquee />
      
      <div className="main-content">
        <h1>Welcome to the Cup Coasters Collection!</h1>

        {loading && <div className="loading">Loading cup coasters...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="product-grid">
          {cupcoasters.map((product) => (
            <div className="product-card" key={product._id}>
              <div
                className={`wishlist-icon ${isInWishlist(product) ? "active" : ""}`}
                onClick={() => {
                  if (isInWishlist(product)) {
                    removeFromWishlist(product);
                  } else {
                    addToWishlist(product);
                  }
                }}
              >
                ♥
              </div>

              <Link to={`/product/${product._id}`}>
                <img 
                  src={getImageUrl(product)} 
                  alt={product.name} 
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.jpg';
                  }}
                />
              </Link>

              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-size">Size: {product.size?.breadth}x{product.size?.height} {product.unit?.name}</p>
              <p className="product-price">₹{product.new_price}</p>
              <p className="original-price">Original Price: ₹{product.old_price}</p>
              {product.stock > 0 ? (
                <button
                  className="add-to-cart-btn"
                  onClick={() => {
                    if (!isInCart(product)) {
                      addToCart(product);
                    }
                  }}
                >
                  {isInCart(product) ? "In Cart" : "Add to Cart"}
                </button>
              ) : (
                <button className="out-of-stock-btn" disabled>
                  Out of Stock
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="design-steps">
          <h3>Next Step for Design</h3>
          <div className="design-options">
            <div
              className="design-option"
              onClick={() => navigate("/browse-design")}
              role="button"
              aria-label="Browse Design"
            >
              Browse Design →
            </div>
            <div
              className="design-option"
              onClick={() => navigate("/CustomDesignPage")}
              role="button"
              aria-label="Custom Design"
            >
              Custom Design →
            </div>
            <div
              className="design-option"
              onClick={() => navigate("/upload-design")}
              role="button"
              aria-label="Upload Design and Checkout"
            >
              Upload Design and Checkout →
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cupcoaster;
