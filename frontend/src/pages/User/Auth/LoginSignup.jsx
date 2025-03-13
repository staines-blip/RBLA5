import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp, completeSignup } from '../../../services/userapi/authservice';
import { useUser } from '../../../Context/UserContext';
import './LoginSignup.css';

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login: contextLogin, error: contextError, clearError } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await sendOtp(formData.email);
      if (response.success) {
        setMessage(response.message);
        setStep(2);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await verifyOtp(formData.email, formData.otp);
      if (response.success) {
        setMessage(response.message);
        setStep(3);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await completeSignup(
        formData.email,
        formData.otp,
        formData.password,
        formData.confirmPassword
      );

      if (response.success) {
        const loginSuccess = await contextLogin({
          email: formData.email,
          password: formData.password
        });

        if (loginSuccess) {
          setMessage('Signup successful!');
          navigate('/');
        } else {
          setError('Signup completed but login failed. Please try logging in.');
        }
      }
    } catch (error) {
      setError(error.message || 'An error occurred during signup');
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const success = await contextLogin({
        email: formData.email,
        password: formData.password
      });

      if (success) {
        setMessage('Login successful!');
        navigate('/');
      } else {
        setError(contextError || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during login');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <div className="auth-toggle">
            <button
              className={isLogin ? 'active' : ''}
              onClick={() => setIsLogin(true)}
              disabled={loading}
            >
              Login
            </button>
            <button
              className={!isLogin ? 'active' : ''}
              onClick={() => {
                setIsLogin(false);
                setStep(1);
                setFormData({ email: '', otp: '', password: '', confirmPassword: '' });
                setError('');
                setMessage('');
              }}
              disabled={loading}
            >
              Sign Up
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        {isLogin ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form className="auth-form">
            {step === 1 && (
              <>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <button onClick={handleSendOtp} className="auth-button" disabled={loading}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <button onClick={handleVerifyOtp} className="auth-button" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <button onClick={handleSignup} className="auth-button" disabled={loading}>
                  {loading ? 'Submitting...' : 'Complete Signup'}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;