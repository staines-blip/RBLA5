import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../Context/CartContext';
import './PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cartTotal: total } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  });

  const handlePayment = (e) => {
    e.preventDefault();
    // Here you would typically handle payment processing
    navigate('/checkout/placeorder');
  };

  return (
    <div className="payment-container">
      <h2>Payment Details</h2>
      
      <div className="payment-methods">
        <div className="method-selector">
          <button 
            className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('card')}
          >
            Credit/Debit Card
          </button>
          <button 
            className={`method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('upi')}
          >
            UPI
          </button>
          <button 
            className={`method-btn ${paymentMethod === 'cod' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('cod')}
          >
            Cash on Delivery
          </button>
        </div>

        {paymentMethod === 'card' && (
          <form onSubmit={handlePayment} className="card-form">
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                value={cardInfo.cardNumber}
                onChange={(e) => setCardInfo({...cardInfo, cardNumber: e.target.value})}
                placeholder="1234 5678 9012 3456"
                required
                pattern="[0-9]{16}"
              />
            </div>
            
            <div className="form-group">
              <label>Card Holder Name</label>
              <input
                type="text"
                value={cardInfo.cardHolder}
                onChange={(e) => setCardInfo({...cardInfo, cardHolder: e.target.value})}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  value={cardInfo.expiry}
                  onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                  placeholder="MM/YY"
                  required
                  pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                />
              </div>
              
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="password"
                  value={cardInfo.cvv}
                  onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                  placeholder="123"
                  required
                  pattern="[0-9]{3}"
                  maxLength="3"
                />
              </div>
            </div>
          </form>
        )}

        {paymentMethod === 'upi' && (
          <div className="upi-form">
            <div className="form-group">
              <label>UPI ID</label>
              <input
                type="text"
                placeholder="username@upi"
                required
              />
            </div>
          </div>
        )}

        {paymentMethod === 'cod' && (
          <div className="cod-info">
            <p>Pay ₹{total} at the time of delivery</p>
          </div>
        )}

        <div className="payment-summary">
          <h3>Order Total: ₹{total}</h3>
          <button onClick={handlePayment} className="pay-btn">
            {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
