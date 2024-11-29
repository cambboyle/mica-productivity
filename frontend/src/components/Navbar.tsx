import React from "react";
import { Link } from "react-router-dom";
import "./styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div>
          <h1 className="navbar-title">
            <span className="navbar-title-bold">mica.</span>
            <span className="navbar-title-small">productivity</span>
          </h1>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/tasks" className="navbar-link">
              Tasks
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
