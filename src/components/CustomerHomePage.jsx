// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../css/CustomerPage.css'; // Import the CSS file for styling
// import home from "../images/home.svg"
// const CustomerPage = ({ setLinks }) => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [hoveredRestaurantId, setHoveredRestaurantId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log('Setting links...');
//     setLinks([
//       { "title": "Cart", "path": "/cart" ,},  // Add Cart link
//       { "title": "Logout", "path": "/","icon":home } ,// Add Logout link
     
      
//     ]);

//     // Fetch restaurants from backend
//     axios.get('http://localhost:8081/restaurants/allRestaurants')
//       .then(response => {
//         console.log("Fetched restaurants:", response.data);
//         setRestaurants(response.data);
//         setFilteredRestaurants(response.data); // Initially show all restaurants
//       })
//       .catch(error => {
//         console.error("There was an error fetching the restaurants!", error);
//       });
//   }, [setLinks]);

//   const handleSearch = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     setFilteredRestaurants(
//       restaurants.filter(restaurant =>
//         restaurant.restaurantName.toLowerCase().includes(term.toLowerCase())
//       )
//     );
//   };

//   const handleMouseEnter = (restaurantId) => {
//     setHoveredRestaurantId(restaurantId);
//   };

//   const handleMouseLeave = () => {
//     setHoveredRestaurantId(null);
//   };

//   const handleRestaurantClick = (restaurantId) => {
//     navigate(`/category-owner/${restaurantId}`);
//   };

//   return (
//     <div className="customer-page">
//       <h1>Restaurants</h1>
//       <input
//         type="text"
//         placeholder="Search for restaurants..."
//         value={searchTerm}
//         onChange={handleSearch}
//         className="search-bar"
//       />
//       <div className="restaurant-list">
//         {filteredRestaurants.length > 0 ? (
//           filteredRestaurants.map(restaurant => {
//             const restaurantId = restaurant.restaurantId;

//             if (!restaurantId) {
//               console.warn('Restaurant ID is missing:', restaurant);
//               return null;
//             }

//             const imageUrl = `http://localhost:8081/restaurants/${restaurantId}/image`;

//             return (
//               <div 
//                 key={restaurantId} 
//                 className="restaurant-item"
//                 onMouseEnter={() => handleMouseEnter(restaurantId)}
//                 onMouseLeave={handleMouseLeave}
//                 onClick={() => handleRestaurantClick(restaurantId)} // Add click handler
//               >
//                 <img
//                   src={imageUrl}
//                   alt={restaurant.restaurantName}
//                   className="restaurant-image"
//                   onError={(e) => {
//                     e.target.src = ''; 
//                   }}
//                 />
//                 <h2>{restaurant.restaurantName}</h2>
//                 <p>{restaurant.restaurantDescription}</p>
//                 <p>{restaurant.restaurantAddress}</p>
//                 {hoveredRestaurantId === restaurantId && (
//                   <div className="category-preview">
//                     {/* No need to show categories here, as we're redirecting */}
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         ) : (
//           <p>No restaurants found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomerPage;
