// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tasks from "./pages/Tasks"; // Import the Tasks component

const App = () => {
  return (
    <Router>
      <div>
        <h1>mica productivity</h1>

        <Routes>
          <Route path="/" element={<h2>Welcome to the app!</h2>} />

          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
