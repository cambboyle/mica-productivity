import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import "./styles/home.css";

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchPreferences = async () => {
      if (isAuthenticated && user) {
        try {
          await api.get(`/preferences`);
          // The CSS variables are now managed by CustomizationSidebar
          // We don't need to set them here anymore
        } catch (error) {
          console.error("Failed to fetch user preferences:", error);
        }
      }
    };

    fetchPreferences();
  }, [isAuthenticated, user]);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to Mica Productivity</h1>
        <p className="hero-subtitle">Your ultimate task management solution</p>
        <div className="hero-buttons">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="primary-button">Go to Dashboard</Link>
              <Link to="/tasks" className="secondary-button">View Tasks</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="primary-button">Get Started</Link>
              <Link to="/register" className="secondary-button">Learn More</Link>
            </>
          )}
        </div>
      </div>
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
      <div className="features-section">
        <h2>Features</h2>
        <ul>
          <li>Task Management</li>
          <li>Collaboration Tools</li>
          <li>Productivity Insights</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
