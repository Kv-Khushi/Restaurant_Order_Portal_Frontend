// src/components/LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/userService';
import base64 from 'base-64';
import { useUser } from '../components/UserContext'; // Adjust import path
import '../css/LoginForm.css';

const LoginForm = ({setLinks}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();
  const { login } = useUser();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[A-Za-z0-9._%+-]+@nucleusteq\.com$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email must end with @nucleusteq.com';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const encodedPassword = base64.encode(password);
      const response = await loginUser({ userEmail: email, userPassword: encodedPassword });
      const { userId, userRole } = response;
      setLoginError('');
      login({ userId, userRole });

      if (userRole === 'CUSTOMER') {
        navigate('/customer-page'); // Adjust path if necessary

      } else if (userRole === 'RESTAURANT_OWNER') {
        setLinks([{"title":"Restarants","path":"/restaurant-owner"},{"title":"Category","path":"/category-owner"},{"title":"Items","path":"/items-owner"}]);
        navigate('/restaurant-owner'); // Adjust path if necessary
      } else {
        navigate('/'); // Default path or handle unknown roles
      }
    } catch (err) {
      setLoginError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        {loginError && <span className="error">{loginError}</span>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
