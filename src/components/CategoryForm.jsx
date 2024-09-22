
import React, { useState } from 'react';
import axios from 'axios';

const CategoryForm = ({ onClose, restaurantId }) => {
  const [formData, setFormData] = useState({
    categoryName: '',
    restaurantId: restaurantId,
  });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = name === 'categoryName' ? value.trimStart() : value;
    setFormData({ ...formData, [name]: trimmedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedFormData = {
      ...formData,
      categoryName: formData.categoryName.trim(), // Trimming leading and trailing spaces
    };

    try {
      // Make API call to add a new category
      const response = await axios.post('http://localhost:8081/foodCategories/add', trimmedFormData);
      const { categoryName } = response.data;

      setResponseMessage(`Category "${categoryName}" added successfully!`);
      onClose(); // Close the popup after successful submission and refresh categories
    } catch (error) {
      setResponseMessage(error.response?.data?.message || 'Error adding category');
      console.error('Error details:', error);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: '0', textAlign: 'center', flex: '1' }}>Add Category</h2>
        <button 
          onClick={onClose} 
          style={{ width: '2em', backgroundColor: 'red', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', padding: '5px 10px' }}
        >
          X
        </button>
      </span>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', marginTop: '20px', marginLeft: '2em' }}>
        <label style={{ margin: '10px 0' }}>
          Category Name:
          <input
            type="text"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            required
            style={{ padding: '10px', marginTop: '5px', width: '100%', boxSizing: 'border-box' }}
          />
        </label>

        <input type="hidden" name="restaurantId" value={formData.restaurantId} />

        <button type="submit" style={{ padding: '10px', backgroundColor: '#4e3de7', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
          Add Category
        </button>
      </form>

      {responseMessage && <p style={{ marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }}>{responseMessage}</p>}
    </div>
  );
};

export default CategoryForm;


