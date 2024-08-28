import React, { useState } from 'react';
import '../css/Home.css'; // You can add your CSS for styling here

const Home = () => {
  // Static list of restaurants
  const restaurants = [
    { id: 1, name: 'Italian Bistro', description: 'Authentic Italian cuisine.', address: '123 Pasta St.' },
    { id: 2, name: 'Sushi Haven', description: 'Fresh and delicious sushi.', address: '456 Sushi Ave.' },
    { id: 3, name: 'Burger Joint', description: 'Juicy burgers and fries.', address: '789 Burger Blvd.' },
    { id: 4, name: 'Taco Corner', description: 'Spicy tacos and more.', address: '101 Taco Rd.' },
    { id: 5, name: 'Vegan Delights', description: 'Healthy and tasty vegan options.', address: '202 Vegan Ln.' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredRestaurants(
      restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  return (
    <div className="home-container">
      <h1>Restaurants</h1>
      <input
        type="text"
        placeholder="Search for restaurants..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />
      <div className="restaurant-list">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map(restaurant => (
            <div key={restaurant.id} className="restaurant-item">
              <h2>{restaurant.name}</h2>
              <p>{restaurant.description}</p>
              <p>{restaurant.address}</p>
            </div>
          ))
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
