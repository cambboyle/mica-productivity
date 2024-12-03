import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./styles/home.css";

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to Mica Productivity</h1>
        {isAuthenticated ? (
          <div className="authenticated-content">
            <h2>Welcome back, {user?.email}!</h2>
            <p>Ready to boost your productivity?</p>
            <div className="action-buttons">
              <Link to="/dashboard" className="primary-button">
                Go to Dashboard
              </Link>
              <Link to="/tasks" className="secondary-button">
                View Tasks
              </Link>
            </div>
          </div>
        ) : (
          <div className="unauthenticated-content">
            <p className="home-description">
              Organize your work, boost your productivity, and achieve your goals
              with our powerful task management platform.
            </p>
            <div className="action-buttons">
              <Link to="/login" className="primary-button">
                Login
              </Link>
              <Link to="/register" className="secondary-button">
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
