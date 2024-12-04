
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/Category.css';
import CategoryForm from './CategoryForm';
import { FaHome } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { RiChatHistoryFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";

const CustomerPageCategory = ({ setLinks }) => {
  const { restaurantId } = useParams();
  const [categories, setCategories] = useState([]);
  const [restaurantName, setRestaurantName] = useState(''); // State for restaurant name
  const [isFormVisible, setFormVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLinks([
      {title:<><FaHome /> Home</>,path:"/customer-page"},
      { "title":<>< FaCartShopping /> Cart</>, "path": "/cart" },  // Add Cart link
      {title:<><RiChatHistoryFill/> OrderHistroy</>,path:"/order-history"},
      { "title":<><IoLogOut /> Logout</>, "path": "/" } 
    ]);

    // Check login status
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);

    // Fetch categories based on restaurantId
    axios.get(`http://localhost:8081/foodCategories/restaurant/${restaurantId}`)
      .then(response => setCategories(response.data))
      .catch(error => console.error("There was an error fetching the categories!", error));

    // Fetch restaurant details
    axios.get(`http://localhost:8081/restaurants/getRestaurantById/${restaurantId}`)
      .then(response => setRestaurantName(response.data.restaurantName))
      .catch(error => console.error("There was an error fetching the restaurant details!", error));
  }, [restaurantId, setLinks, location.search]);

  const handleCategoryClick = (categoryId) => {
    let user = localStorage.getItem("user");
    let userObj = JSON.parse(user);
    let userRole = userObj.userRole;

    if (userRole === 'CUSTOMER') {
      navigate(`/items-with-cart/${restaurantId}/${categoryId}?from=${new URLSearchParams(location.search).get('from')}`);
    } else {
      navigate(`/items-owner/${restaurantId}/${categoryId}?from=${new URLSearchParams(location.search).get('from')}`);
    }
  };

  // Show 'Add Category' button only if 'from' parameter is not 'home'
  const shouldShowAddButton = new URLSearchParams(location.search).get('from') !== 'home' && isLoggedIn;

  return (
    <div className="category-page">
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{restaurantName}</h1> 

      <div className="category-list">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.categoryId}
              className="category-card"
              onClick={() => handleCategoryClick(category.categoryId)}
            >
              <h2>{category.categoryName}</h2>
              <p>{category.restaurantName}</p>
            </div>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </div>

      {isFormVisible && (
        <div style={popupStyle}>
          <CategoryForm onClose={() => setFormVisible(false)} restaurantId={restaurantId} />
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

export default CustomerPageCategory;
