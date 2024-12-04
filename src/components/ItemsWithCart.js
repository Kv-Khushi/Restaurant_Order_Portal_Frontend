
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/Items.css';
import { FaHome } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { RiChatHistoryFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";

const ItemsWithCart = ({ setLinks }) => {
  const { restaurantId, categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [restaurantName, setRestaurantName] = useState(''); // State for restaurant name

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const fromHome = queryParams.get('from') === 'home';

    // Adjusting links based on query parameters
    setLinks([
      {title:<><FaHome /> Home</>,path:"/customer-page"},
      { "title":<>< FaCartShopping /> Cart</>, "path": "/cart" },  // Add Cart link
      {title:<><RiChatHistoryFill/> OrderHistroy</>,path:"/order-history"},
      { "title":<><IoLogOut /> Logout</>, "path": "/" } 
    ]);

    // Fetch food items
    axios.get(`http://localhost:8081/foodItems/getFoodItemsByCtg/${categoryId}`)
      .then(response => {
        setItems(response.data);
        // Initialize quantities
        const initialQuantities = response.data.reduce((acc, item) => {
          acc[item.itemId] = 1; // Default quantity
          return acc;
        }, {});
        setQuantities(initialQuantities);
      })
      .catch(error => console.error("There was an error fetching the items!", error));

    // Fetch restaurant details
    axios.get(`http://localhost:8081/restaurants/getRestaurantById/${restaurantId}`)
      .then(response => setRestaurantName(response.data.restaurantName))
      .catch(error => console.error("There was an error fetching the restaurant details!", error));

  }, [categoryId, restaurantId, setLinks, location.search]);

  const handleQuantityChange = (itemId, value) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemId]: value
    }));
  };

  const handleAddToCartClick = async (itemId) => {
    try {
      const userId = localStorage.getItem('userId'); // Get userId from local storage
      const quantity = quantities[itemId];
      if (userId && quantity > 0) {
        await axios.post('http://localhost:8082/cart/add', {
          restaurantId,
          userId,
          foodItemId: itemId,
          quantity,
        });
        navigate('/cart');
        console.log('Item added to cart');
      } else {
        console.error('User ID or quantity is missing');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const fromHome = new URLSearchParams(location.search).get('from') === 'home';
  const shouldShowAddButton = !fromHome;

  return (
    <div className="items-page">
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{restaurantName}</h1> 

      <div className="items-list">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.itemId} className="item-card">
              <img
                src={`http://localhost:8081/foodItems/${item.itemId}/image`}
                alt={item.itemName}
                className="item-image"
              />
              <h3>{item.itemName}</h3>
              <p className="item-price"><strong>Price:</strong> Rs{item.price}</p>
              <div className="item-description">
                <p><strong>Description: </strong>{item.description}</p>
              </div>
              {shouldShowAddButton && (
                <div className="item-actions">
                  <input
                    type="number"
                    value={quantities[item.itemId] || 1}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.itemId, parseInt(e.target.value, 10))}
                    className="quantity-input"
                  />
                  <button onClick={() => handleAddToCartClick(item.itemId)} className="add-to-cart-button">
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No items found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default ItemsWithCart;
