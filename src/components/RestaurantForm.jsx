// src/components/RestaurantForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext'; // Adjust the import path

const RestaurantForm = () => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    restaurantAddress: '',
    contactNumber: '',
    restaurantDescription: '',
    openingHour: '',
  });
  const [image, setImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const { user, setUserRestaurantId } = useUser(); // Get user and setUserRestaurantId from context

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({ ...prevData, userId: user.userId }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    // Append form data
    form.append('userId', formData.userId);
    form.append('restaurantName', formData.restaurantName); 
    form.append('restaurantAddress', formData.restaurantAddress);
    form.append('contactNumber', formData.contactNumber);
    form.append('restaurantDescription', formData.restaurantDescription);
    form.append('openingHour', formData.openingHour);

    if (image) {
      form.append('image', image);
    }

    try {
      const response = await axios.post('http://localhost:8081/restaurants/addRestaurant', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set restaurant ID in the context
      const { restaurantId } = response.data;
      if (restaurantId) {
        setUserRestaurantId(restaurantId);
      }      
      setResponseMessage(response.data.restaurantName ? `Restaurant "${response.data.restaurantName}" added successfully!` : 'Restaurant added successfully!');
      console.log(response.data); // Check if restaurantId is present

    } catch (error) {
      setResponseMessage(error.response?.data?.message || 'Error adding restaurant');
      console.error('Error details:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2 style={{ textAlign: 'center' }}>Add Restaurant</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ margin: '10px 0' }}>
          Restaurant Name:
          <input
            type="text"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleChange}
            required
            style={{ padding: '10px', marginTop: '5px', width: '100%', boxSizing: 'border-box' }}
          />
        </label>
        <label style={{ margin: '10px 0' }}>
          Restaurant Address:
          <input
            type="text"
            name="restaurantAddress"
            value={formData.restaurantAddress}
            onChange={handleChange}
            required
            style={{ padding: '10px', marginTop: '5px', width: '100%', boxSizing: 'border-box' }}
          />
        </label>
        <label style={{ margin: '10px 0' }}>
          Contact Number:
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            style={{ padding: '10px', marginTop: '5px', width: '100%', boxSizing: 'border-box' }}
          />
        </label>
        <label style={{ margin: '10px 0' }}>
          Restaurant Description:
          <input
            type="text"
            name="restaurantDescription"
            value={formData.restaurantDescription}
            onChange={handleChange}
            required
            style={{ padding: '10px', marginTop: '5px', width: '100%', boxSizing: 'border-box' }}
          />
        </label>
        <label style={{ margin: '10px 0' }}>
          Opening Hour:
          <input
            type="text"
            name="openingHour"
            value={formData.openingHour}
            onChange={handleChange}
            required
            style={{ padding: '10px', marginTop: '5px', width: '100%', boxSizing: 'border-box' }}
          />
        </label>
        <label style={{ margin: '10px 0' }}>
          Upload Image:
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            style={{ marginTop: '5px' }}
          />
        </label>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4e3de7', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
          Add Restaurant
        </button>
      </form>
      {responseMessage && <p style={{ marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }}>{responseMessage}</p>}
    </div>
  );
};

export default RestaurantForm;
