import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css'; // Add your custom styles here
import { IoLogIn } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import bannerImage from '../images/background.jpg';

const Home = ({setLinks}) => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    setLinks([{ "title": <><FaHome /> Home</>, "path": "/" },
      { "title": <><IoLogIn/> LogIn</>, "path": "/login" },
      { "title": <><FaCircleUser/> Register</>, "path": "/register" }])
    // Fetch restaurants from backend
    axios.get('http://localhost:8081/restaurants/allRestaurants')
      .then(response => {
        console.log("Fetched restaurants:", response.data);
        setRestaurants(response.data);
        setFilteredRestaurants(response.data); // Initially show all restaurants
      })
      .catch(error => {
        console.error("There was an error fetching the restaurants!", error);
      });
  }, [setLinks]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredRestaurants(
      restaurants.filter(restaurant =>
        restaurant.restaurantName.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/category-owner/${restaurantId}?from=home`);
  };

  return (
    <div className="home-container">
      <h1>Restaurants</h1>

      <img 
        src={bannerImage}
        alt="Banner"
        className="banner-image" 
      />
      <div className="banner-text">
    <h1>Welcome to RestroWheels</h1>
    <p>Discover The Best Places To Eat In Town</p>
  </div>

      <input
        type="text"
        placeholder="Search for restaurants..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />
      <div className="restaurant-list">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map(restaurant => {
            const restaurantId = restaurant.restaurantId;

            if (!restaurantId) {
              console.warn('Restaurant ID is missing:', restaurant);
              return null;
            }

            const imageUrl = `http://localhost:8081/restaurants/${restaurantId}/image`;

            return (
              <div 
                key={restaurantId} 
                className="restaurant-item"
                onClick={() => handleRestaurantClick(restaurantId)} 
              >
                <img
                  src={imageUrl}
                  alt={restaurant.restaurantName}
                  className="restaurant-image"
                  onError={(e) => {
                    e.target.src = ''; 
                  }}
                />
                <h2>{restaurant.restaurantName}</h2>
                <p>{restaurant.restaurantDescription}</p>
                <p>{restaurant.restaurantAddress}</p>
              </div>
            );
          })
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;

