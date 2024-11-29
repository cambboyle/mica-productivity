import React, { useEffect, useRef } from "react";
import "./styles/task_form.css";

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
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingTask && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingTask]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">
        {editingTask ? "Edit Task" : "Add New Task"}
      </h2>
      <input
        ref={titleInputRef}
        type="text"
        name="title"
        value={newTask.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className="input-field"
      />
      <textarea
        name="description"
        value={newTask.description}
        onChange={handleChange}
        placeholder="Description"
        className="input-field"
      />
      <div className="">
        <input
          type="date"
          name="dueDate"
          value={newTask.dueDate}
          onChange={handleChange}
          className="input-field"
        />
        <select
          name="priority"
          value={newTask.priority}
          onChange={handleChange}
          className="input-field"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="button-container">
        <button type="submit" className="button">
          {editingTask ? "Update Task" : "Add Task"}
        </button>
        {editingTask && (
          <>
            <button type="button" onClick={handleCancelEdit} className="button">
              Cancel Edit
            </button>
            <button type="button" onClick={handleDeleteTask} className="button">
              Delete Task
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
