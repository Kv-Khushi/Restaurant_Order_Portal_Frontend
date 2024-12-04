import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RestaurantMenuForm = () => {
  const { restaurantId, categoryId } = useParams(); // Get both IDs from URL params
  const navigate = useNavigate(); // Hook to programmatically navigate

  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    description: '',
    vegNonVeg: false,
    restaurantId: restaurantId || '', // Set restaurantId from URL
    categoryId: categoryId || '', // Set categoryId from URL
    categoryName: '', // Add categoryName to state
    restaurantName: '' // Add restaurantName to state
  });

  const [image, setImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch category details
        const categoryResponse = await axios.get(`http://localhost:8081/foodCategories/${categoryId}`);
        const category = categoryResponse.data;

        // Fetch restaurant details
        const restaurantResponse = await axios.get(`http://localhost:8081/restaurants/getRestaurantById/${category.restaurantId}`);
        const restaurant = restaurantResponse.data;

        // Update form data with fetched details
        setFormData({
          itemName: '', // Clear existing data if needed
          price: '',
          description: '',
          vegNonVeg: false,
          categoryId: category.categoryId,
          restaurantId: category.restaurantId, // Set restaurantId based on category
          categoryName: category.categoryName, // Set categoryName from fetched data
          restaurantName: restaurant.restaurantName // Set restaurantName from fetched data
        });
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    if (categoryId) {
      fetchDetails();
    }
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedItemName = formData.itemName.trim();
    const form = new FormData();
    form.append('itemName', trimmedItemName);
    form.append('price', formData.price);
    form.append('description', formData.description);
    form.append('vegNonVeg', formData.vegNonVeg);
    form.append('categoryId', formData.categoryId);
    form.append('restaurantId', formData.restaurantId);

    if (image) {
      form.append('image', image);
    }

    try {
      const response = await axios.post('http://localhost:8081/foodItems/add', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponseMessage(`Food item "${response.data.itemName}" added successfully!`);
      
      // Redirect to the Items component
      navigate(`/items-owner/${formData.restaurantId}/${formData.categoryId}`);
    } catch (error) {
      setResponseMessage(error.response?.data?.message || 'Error adding food item');
      console.error('Error details:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2 style={{ textAlign: 'center' }}>Add Food Item</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ margin: '10px 0' }}>
          Restaurant Name:
          <input
            type="text"
            name="restaurantName"
            value={formData.restaurantName}
            readOnly
            disabled // Add disabled attribute
            style={{ padding: '10px', marginTop: '5px', width: '100%', boxSizing: 'border-box' }}
          />
        </label>

        <label style={{ margin: '10px 0' }}>
          Category Name:
          <input
            type="text"
            name="categoryName"
            value={formData.categoryName}
            readOnly
            disabled // Add disabled attribute
            style={{ padding: '10px', marginTop: '5px', width: '100%', boxSizing: 'border-box' }}
          />
        </label>

        <label style={{ margin: '10px 0' }}>
          Item Name:
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
            style={{ padding: '10px', marginTop: '5px', width: '100%', boxSizing: 'border-box' }}
          />
        </label>
        <label style={{ margin: '10px 0' }}>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            style={{ padding: '10px', marginTop: '5px', width: '100%', boxSizing: 'border-box' }}
          />
        </label>
        <label style={{ margin: '10px 0' }}>
          Description:
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ padding: '10px', marginTop: '5px', width: '100%', boxSizing: 'border-box' }}
          />
        </label>
        <label style={{ margin: '10px 0' }}>
          Vegetarian:
          <input
            type="checkbox"
            name="vegNonVeg"
            checked={formData.vegNonVeg}
            onChange={handleChange}
            style={{ marginLeft: '10px' }}
          />
        </label>
        <label style={{ margin: '10px 0' }}>
          Image:
          <input
            type="file"
            onChange={handleImageChange}
            style={{ marginTop: '5px' }}
          />
        </label>
        <button
          type="submit"
          style={{ padding: '10px', backgroundColor: '#4e3de7', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Add Food Item
        </button>
      </form>
      {responseMessage && <p style={{ marginTop: '20px' }}>{responseMessage}</p>}
    </div>
  );
};

export default RestaurantMenuForm;
