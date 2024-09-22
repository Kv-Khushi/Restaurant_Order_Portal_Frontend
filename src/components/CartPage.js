
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/CartPage.css';

import { FaHome } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";

import { RiChatHistoryFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { BiSolidContact } from "react-icons/bi";
import { IoLogOut } from "react-icons/io5";
const CartPage = ({ setLinks }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [foodDetails, setFoodDetails] = useState({}); 
  const [orderDetails, setOrderDetails] = useState({
    address: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [orderErrorMessage, setOrderErrorMessage] = useState('');


  useEffect(() => {
    setLinks([
      {title:<><FaHome /> Home</>,path:"/customer-page"},
      { "title":<>< FaCartShopping /> Cart</>, "path": "/cart" },
    
      {title:<><RiChatHistoryFill/> OrderHistroy</>,path:"/order-history"},
      {"title":<><FaUser/> You</>,"path":"user-details"},
      {"title":<><BiSolidContact />ContactUs</> ,"path":"contact-us"},
      { "title":<><IoLogOut /> Logout</>, "path": "/" } 
    ]);

    const userId = localStorage.getItem('userId');
    if (userId) {
      // Fetch cart items
      axios.get(`http://localhost:8082/cart/user/${userId}`)
        .then(response => {
          setCartItems(response.data);

          // Fetch food item details for each cart item
          response.data.forEach((item) => {
            axios.get(`http://localhost:8081/foodItems/${item.foodItemId}`)
              .then(foodResponse => {
                setFoodDetails(prevState => ({
                  ...prevState,
                  [item.foodItemId]: foodResponse.data
                }));
              })
              .catch(error => console.error(`Error fetching food item ${item.foodItemId}:`, error));
          });
        })
        .catch(error => console.error("There was an error fetching the cart items!", error));

      // Fetch user addresses
      axios.get(`http://localhost:8080/address/getAddress/${userId}`)
        .then(response => setAddresses(response.data))
        .catch(error => console.error("There was an error fetching the addresses!", error));
    } else {
      console.error('User ID is missing');
    }
  }, [setLinks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({
      ...orderDetails,
      [name]: value,
    });
  };

  const handlePlaceOrder = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const addressId = orderDetails.address;

      if (userId && addressId) {
        await axios.post(`http://localhost:8082/orders/create/${userId}/${addressId}`);
        console.log('Order placed successfully');
        navigate('/order-history'); // Navigate to order success page or similar
      } else {
        console.error('User ID or Address ID is missing');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        
        setOrderErrorMessage(error.response.data.message);
    }
  }
  };

  const handleDeleteItem = async (foodItemId) => {
    const userId = localStorage.getItem('userId');

    try {
      // Send delete request to the API
      await axios.delete(`http://localhost:8082/cart/remove/${userId}/${foodItemId}`);
      console.log('Item removed from cart');

      // Update the state to remove the deleted item from cartItems
      setCartItems(prevItems => prevItems.filter(item => item.foodItemId !== foodItemId));

      setOrderErrorMessage('');
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-items">
        {cartItems.length > 0 ? (
          cartItems.map((item) => {
            const foodItem = foodDetails[item.foodItemId];
            return (
              <div key={item.foodItemId} className="cart-item">
                {foodItem ? (
                  <>
                    <img
                      src={`http://localhost:8081/foodItems/${item.foodItemId}/image`}
                      alt={foodItem.itemName}
                      className="item-image"
                    />
                    <div className="cart-item-details">
                      <h3 className="item-name">{foodItem.itemName}</h3>
                      <div className="item-info">
                        <p className="item-price"><strong>Price:</strong> Rs{item.pricePerItem}</p>
                        <p className="item-quantity"><strong>Quantity:</strong> {item.quantity}</p>
                      </div>
                    </div>
                    
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteItem(item.foodItemId)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <p>Loading item details...</p>
                )}
              </div>
            );
          })
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      <div className="order-form">
        <h2>Place Order</h2>

        <label>
          Select Address:
          <select
            name="address"
            value={orderDetails.address}
            onChange={handleChange}
            required
          >
            <option value="">Select an address</option>
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <option key={address.addressId} value={address.addressId}>
                  {`${address.street}, ${address.city}, ${address.state}, ${address.country} - ${address.zipCode}`}
                </option>
              ))
            ) : (
              <option value="">No addresses available</option>
            )}
          </select>
        </label>

        <button onClick={handlePlaceOrder}>Place Order</button>
        {orderErrorMessage && <p className="error-message">{orderErrorMessage}</p>}
      </div>
    </div>
  );
};

export default CartPage;

