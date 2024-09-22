import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/UserDetailPage.css'; 

const UserDetailPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false); // State to toggle address form
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [errors, setErrors] = useState({}); // State to manage form errors
  const [message, setMessage] = useState(null); // For success or error messages

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user")).userId;
        const response = await axios.get(`http://localhost:8080/users/getUser/${userId}`);
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevState) => ({ ...prevState, [name]: '' })); // Reset field errors on change
  };

  // Validate the form fields
  const validateForm = () => {
    let formErrors = {};
    if (address.street.trim().length < 2) {
      formErrors.street = 'Street should have at least 2 characters';
    }
    if (address.city.trim().length < 2 || !/^[a-zA-Z\s]+$/.test(address.city)) {
      formErrors.city = 'City should have at least 2 characters and contain only letters';
    }
    if (!/^[a-zA-Z\s]+$/.test(address.state)) {
      formErrors.state = 'State should contain only letters';
    }
    if (address.zipCode.length !== 5 || isNaN(address.zipCode)) {
      formErrors.zipCode = 'Zip code must be a 5-digit number';
    }
    if (address.country.trim() === '') {
      formErrors.country = 'Country is mandatory';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Returns true if no errors
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const userId = JSON.parse(localStorage.getItem("user")).userId;

    if (!validateForm()) {
      return; // If the form is invalid, stop submission
    }

    try {
      await axios.post('http://localhost:8080/address/addAddress', {
        ...address,
        userId: userId
      });
      setMessage('Address added successfully!'); // Show success message
      setShowAddressForm(false); // Optionally hide form
      setAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      });
    } catch (err) {
      setMessage('Failed to add address.');
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-detail-page">
      {user ? (
        <div>
          <h1>Your Profile</h1>
          <div className="user-detail">
            <p><strong>Name:</strong> {user.userName}</p>
            <p><strong>Email:</strong> {user.userEmail}</p>
            <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
            <p><strong>Wallet Balance:</strong> {user.wallet}</p>
          </div>

         
          <button onClick={() => setShowAddressForm(!showAddressForm)} className="toggle-address-form">
            {showAddressForm ? "Cancel" : "Add Address"}
          </button>

     
          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="address-form">
              <button type="button" className="cancel" onClick={() => setShowAddressForm(false)}>
                X
              </button>
              <div>
                <label>Street:</label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  required
                />
                {errors.street && <p className="error-message">{errors.street}</p>}
              </div>
              <div>
                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleInputChange}
                  required
                />
                {errors.city && <p className="error-message">{errors.city}</p>}
              </div>
              <div>
                <label>State:</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleInputChange}
                  required
                />
                {errors.state && <p className="error-message">{errors.state}</p>}
              </div>
              <div>
                <label>Zip Code:</label>
                <input
                  type="number"
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleInputChange}
                  required
                />
                {errors.zipCode && <p className="error-message">{errors.zipCode}</p>}
              </div>
              <div>
                <label>Country:</label>
                <input
                  type="text"
                  name="country"
                  value={address.country}
                  onChange={handleInputChange}
                  required
                />
                {errors.country && <p className="error-message">{errors.country}</p>}
              </div>
              <button type="submit">Submit Address</button>
            </form>
          )}

          {/* Message */}
          {message && <p>{message}</p>}
        </div>
      ) : (
        <p>No user details available.</p>
      )}
    </div>
  );
};

export default UserDetailPage;
