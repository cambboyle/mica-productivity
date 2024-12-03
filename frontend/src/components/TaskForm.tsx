import React, { useContext } from "react";
import "./styles/task_form.css";
import "../index.css";
import { AuthContext } from "../contexts/AuthContext";

interface TaskFormProps {
  newTask: any;
  setNewTask: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingTask: any;
  handleCancelEdit: () => void;
  handleDeleteTask: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  newTask,
  setNewTask,
  handleSubmit,
  editingTask,
  handleCancelEdit,
  handleDeleteTask,
}) => {
  const { user } = useContext(AuthContext);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleTaskSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const taskData = {
      ...newTask,
      userId: user.id,
    };
    handleSubmit(taskData);
  };

  return (
    <form onSubmit={handleTaskSubmit} className="task-form">
      <div className="task-form-grid">
        <div className="task-form-field">
          <label htmlFor="title" className="task-form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            required
            className="task-form-input"
            placeholder="Enter task title"
          />
        </div>
        <div className="task-form-field">
          <label htmlFor="description" className="task-form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newTask.description}
            onChange={handleChange}
            className="task-form-textarea"
            placeholder="Enter task description"
          />
        </div>
        <div className="task-form-field">
          <label htmlFor="dueDate" className="task-form-label">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleChange}
            className="task-form-input"
          />
        </div>
        <div className="task-form-field">
          <label htmlFor="priority" className="task-form-label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={newTask.priority}
            onChange={handleChange}
            className="task-form-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div className="task-form-button-group">
        <button type="submit" className="button">
          {editingTask ? "Update Task" : "Add Task"}
        </button>
        {editingTask && (
          <>
            <button type="button" onClick={handleCancelEdit} className="button">
              Cancel
            </button>
            <button type="button" onClick={handleDeleteTask} className="button">
              Delete
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
