// src/components/TaskList.tsx
import React, { useState, useEffect } from "react";
import { Task } from "../types/Task";
import { format } from 'date-fns';
import "./styles/task_list.css";
import api from '../services/api';

export interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: "todo" | "in_progress" | "done") => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onStatusChange, onDelete }) => {
  const [projectNames, setProjectNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProjectNames = async () => {
      const uniqueProjectIds = Array.from(
        new Set(
          tasks
            .filter(task => task.projectId)
            .map(task => task.projectId)
        )
      );
      
      const names: Record<string, string> = {};
      
      for (const projectId of uniqueProjectIds) {
        try {
          const response = await api.get(`/projects/${projectId}`);
          names[projectId] = response.data.title || response.data.name || 'Unnamed Project';
        } catch (error) {
          console.error(`Failed to fetch project name for ID ${projectId}:`, error);
          names[projectId] = 'Unknown Project';
        }
      }
      
      setProjectNames(names);
    };

    if (tasks.some(task => task.projectId)) {
      fetchProjectNames();
    }
  }, [tasks]);

  const formatPriority = (priority: Task['priority']) => {
    if (!priority) return 'Normal';
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatStatus = (status: Task['status']) => {
    if (!status) return 'Todo';
    return status === 'in_progress' ? 'In Progress' : 
      status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getPriorityClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const getStatusClass = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return 'status-done';
      case 'in_progress':
        return 'status-in-progress';
      case 'todo':
        return 'status-todo';
      default:
        return 'status-todo';
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Create a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <div className="task-content">
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <div className="task-badges">
                <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                  {formatPriority(task.priority)}
                </span>
                <span className={`task-status ${getStatusClass(task.status)}`}>
                  {formatStatus(task.status)}
                </span>
                {task.projectId && (
                  <div className="task-project">
                    <span className="project-badge">
                      <i className="fas fa-link"></i>
                      {projectNames[task.projectId] || 'Loading...'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <p className="task-description">{task.description}</p>
            {task.dueDate && (
              <div className="task-due-date">
                Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </div>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="task-tags">
                {task.tags.map((tag) => (
                  <span key={tag} className="task-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="task-actions">
            <button
              onClick={() => onEdit(task)}
              className="edit-button"
              title="Edit task"
            >
              Edit
            </button>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
              className="status-select"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <button
              onClick={() => onDelete(task.id)}
              className="delete-button"
              title="Delete task"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
