import React from "react";
import "./styles/item.css";
import "../index.css";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
}

interface TaskItemProps {
  task: Task;
  handleEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, handleEdit }) => {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "";

  return (
    <div className={`task-item ${task.status === "done" ? "task-completed" : ""}`}>
      <div className="task-item-header">
        <div className="task-item-badges">
          <span className={`task-item-priority ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`task-item-status ${getStatusColor(task.status)}`}>
            {formatStatus(task.status)}
          </span>
        </div>
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

function getPriorityColor(priority: "low" | "medium" | "high"): string {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
  }
}

function getStatusColor(status: "todo" | "in_progress" | "done"): string {
  switch (status) {
    case "todo":
      return "bg-gray-100 text-gray-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "done":
      return "bg-green-100 text-green-800";
  }
}

function formatStatus(status: string): string {
  switch (status) {
    case "todo":
      return "To Do";
    case "in_progress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return status;
  }
}

export default TaskItem;
