import React, { useState } from "react";
import "./styles/item.css";
import "../index.css";
import { Task } from "../types/Task";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: "todo" | "in_progress" | "done") => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onStatusChange, onDelete }) => {
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "";

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Task["status"];
    setUpdateStatus('idle'); // Reset status before new attempt
    
    try {
      await onStatusChange(task.id, newStatus);
      setUpdateStatus('success');
      setTimeout(() => setUpdateStatus('idle'), 2000);
    } catch (error) {
      setUpdateStatus('error');
      setTimeout(() => setUpdateStatus('idle'), 2000);
    }
  };

  const getItemClassName = () => {
    const baseClass = 'task-item';
    if (updateStatus === 'success') return `${baseClass} success`;
    if (updateStatus === 'error') return `${baseClass} error`;
    return baseClass;
  };

  return (
    <div className={getItemClassName()}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <button
          className="task-action-button edit-button"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button
          className="task-action-button delete-button"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className="task-due-date">
          Due: {formattedDate}
        </span>
        <span className={`task-badge priority-${task.priority}`}>
          {task.priority}
        </span>
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="status-select"
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
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
