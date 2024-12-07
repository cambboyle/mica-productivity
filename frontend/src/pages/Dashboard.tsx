import React from "react";
import { useAuth } from "../contexts/AuthContext";
import "./styles/dashboard.css";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.email}!</h1>
      {/* Add your dashboard content here */}
    </div>
  );
};

export default Dashboard;