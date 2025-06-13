


import React, { useState, useEffect } from 'react';
import axios from "./axios"; // yeh tu likhega

import './Login.css';
import logo from '../assets/HRMS.jpg';
import { useNavigate } from 'react-router-dom';

// Set axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [forgotPasswordErrors, setForgotPasswordErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPasswordSubmitting, setIsForgotPasswordSubmitting] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const navigate = useNavigate();

  // Load saved credentials on component mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem('rememberedCredentials');
    if (savedCredentials) {
      try {
        const { email, password, rememberMe } = JSON.parse(savedCredentials);
        setFormData({
          email,
          password,
          rememberMe
        });
      } catch (error) {
        console.error('Failed to parse saved credentials:', error);
        localStorage.removeItem('rememberedCredentials');
      }
    }

    const interceptor = axios.interceptors.request.use(config => {
      const token = localStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData({
      ...forgotPasswordData,
      [name]: value
    });
    if (forgotPasswordErrors[name]) {
      setForgotPasswordErrors({
        ...forgotPasswordErrors,
        [name]: ''
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrors({ submit: 'Please provide both email and password' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/users/login', {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      console.log('Login response:', response.data);

      if (!response.data.token) {
        throw new Error('No token received');
      }

      localStorage.setItem('userToken', response.data.token);

      // Save credentials if "Remember Me" is checked
      if (formData.rememberMe) {
        localStorage.setItem('rememberedCredentials', JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: true
        }));
      } else {
        // Clear saved credentials if "Remember Me" is not checked
        localStorage.removeItem('rememberedCredentials');
      }

      // Verify token before redirect
      try {
        const token = response.data.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);

        if (payload.id) {
          setErrors({});
          onLogin(true);
          alert('Login successful! Redirecting to dashboard...');
          navigate('/homepage');
        } else {
          throw new Error('Invalid token payload');
        }
      } catch (tokenError) {
        console.error('Token verification failed:', tokenError);
        throw new Error('Token validation failed');
      }

    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Login failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!forgotPasswordData.email) newErrors.email = 'Email is required';
    if (!forgotPasswordData.newPassword) newErrors.newPassword = 'New password is required';
    if (forgotPasswordData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters and contain: 1 letter, 1 number, and 1 special character';
    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setForgotPasswordErrors(newErrors);
      return;
    }

    setIsForgotPasswordSubmitting(true);

    try {
      const response = await axios.post('/api/users/reset-password', {
        email: forgotPasswordData.email,
        newPassword: forgotPasswordData.newPassword
      });

      setForgotPasswordSuccess(true);
      // Clear form on success
      setForgotPasswordData({
        email: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setForgotPasswordErrors({
        submit: error.response?.data?.message || 'Failed to reset password. Please try again.'
      });
    } finally {
      setIsForgotPasswordSubmitting(false);
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setForgotPasswordSuccess(false);
    setForgotPasswordErrors({});
    setForgotPasswordData({
      email: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <img src={logo} alt="Logo" className="logo" />
        <h2>Welcome Back</h2>
        <p>Please enter your credentials to continue</p>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className={`${errors.email ? 'error' : ''} ${formData.rememberMe ? 'auto-filled' : ''}`}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={`${errors.password ? 'error' : ''} ${formData.rememberMe ? 'auto-filled' : ''}`}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="options">
          <label className="remember">
            <input
            
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <span>Remember me</span>
          </label>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowForgotPasswordModal(true);
            }}
          >
            Forgot Password?
          </a>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging In...' : 'Log In'}
        </button>

        <p className="signup">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </form>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeForgotPasswordModal}>×</button>
            <h2>Reset Password</h2>

            {forgotPasswordSuccess ? (
              <div className="success-message">
                <p>Password updated successfully!</p>
                <button
                  onClick={closeForgotPasswordModal}
                  className="success-button"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit}>
                {forgotPasswordErrors.submit && (
                  <div className="error-message">{forgotPasswordErrors.submit}</div>
                )}

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={forgotPasswordData.email}
                    onChange={handleForgotPasswordChange}
                    className={forgotPasswordErrors.email ? 'error' : ''}
                  />
                  {forgotPasswordErrors.email && (
                    <span className="error-text">{forgotPasswordErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password (min 8 characters)"
                    value={forgotPasswordData.newPassword}
                    onChange={handleForgotPasswordChange}
                    className={forgotPasswordErrors.newPassword ? 'error' : ''}
                  />
                  {forgotPasswordErrors.newPassword && (
                    <span className="error-text">{forgotPasswordErrors.newPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={forgotPasswordData.confirmPassword}
                    onChange={handleForgotPasswordChange}
                    className={forgotPasswordErrors.confirmPassword ? 'error' : ''}
                  />
                  {forgotPasswordErrors.confirmPassword && (
                    <span className="error-text">{forgotPasswordErrors.confirmPassword}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isForgotPasswordSubmitting}
                  className="reset-password-button"
                >
                  {isForgotPasswordSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
