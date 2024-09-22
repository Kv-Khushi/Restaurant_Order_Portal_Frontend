import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

function Navbar({links}) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">RestroWheels
         </div>
      <ul className="navbar-links">
      {links.map((link, index) => (
          <li key={index}>
            <div>
            <Link to={link.path}>{link.title}</Link>
            </div>
          </li>
        ))}
        
      </ul>
    </nav>
  );
}

export default Navbar;
