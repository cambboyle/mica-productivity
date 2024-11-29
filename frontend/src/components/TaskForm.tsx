// src/components/TaskForm.tsx
import React from "react";

interface TaskFormProps {
  newTask: any;
  setNewTask: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingTask: any;
  handleCancelEdit: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  newTask,
  setNewTask,
  handleSubmit,
  editingTask,
  handleCancelEdit,
}) => {
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
    <form onSubmit={handleSubmit} className="">
      <h2 className="">{editingTask ? "Edit Task" : "Add New Task"}</h2>
      <input
        type="text"
        name="title"
        value={newTask.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className=""
      />
      <textarea
        name="description"
        value={newTask.description}
        onChange={handleChange}
        placeholder="Description"
        className=""
      />
      <div className="">
        <input
          type="date"
          name="dueDate"
          value={newTask.dueDate}
          onChange={handleChange}
          className=""
        />
        <select
          name="priority"
          value={newTask.priority}
          onChange={handleChange}
          className=""
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="">
        <button type="button" className="">
          {editingTask ? "Update Task" : "Add Task"}
        </button>
        {editingTask && (
          <button type="button" onClick={handleCancelEdit} className="">
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
