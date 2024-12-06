import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "./styles/dashboard.css";

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back{user?.email ? `, ${user.email}` : ''}!</h1>
        <p className="dashboard-subtitle">Stay organized and productive</p>
      </div>
    </div>
  );
};

export default Dashboard;