// src/services/userService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/users'; 

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/addUser`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/loginUser`, userData);
   
    return response.data;
    
  } catch (error) {
    throw error;
  }
};
