import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrdersPage = () => {
  const { restaurantId } = useParams(); // Get restaurantId from URL params
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemNames, setItemNames] = useState({}); // Store item names

  useEffect(() => {
    // Fetch orders for the specific restaurant
    axios.get(`http://localhost:8082/orders/restaurant/${restaurantId}`)
      .then(response => {
        setOrders(response.data);
        setLoading(false);

        // Fetch item names for each order
        response.data.forEach(order => {
          JSON.parse(order.items).forEach(item => {
            // Fetch item name using foodItemId
            axios.get(`http://localhost:8081/foodItems/${item.foodItemId}`)
              .then(itemResponse => {
                const itemName = itemResponse.data.itemName;
                setItemNames(prevState => ({
                  ...prevState,
                  [item.foodItemId]: itemName // Store item name based on foodItemId
                }));
              })
              .catch(error => console.error(`Error fetching item ${item.foodItemId}:`, error));
          });
        });
      })
      .catch(error => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, [restaurantId]);

  const handleCompleteOrder = (orderId) => {
    axios.put(`http://localhost:8082/orders/${orderId}/complete`)
      .then(response => {
        if (response.status === 200) {
          // Refresh the order list or update state to reflect the change
          setOrders(orders.map(order =>
            order.orderId === orderId ? { ...order, orderStatus: "COMPLETED" } : order
          ));
        }
      })
      .catch(error => {
        console.error("Error completing order:", error);
      });
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <h1>All Orders</h1>
      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.orderId} className="order-card">
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <div>
                <strong>Items:</strong>
                <ul>
                  {JSON.parse(order.items).map(item => (
                    <li
                      key={item.foodItemId}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        border: '1px solid lightgrey',  // Light grey border
                        padding: '10px',                // Add some padding for better spacing
                        marginBottom: '10px',           // Add margin between list items
                        borderRadius: '5px',            // Optional: round the corners
                      }}
                    >
                      {itemNames[item.foodItemId] ? (
                        <span>{itemNames[item.foodItemId]} - {item.quantity} pcs</span>
                      ) : (
                        <span>Loading item name...</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <p><strong>Total Price:</strong> Rs{order.totalPrice}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
              <p><strong>Order Time:</strong> {new Date(order.orderTime).toLocaleString()}</p>

              {/* Complete order button (hidden for CANCELED or COMPLETED orders) */}
              {order.orderStatus !== 'COMPLETED' && order.orderStatus !== 'CANCELED' && (
                <button onClick={() => handleCompleteOrder(order.orderId)}>
                  Complete Order
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found for this restaurant.</p>
      )}
    </div>
  );
};

export default OrdersPage;
