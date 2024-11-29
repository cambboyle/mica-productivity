import React from "react";
import "./styles/item.css"; // Ensure this file contains the styles for priority
import "../index.css"; // You can leave this if you need additional global styles

interface TaskItemProps {
  task: {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
  };
  handleEdit: (task: any) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, handleEdit }) => {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "";

  return (
    <div className="card">
      <div className="priority-container">
        <span className="priority-label">{task.priority}</span>
        <span className="due-date-label">{formattedDate}</span>
      </div>
      <h3>{task.title}</h3>
      <p>{task.description || "No description"}</p>
      <button onClick={() => handleEdit(task)} className="button item-button">
        Edit
      </button>
    </div>
  );
};

export default TaskItem;
