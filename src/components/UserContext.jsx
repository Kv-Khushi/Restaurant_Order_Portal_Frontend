import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [restaurantId, setRestaurantId] = useState(() => {
    const savedRestaurantId = localStorage.getItem('restaurantId');
    return savedRestaurantId ? savedRestaurantId : null;
  });

  const [categoryId, setCategoryId] = useState(() => {
    const savedCategoryId = localStorage.getItem('categoryId');
    return savedCategoryId ? savedCategoryId : null;
  });

 

  // Update localStorage whenever restaurantId or categoryId changes
  useEffect(() => {
    if (restaurantId !== null) {
      localStorage.setItem('restaurantId', restaurantId);
    }
  }, [restaurantId]);

  useEffect(() => {
    if (categoryId !== null) {
      localStorage.setItem('categoryId', categoryId);
    }
  }, [categoryId]);

  const login = (userDetails) => {
    setUser(userDetails);
    
    localStorage.setItem('user', JSON.stringify(userDetails));
    localStorage.setItem('userId', userDetails.userId); 
  };

  const logout = () => {
    setUser(null);
  // Redirect to login page
    localStorage.removeItem('user');
    setRestaurantId(null); 
    setCategoryId(null); 
   
  };

  const setUserRestaurantId = (id) => {
    setRestaurantId(id);
  };

  const setUserCategoryId = (id) => {
    setCategoryId(id);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, restaurantId, setUserRestaurantId, categoryId, setUserCategoryId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
