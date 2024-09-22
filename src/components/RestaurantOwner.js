import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/RestaurantOwnerPage.css';
import { IoIosRestaurant } from "react-icons/io";
import { BiSolidContact } from "react-icons/bi";
import { IoLogOut } from "react-icons/io5";

const RestaurantOwner = ({ setLinks }) => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Set links for the navigation
    setLinks([
      { "title": <><IoIosRestaurant/> Restaurants</>, "path": "/restaurant-owner" },
  
      { "title": <><BiSolidContact/>ContactUs</>, "path": "/contact-us-Owner" },
      { "title":<><IoLogOut/>Logout</>, "path": "/" },
    
    ]);

    // Retrieve userId from local storage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);

      // Fetch restaurants for the particular owner
      axios.get(`http://localhost:8081/restaurants/restaurantsByUser/${storedUserId}`)
        .then(response => {
          setRestaurants(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the restaurants!", error);
        });
    } else {
      console.error("No user ID found in local storage.");
    }
  }, [setLinks]);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/category-owner/${restaurantId}`); // Navigate to Category page with restaurantId
  };

  const handleAddRestaurantClick = () => {
    navigate('/add-restaurant');
  };

  return (
    <div className="restaurant-owner">
      <div className="add-restaurant-button">
        <button onClick={handleAddRestaurantClick}>
          Add New Restaurant
        </button>
      </div>
      
      <div className="restaurant-list">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <div 
              key={restaurant.restaurantId} 
              className="restaurant-card" 
              onClick={() => handleRestaurantClick(restaurant.restaurantId)} // Handle card click
            >
              <img
                src={`http://localhost:8081/restaurants/${restaurant.restaurantId}/image`}
                alt={restaurant.restaurantName}
                className="restaurant-image"
                onError={(e) => e.target.src = '/path/to/default/image.jpg'} // Replace with your default image path
              />
              <h2>{restaurant.restaurantName}</h2>
              <p>{restaurant.restaurantAddress}</p>
            </div>
          ))
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantOwner;
