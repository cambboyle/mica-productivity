// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Tasks from "./pages/Tasks"; // Import the Tasks component
import NavBar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <div className="">
        <NavBar />
        <div className="main-container">
          <div className="">
            <Routes>
              <Route
                path="/"
                element={<h2 className="">Welcome to the app!</h2>}
              />
              <Route path="/tasks" element={<Tasks />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
