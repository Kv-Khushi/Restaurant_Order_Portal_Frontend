import React, { useState } from 'react';
import { registerUser } from '../services/userService';
import '../css/RegisterForm.css';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    userId: '',
    phoneNumber: '',
    userName: '',
    userEmail: '',
    userPassword: '',
    userRole: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};

    // Phone number validation
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number should be exactly 10 digits';
    }

    // Username validation
    if (!formData.userName || formData.userName.length < 2) {
      errors.userName = 'Username should have at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@nucleusteq\.com$/;
    if (!formData.userEmail || !emailRegex.test(formData.userEmail)) {
      errors.userEmail = 'Email must end with nucleusteq.com and be valid';
    }

    // Password validation
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
    if (!formData.userPassword || !passwordRegex.test(formData.userPassword)) {
      errors.userPassword = 'Password must be at least 8 characters long and contain at least one digit, one lowercase letter, one uppercase letter, and one special character (@#$%^&+=)';
    }

    // User role validation
    if (!formData.userRole) {
      errors.userRole = 'Please select a role';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Exit if validation fails
    }

    try {
      await registerUser(formData);
      alert('Registration successful!');
    } catch (err) {
      setError(err.response.data.message || 'An error occurred');
    }
  };

  return (
    <div className="formContainer">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          {validationErrors.phoneNumber && (
            <span className="error">{validationErrors.phoneNumber}</span>
          )}
        </label>
        <label>
          <input
            type="text"
            name="userName"
            placeholder="Enter username"
            value={formData.userName}
            onChange={handleChange}
            required
          />
          {validationErrors.userName && (
            <span className="error">{validationErrors.userName}</span>
          )}
        </label>
        <label>
          <input
            type="email"
            name="userEmail"
            placeholder="Enter email address"
            value={formData.userEmail}
            onChange={handleChange}
            required
          />
          {validationErrors.userEmail && (
            <span className="error">{validationErrors.userEmail}</span>
          )}
        </label>
        <label>
          <input
            type="password"
            name="userPassword"
            placeholder="Enter password"
            value={formData.userPassword}
            onChange={handleChange}
            required
          />
          {validationErrors.userPassword && (
            <span className="error">{validationErrors.userPassword}</span>
          )}
        </label>
        <label>
          <select
            name="userRole"
            value={formData.userRole}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="CUSTOMER">Customer</option>
            <option value="RESTAURANT_OWNER">Restaurant Owner</option>
          </select>
          {validationErrors.userRole && (
            <span className="error">{validationErrors.userRole}</span>
          )}
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
