import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Notes from './pages/Notes';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const WelcomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to Mica Productivity</h1>
        {isAuthenticated ? (
          <>
            <p className="welcome-message">Welcome back, {user?.email}!</p>
            <div className="action-buttons">
              <Link to="/dashboard" className="action-button primary">
                View Dashboard
              </Link>
              <Link to="/tasks" className="action-button primary">
                View Tasks
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="welcome-message">
              Please log in or register to start managing your tasks.
            </p>
            <div className="action-buttons">
              <Link to="/login" className="action-button primary">
                Login
              </Link>
              <Link to="/register" className="action-button secondary">
                Register
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/home" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
              <Route path="/notes" element={<Notes />} />
            </Routes>
          </div>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
