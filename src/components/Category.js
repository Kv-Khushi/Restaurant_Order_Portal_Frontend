
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/Category.css';
import CategoryForm from './CategoryForm';
import { IoIosRestaurant } from "react-icons/io";
import { RiChatHistoryFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { IoLogIn } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";

const Category = ({ setLinks }) => {
  const { restaurantId } = useParams();
  const [categories, setCategories] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [isFormVisible, setFormVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/foodCategories/restaurant/${restaurantId}`);
      setCategories(response.data);
    } catch (error) {
      console.error("There was an error fetching the categories!", error);
    }
  };

  // Fetch restaurant name
  const fetchRestaurantName = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/restaurants/getRestaurantById/${restaurantId}`);
      setRestaurantName(response.data.restaurantName);
    } catch (error) {
      console.error("There was an error fetching the restaurant name!", error);
    }
  };

  useEffect(() => {
    const fromHome = new URLSearchParams(location.search).get('from') === 'home';

    // Set navigation links based on 'from' parameter
    if (fromHome) {
      setLinks([
        { title: <><FaHome /> Home</>, path: "/" },
        { title: <><IoLogIn/> Login</>, path: "/login" },
        { title: <><FaCircleUser/> Register</>, path: "/register" }
      ]);
    } else {
      setLinks([
        { title: <><IoIosRestaurant /> Restaurants</>, path: "/restaurant-owner" },
        { title: <><RiChatHistoryFill /> Orders</>, path: `/orders/${restaurantId}` },
        { title: <><IoLogOut /> Logout</>, path: "/" },
      ]);
    }

    // Check login status
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);

    // Fetch categories and restaurant name
    fetchCategories();
    fetchRestaurantName();

  }, [restaurantId, setLinks, location.search]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/items-owner/${restaurantId}/${categoryId}?from=${new URLSearchParams(location.search).get('from')}`);
  };

  // Show 'Add Category' button only if 'from' parameter is not 'home'
  const shouldShowAddButton = new URLSearchParams(location.search).get('from') !== 'home' && isLoggedIn;

  // Handler for closing the form and refreshing the categories
  const handleCloseForm = () => {
    setFormVisible(false);
    fetchCategories(); // Fetch updated categories after adding a new one
  };

  return (
    <div className="category-page">
      <h1>{restaurantName || 'Loading restaurant name...'}</h1> 

      {shouldShowAddButton && (
        <div className="add-category-button">
          <button 
            onClick={() => setFormVisible(true)} 
            style={{ padding: '10px', backgroundColor: '#4e3de7', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}
          >
            Add Category
          </button>
        </div>
      )}

      <div className="category-list">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div 
              key={category.categoryId} 
              className="category-card"
              onClick={() => handleCategoryClick(category.categoryId)}
            >
              <h2>{category.categoryName}</h2>
            </div>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </div>

      {isFormVisible && (
        <div style={popupStyle}>
          <CategoryForm onClose={handleCloseForm} restaurantId={restaurantId} />
        </div>
      )}
    </div>
  );
};

const popupStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  zIndex: 1000,
};

export default Category;
