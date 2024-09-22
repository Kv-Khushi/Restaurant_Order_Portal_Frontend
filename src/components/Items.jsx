
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/Items.css';
import Modal from 'react-modal';
import { IoIosRestaurant } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { IoLogIn } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";

Modal.setAppElement('#root');

const Items = ({ setLinks }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { restaurantId, categoryId } = useParams();
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    description: '',
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const fromHome = queryParams.get('from') === 'home';

    if (fromHome) {
      setLinks([
        { title: <><FaHome /> Home</>, path: "/" },
        { title: <><IoLogIn/> Login</>, path: "/login" },
        { title: <><FaCircleUser/> Register</>, path: "/register" }
      ]);
    } else {
      setLinks([
        { "title": <><IoIosRestaurant/> Restaurants</>, "path": "/restaurant-owner" },
        { "title":<><IoLogOut/>Logout</>, "path": "/" },
      ]);
    }

    axios.get(`http://localhost:8081/foodItems/getFoodItemsByCtg/${categoryId}`)
      .then(response => setItems(response.data))
      .catch(error => console.error("There was an error fetching the items!", error));
  }, [categoryId, restaurantId, setLinks, location.search]);

  const handleAddFoodItemClick = () => {
    navigate(`/add-food-item/${restaurantId}/${categoryId}`);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setFormData({
      itemName: item.itemName,
      price: item.price,
      description: item.description,
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem && selectedItem.itemId) {
        await axios.put(`http://localhost:8081/foodItems/update/${selectedItem.itemId}`, formData);
        handleModalClose();
        const response = await axios.get(`http://localhost:8081/foodItems/getFoodItemsByCtg/${categoryId}`);
        setItems(response.data);
      } else {
        console.error('Selected item or foodItemId is missing');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const fromHome = new URLSearchParams(location.search).get('from') === 'home';
  const shouldShowEditButton = !fromHome;
  const shouldShowAddButton = !fromHome;

  return (
    <div className="items-page">
      {shouldShowAddButton && (
        <div className="add-food-item-button">
          <button onClick={handleAddFoodItemClick}>
            Add New Food Item
          </button>
        </div>
      )}

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
              {shouldShowEditButton && (
                <button onClick={() => handleEditClick(item)} className="edit-button">
                  Edit
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No items found for this category.</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Edit Item"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Edit Food Item</h2>
        <form className= "form" onSubmit={handleSubmit}>
          <label>
            Item Name:
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={handleModalClose}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default Items;
