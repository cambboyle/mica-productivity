// src/components/TaskFilters.tsx
import React from "react";
import "./styles/task_filter.css";
import "../index.css";

interface TaskFiltersProps {
  filter: { priority: string; status: string };
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filter,
  handleFilterChange,
}) => {
  return (
    <div className="filter-container">
      <h2 className="filter-title">Filter Tasks</h2>

      <label className="filter-label">Priority Filter:</label>
      <select
        name="priority"
        value={filter.priority}
        onChange={handleFilterChange}
        className="filter-select"
      >
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <label className="filter-label">Status Filter:</label>
      <select
        name="status"
        value={filter.status}
        onChange={handleFilterChange}
        className="filter-select"
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <button className="filter-button">Apply Filters</button>
    </div>
  );
};

export default TaskFilters;
