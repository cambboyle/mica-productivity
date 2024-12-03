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
    <div className="task-filters">
      <div className="task-filters-grid">
        <div className="task-filters-select-wrapper">
          <select
            id="priority"
            name="priority"
            value={filter.priority}
            onChange={handleFilterChange}
            className="task-filters-select"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="task-filters-select-wrapper">
          <select
            id="status"
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
            className="task-filters-select"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
