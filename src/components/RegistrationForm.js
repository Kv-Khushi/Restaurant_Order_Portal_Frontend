import React, { useState } from 'react';
import { registerUser } from '../services/userService';
import base64 from 'base-64';
import '../css/RegisterForm.css';
import { useNavigate } from 'react-router-dom';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    userName: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: '',
    userRole: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};

    // Phone number validation
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Invalid Phone Number';
    }

    // Username validation
    if (!formData.userName || formData.userName.trim().length < 2) {
      errors.userName = 'Invalid User Name';
    }

    // Email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@nucleusteq\.com$/;
    if (!formData.userEmail || !emailRegex.test(formData.userEmail)) {
      errors.userEmail = 'Email must end with nucleusteq.com';
    }

    // Password validation
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
    if (!formData.userPassword || !passwordRegex.test(formData.userPassword)) {
      errors.userPassword = 'Use Strong Password';
    }

    // Confirm Password validation
    if (formData.userPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      // Encode the password to Base64
      const encodedPassword = base64.encode(formData.userPassword);
      const { confirmPassword, ...dataToSend } = formData; // Exclude confirmPassword
      const dataWithEncodedPassword = { ...dataToSend, userPassword: encodedPassword }; // Add encoded password

      await registerUser(dataWithEncodedPassword);
     
      setError(null); // Clear any previous errors
      navigate('/login'); 
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setValidationErrors({
          ...validationErrors,
          userEmail: 'Email already registered' // Add email error to validationErrors
        });
        console.log(validationErrors);
      } else {
        setError(err.response?.data?.message || 'An error occurred');
      }
     
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
          <span className="error" style={{ color: 'red' }}>{validationErrors.userEmail}</span>

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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {validationErrors.confirmPassword && (
            <span className="error">{validationErrors.confirmPassword}</span>
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
