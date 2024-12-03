import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
    <h1>Welcome to Mica Productivity</h1>
    <p>Please login or register to continue</p>
    <div className="welcome-buttons">
      <button
        className="welcome-button-primary"
        onClick={() => window.location.href = "/login"}
      >
        Login
      </button>
      <button
        className="welcome-button-secondary"
        onClick={() => window.location.href = "/register"}
      >
        Register
      </button>
    </div>
  </div>
);

const AppRoutes = () => (
  <Router>
    <div className="app-container">
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
        <Route path="/" element={<WelcomePage />} />
      </Routes>
    </div>
  </Router>
);

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
