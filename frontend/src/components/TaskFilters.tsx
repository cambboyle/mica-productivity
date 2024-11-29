// src/components/TaskFilters.tsx
import React from "react";

interface TaskFiltersProps {
  filter: { priority: string; status: string };
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filter,
  handleFilterChange,
}) => {
  return (
    <div>
      <label>Priority Filter: </label>
      <select
        name="priority"
        value={filter.priority}
        onChange={handleFilterChange}
      >
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <label>Status Filter: </label>
      <select name="status" value={filter.status} onChange={handleFilterChange}>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
};

export default TaskFilters;
