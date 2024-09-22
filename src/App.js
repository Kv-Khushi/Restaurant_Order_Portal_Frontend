import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom'; // Add useNavigate import
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import CustomerPage from './components/CustomerPage';
import RestaurantOwner from './components/RestaurantOwner';
import Home from './components/Home';
import RestaurantForm from './components/RestaurantForm';
import RestaurantMenuForm from './components/RestaurantMenuForm';
import CategoryForm from './components/CategoryForm';
import { UserProvider, useUser } from './components/UserContext'; // Adjust import path
import Category from "./components/Category"
import CustomerPageCategory from "./components/CustomerPageCategory"
import OrderHistoryPage from './components/OrderHistoryPage';
import Items from "./components/Items"
import './styles.css';
import './App.css';
import ItemsWithCart from './components/ItemsWithCart';
import CartPage from './components/CartPage';
import OrdersPage from './components/OrderPage';
import UserDetailPage from './components/UserDetailPage';
import ContactUsPage from './components/ContactUsPAge';
import ContactUsOwnerPage from './components/ContactUsOwnerPAge';


function App() {
  const [links,setLinks] = useState([{ "title": "Home", "path": "/" },{ "title": "Login", "path": "/login" },{ "title": "Register", "path": "/register" }])
  return (
    <UserProvider>
      <Router>
        <div className="App">
        <Navbar links={links} className="navbar"/>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home setLinks={setLinks}/>} />
              <Route path="/login" element={<LoginForm setLinks={setLinks}/>} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route
                path="/redirect"
                element={<RedirectBasedOnRole />}
              />
              <Route path="/add-restaurant" element={<RestaurantForm />} />
             <Route path="/add-food-item/:restaurantId/:categoryId" element={<RestaurantMenuForm />} />

              <Route path="/add-category" element={<CategoryForm />} />
             
              
              <Route path="/customer-page" element={<CustomerPage setLinks={setLinks} />} />
             
              <Route path="/user-details" element={<UserDetailPage />} />

              <Route path="/restaurant-owner" element={<RestaurantOwner setLinks={setLinks}/>} />
              <Route path="/category-owner/:restaurantId" element={<Category setLinks={setLinks} />} />
              <Route path="/category-customer/:restaurantId" element={<CustomerPageCategory setLinks={setLinks} />} />

              <Route path="/items-owner/:restaurantId/:categoryId" element={<Items setLinks={setLinks} />} />
              <Route path="/items-with-cart/:restaurantId/:categoryId" element={<ItemsWithCart setLinks={setLinks} />} />
              <Route path="/order-history" element={<OrderHistoryPage setLinks={setLinks} />} />


              <Route path="/cart" element={<CartPage setLinks={setLinks} />} />
           

              <Route path="/orders/:restaurantId" element={<OrdersPage />} />

              <Route path="/contact-us" element={<ContactUsPage />} />

              <Route path="/contact-us-owner"  element={<ContactUsOwnerPage setLinks={setLinks} />}        
           
          />
              
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

const RedirectBasedOnRole = () => {
  const { user } = useUser();
  const navigate = useNavigate(); // Ensure useNavigate is defined here

  React.useEffect(() => {
    if (user) {
      if (user.role === 'CUSTOMER') {
        navigate('/customer');
      } else if (user.role === 'RESTAURANT_OWNER') {
        navigate('/owner');
      }
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  return null;
};

export default App;
