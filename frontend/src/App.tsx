import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Tasks from "./pages/Tasks";
import NavBar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

const WelcomePage = () => (
  <div className="welcome-container">
    <h1 className="welcome-title">
      Welcome to{" "}
      <Link to="/" className="welcome-title-primary">
        mica.
      </Link>
    </h1>
    <p className="welcome-subtitle">
      Your personal task management solution. Stay organized, focused, and productive.
    </p>
    <div className="welcome-actions">
      <Link to="/login" className="welcome-button welcome-button-primary">
        Get Started
      </Link>
      <Link to="/register" className="welcome-button welcome-button-secondary">
        Create Account
      </Link>
    </div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <div className="main-container">
          <Routes>
            <Route
              path="/"
              element={<WelcomePage />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/register"
              element={<Register />}
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <Tasks />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
