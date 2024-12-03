import React from "react";
import "./styles/item.css";
import "../index.css";

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
    <div className="task-item">
      <div className="task-item-header">
        <span
          className={`task-item-priority ${getPriorityColor(task.priority)}`}
        >
          {task.priority}
        </span>
        <span className="task-item-date">{formattedDate}</span>
      </div>
      <h3 className="task-item-title">{task.title}</h3>
      <p className="task-item-description">
        {task.description || "No description"}
      </p>
      <button onClick={() => handleEdit(task)} className="button">
        Edit
      </button>
    </div>
  );
};

function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default TaskItem;
