import React from "react";
import { useAuth } from "../contexts/AuthContext";
import "./styles/task_form.css";
import "../index.css";

interface Task {
  id?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: string;
  userId: string;
}

interface TaskFormProps {
  newTask: Omit<Task, 'userId'>;
  setNewTask: React.Dispatch<React.SetStateAction<Omit<Task, 'userId'>>>;
  handleSubmit: (task: Task) => void;
  editingTask?: Task | null;
  handleCancelEdit?: () => void;
  handleDeleteTask?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  newTask,
  setNewTask,
  handleSubmit,
  editingTask,
  handleCancelEdit,
  handleDeleteTask,
}) => {
  const { user } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTaskSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      console.error("No user found. Please log in.");
      return;
    }

    const taskData: Task = {
      ...newTask,
      userId: user.id,
      // Ensure required fields have default values
      priority: newTask.priority || 'medium',
      status: newTask.status || 'todo',
    };

    handleSubmit(taskData);
  };

  // Render nothing if no user is logged in
  if (!user) {
    return null;
  }

  return (
    <form onSubmit={handleTaskSubmit} className="task-form">
      <div className="task-form-grid">
        {/* Title Input */}
        <div className="task-form-field">
          <label htmlFor="title" className="task-form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newTask.title || ''}
            onChange={handleChange}
            required
            className="task-form-input"
            placeholder="Enter task title"
          />
        </div>

        {/* Description Input */}
        <div className="task-form-field">
          <label htmlFor="description" className="task-form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newTask.description || ''}
            onChange={handleChange}
            className="task-form-input task-form-textarea"
            placeholder="Optional task description"
          />
        </div>

        {/* Priority Select */}
        <div className="task-form-field">
          <label htmlFor="priority" className="task-form-label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={newTask.priority || 'medium'}
            onChange={handleChange}
            className="task-form-input"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Status Select */}
        <div className="task-form-field">
          <label htmlFor="status" className="task-form-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={newTask.status || 'todo'}
            onChange={handleChange}
            className="task-form-input"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Due Date Input */}
        <div className="task-form-field">
          <label htmlFor="dueDate" className="task-form-label">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={newTask.dueDate || ''}
            onChange={handleChange}
            className="task-form-input"
          />
        </div>
      </div>

      {/* Form Buttons */}
      <div className="task-form-buttons">
        <button 
          type="submit" 
          className="task-form-button submit-button"
        >
          {editingTask ? "Update Task" : "Create Task"}
        </button>

        {editingTask && handleCancelEdit && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="task-form-button cancel-button"
          >
            Cancel
          </button>
        )}

        {editingTask && handleDeleteTask && (
          <button
            type="button"
            onClick={handleDeleteTask}
            className="task-form-button delete-button"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;