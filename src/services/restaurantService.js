// services/restaurantService.js
import axios from 'axios';

// Function to add a restaurant
export const addRestaurant = async (restaurantData) => {
    try {
        const response = await axios.post('/restaurants/addRestaurant', restaurantData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to fetch all restaurants
export const getAllRestaurants = async () => {
    try {
        const response = await axios.get('/restaurants/allRestaurants');
        return response.data;
    } catch (error) {
        throw error;
    }
};
