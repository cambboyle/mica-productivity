import React from "react";
import { Link } from "react-router-dom";
import "./styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">mica.productivity</h1>
        <ul className="navbar-links">
          <li>
            <Link to="/tasks" className="navbar-link">
              Tasks
            </Link>
          </li>
          <li>
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
