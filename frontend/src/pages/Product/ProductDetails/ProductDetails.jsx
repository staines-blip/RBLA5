import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../../../services/publicapi/productAPI';
import { useCart } from '../../../Context/CartContext';
import { toast } from 'react-toastify';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('default');
  const [printedSide, setPrintedSide] = useState('single');
  const [addingToCart, setAddingToCart] = useState(false);

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(id);

        if (data.success && data.product) {
          const productData = {
            ...data.product,
            images: data.product.images?.map(img => getFullImageUrl(img)) || [],
            image_url: getFullImageUrl(data.product.image_url)
          };
          
          setProduct(productData);
          setSelectedImage(0);
        } else {
          setError('Product data is invalid');
        }
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const calculatePrice = () => {
    if (!product) return 0;
    let basePrice = product.new_price || product.price;
    
    // Size multiplier
    const sizeMultipliers = {
      'default': 1,
      'small': 0.8,
      'medium': 1.2,
      'large': 1.5
    };
    
    // Side printing multiplier
    const sideMultipliers = {
      'single': 1,
      'double': 1.5
    };

    return (basePrice * sizeMultipliers[size] * sideMultipliers[printedSide] * quantity).toFixed(2);
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-error">
        <h2>Error</h2>
        <p>{error || 'Product not found'}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      {/* Product Images Section */}
      <div className="product-images-section">
        <div className="main-image">
          {product.images?.[selectedImage] && (
            <img 
              src={product.images[selectedImage]}
              alt={product.name}
              className="product-main-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = product.image_url;
              }}
            />
          )}
        </div>
        <div className="image-thumbnails">
          {product.images?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} view ${index + 1}`}
              className={`thumbnail ${selectedImage === index ? 'selected' : ''}`}
              onClick={() => setSelectedImage(index)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = product.image_url;
              }}
            />
          ))}
        </div>
      </div>

      {/* Product Info Section */}
      <div className="product-info-section">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-description">{product.description}</p>

        <div className="price-section">
          {product.old_price && (
            <div className="original-price">₹{product.old_price}</div>
          )}
          <div className="current-price">₹{product.new_price || product.price}</div>
        </div>

        {/* Product Options */}
        <div className="product-options">
          <div className="option-group">
            <label>Size:</label>
            <select 
              value={size} 
              onChange={(e) => setSize(e.target.value)}
              className="size-select"
            >
              <option value="default">Default</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="option-group">
            <label>Printed Side:</label>
            <select 
              value={printedSide} 
              onChange={(e) => setPrintedSide(e.target.value)}
              className="side-select"
            >
              <option value="single">Single Side</option>
              <option value="double">Double Side</option>
            </select>
          </div>

          <div className="option-group">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="quantity-btn"
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="quantity-input"
              />
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Total Price */}
        <div className="total-price">
          <span>Total Price:</span>
          <span className="price">₹{calculatePrice()}</span>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className={`add-to-cart-btn ${addingToCart ? 'loading' : ''}`}
            onClick={async () => {
              try {
                setAddingToCart(true);
                const productToAdd = {
                  _id: product._id,
                  name: product.name,
                  price: parseFloat(calculatePrice()),
                  image: product.images[0] || product.image_url,
                  size,
                  printedSide,
                };
                
                const success = await addToCart(productToAdd, quantity);
                if (success) {
                  toast.success('Added to cart successfully!');
                } else {
                  toast.error('Failed to add to cart. Please try again.');
                }
              } catch (err) {
                toast.error('Error adding to cart. Please try again.');
              } finally {
                setAddingToCart(false);
              }
            }}
            disabled={addingToCart || cartLoading}
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
          <button className="buy-now-btn">
            Buy Now
          </button>
        </div>

        {/* Design Options */}
        <div className="design-options">
          <h3>Design Options</h3>
          <div className="design-buttons">
            <button onClick={() => navigate('/browse-design')} className="design-btn">
              Browse Designs
            </button>
            <button onClick={() => navigate('/custom-design')} className="design-btn">
              Custom Design
            </button>
            <button onClick={() => navigate('/upload-design')} className="design-btn">
              Upload Design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
