
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/OrderHistoryPage.css';
import { FaHome } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";

import { RiChatHistoryFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { BiSolidContact } from "react-icons/bi";
import { IoLogOut } from "react-icons/io5";

const OrderHistoryPage = ({ setLinks }) => {
  const [orders, setOrders] = useState([]);
  const [itemImages, setItemImages] = useState({}); // Store item images
  const [itemNames, setItemNames] = useState({});   // Store item names
  const [canceledOrders, setCanceledOrders] = useState(new Set()); // Track canceled orders

  useEffect(() => {
    // Set the navbar links
    setLinks([
      {title:<><FaHome /> Home</>,path:"/customer-page"},
      { "title":<>< FaCartShopping /> Cart</>, "path": "/cart" },  // Add Cart link
      {title:<><RiChatHistoryFill/> OrderHistroy</>,path:"/order-history"},
      {"title":<><FaUser/> You</>,"path":"user-details"},
      {"title":<><BiSolidContact />ContactUs</> ,"path":"contact-us"},
      { "title":<><IoLogOut /> Logout</>, "path": "/" } 
    ]);

    // Load canceled orders from localStorage
    const storedCanceledOrders = JSON.parse(localStorage.getItem('canceledOrders')) || [];
    setCanceledOrders(new Set(storedCanceledOrders));

    // Fetch the order history when the component mounts
    fetchOrderHistory();
  }, [setLinks]);

  // Function to fetch the order history
  const fetchOrderHistory = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`http://localhost:8082/orders/user/${userId}`)
        .then(response => {
          setOrders(response.data);

          // Fetch item details (images and names) for each order
          response.data.forEach(order => {
            JSON.parse(order.items).forEach(item => {
              // Fetch item image
              axios.get(`http://localhost:8081/foodItems/${item.foodItemId}/image`, {
                responseType: 'blob' // Specify that the response is a blob
              })
                .then(itemResponse => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setItemImages(prevState => ({
                      ...prevState,
                      [item.foodItemId]: reader.result // Store the image data as base64
                    }));
                  };
                  reader.readAsDataURL(itemResponse.data); // Convert blob to base64
                })
                .catch(error => console.error(`Error fetching item ${item.foodItemId} image:`, error));

              // Fetch item name
              axios.get(`http://localhost:8081/foodItems/${item.foodItemId}`)
                .then(itemDetailsResponse => {
                  const itemName = itemDetailsResponse.data.itemName;
                  setItemNames(prevState => ({
                    ...prevState,
                    [item.foodItemId]: itemName // Store the item name
                  }));
                })
                .catch(error => console.error(`Error fetching item ${item.foodItemId} details:`, error));
            });
          });
        })
        .catch(error => console.error("There was an error fetching the order history!", error));
    } else {
      console.error('User ID is missing');
    }
  };

  // Function to handle order cancellation
  const handleCancelOrder = (orderId) => {
    console.log('Handling cancel for orderId:', orderId);
    axios.put(`http://localhost:8082/orders/${orderId}/cancel`)
      .then(() => {
        // Update the canceled orders state
        setCanceledOrders(prevState => {
          const newCanceledOrders = new Set(prevState);
          newCanceledOrders.add(orderId);
          // Save updated canceled orders to localStorage
          localStorage.setItem('canceledOrders', JSON.stringify([...newCanceledOrders]));
          return newCanceledOrders;
        });
        // Re-fetch the order history after a successful cancellation
        fetchOrderHistory();
      })
      .catch(error => console.error('Error canceling order:', error));
  };

  // Function to check if the cancel button should be enabled
  const canCancelOrder = (orderTime) => {
    const orderTimeMs = new Date(orderTime).getTime();
    const currentTimeMs = new Date().getTime();
    return (currentTimeMs - orderTimeMs) <= 30000; // 30 seconds in milliseconds
  };

  return (
    <div className="order-history-page">
      <h1>Order History</h1>
      <div className="orders-list">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.orderId} className="order-card">
<div className="order-image-container">
                <ul>
                  {JSON.parse(order.items).map(item => {
                    const image = itemImages[item.foodItemId];
                    return (
                      <li key={item.foodItemId} className="order-item">
                        {image ? (
                          <img src={image} alt="Food Item" className="item-image" />
                        ) : (
                          <span>Loading item image...</span>
                        )}
                       
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="order-details">
                <p><strong>Order Id:</strong> {order.orderId}</p>

                {/* Display the item names below the Order Id */}
                {JSON.parse(order.items).map(item => {
                  const itemName = itemNames[item.foodItemId]; // Fetch item name from state
                  return (
                    <p key={item.foodItemId}><strong>Item Name:</strong> {itemName ? itemName : 'Loading item name...'}  <span> - {item.quantity} pcs</span></p>
                    
                  );
                })}

                <p><strong>Total Price:</strong> Rs{order.totalPrice}</p>
                <p><strong>Order Status:</strong> {order.orderStatus}</p>
                <p><strong>Order Time:</strong> {new Date(order.orderTime).toLocaleString()}</p>

                {/* Cancel button, visible only if the order is cancelable and not yet canceled */}
                {canCancelOrder(order.orderTime) && !canceledOrders.has(order.orderId) && (
                  <button onClick={() => handleCancelOrder(order.orderId)} className="cancel-btn">
                    Cancel Order
                  </button>
                )}
              </div>
              
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
