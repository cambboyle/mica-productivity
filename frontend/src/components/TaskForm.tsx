import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from 'react-toastify';
import { Task } from "../types/Task";
import "./styles/task_form.css";

type TaskFormData = Omit<Task, "id" | "userId">;

interface TaskFormProps {
  task: Task | TaskFormData;
  onSubmit: (task: TaskFormData) => Promise<void>;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
}) => {
  const { user } = useAuth();

  const [newTask, setNewTask] = React.useState<TaskFormData>({
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate || "",
    priority: task?.priority || "medium",
    status: task?.status || "todo",
  });

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("No user found. Please log in.");
      return;
    }

    // Validate required fields
    const missingFields = [];
    if (!newTask.title?.trim()) missingFields.push('Title');
    if (!newTask.priority) missingFields.push('Priority');
    if (!newTask.status) missingFields.push('Status');
    if (!newTask.dueDate) missingFields.push('Due Date');

    if (missingFields.length > 0) {
      toast.error(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate due date format and value
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newTask.dueDate)) {
      toast.error('Please select a valid due date using the date picker');
      return;
    }

    // Additional validation to ensure it's a real date
    const dueDate = new Date(newTask.dueDate);
    if (isNaN(dueDate.getTime())) {
      toast.error('Please select a valid due date');
      return;
    }

    // Validate the date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dueDate < today) {
      toast.error('Due date cannot be in the past');
      return;
    }

    const taskData: TaskFormData = {
      ...newTask,
      // Ensure required fields have default values
      priority: newTask.priority || 'medium',
      status: newTask.status || 'todo',
    };

    await onSubmit(taskData);
  };

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

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

  // Render nothing if no user is logged in
  if (!user) {
    return null;
  }

  return (
    <div className="form-container">
      <form onSubmit={onSubmitHandler} className="task-form">
        <div className="form-grid">
          {/* Title */}
          <div className="form-field">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTask.title || ''}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter task title"
              required
            />
          </div>
          {/* Due Date */}
          <div className="form-field">
            <label htmlFor="dueDate" className="form-label">Due Date</label>
            <div className="date-input-container">
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={newTask.dueDate || ''}
                min={today}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
          {/* Priority */}
          <div className="form-field">
            <label htmlFor="priority" className="form-label">Priority</label>
            <select
              id="priority"
              name="priority"
              value={newTask.priority || 'medium'}
              onChange={handleChange}
              className="form-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          {/* Status */}
          <div className="form-field">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              name="status"
              value={newTask.status || 'todo'}
              onChange={handleChange}
              className="form-select"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          {/* Description - Full Width */}
          <div className="form-field full-width">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={newTask.description || ''}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Enter task description"
              rows={3}
            />
          </div>
        </div>

        <div className="form-actions">
          <div className="button-group">
            <button
              type="button"
              onClick={onCancel}
              className="button button-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="button button-primary">
              {'id' in task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;