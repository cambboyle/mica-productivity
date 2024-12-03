import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./styles/tasks.css";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: Task["priority"];
  status: Task["status"];
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState<TaskFormData>({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "todo",
  });
  const [filter, setFilter] = useState({ priority: "", status: "" });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, newTask);
        setTasks(
          tasks.map((task) =>
            task.id === editingTask.id ? { ...task, ...newTask } : task
          )
        );
        setEditingTask(null);
      } else {
        const response = await api.post("/tasks", newTask);
        setTasks([...tasks, response.data]);
      }
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "todo",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    });
    setShowForm(true);
  };

  const handleStatusChange = async (id: string, newStatus: Task["status"]) => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      // Revert the status change in UI if the API call fails
      alert("Failed to update task status. Please try again.");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter.priority && task.priority !== filter.priority) return false;
    if (filter.status && task.status !== filter.status) return false;
    return true;
  });

  if (loading) {
    return <div className="loading-state">Loading tasks...</div>;
  }

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">Tasks</h1>
        <p className="tasks-subtitle">Manage your tasks and stay organized</p>
      </div>

      <div className="task-filters">
        <select
          className="filter-select"
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          className="filter-select"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "New Task"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="new-task-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-control"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              className="form-control"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              className="form-control"
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  priority: e.target.value as Task["priority"],
                })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              className="form-control"
              value={newTask.status}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  status: e.target.value as Task["status"],
                })
              }
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setEditingTask(null);
                setNewTask({
                  title: "",
                  description: "",
                  dueDate: "",
                  priority: "medium",
                  status: "todo",
                });
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingTask ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      )}

      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. Create a new task to get started!</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${
                task.status === "done" ? "status-done" : ""
              }`}
            >
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-actions">
                  <button
                    className="task-action-button"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="task-action-button"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {task.description && (
                <p className="task-description">{task.description}</p>
              )}

              <div className="task-meta">
                {task.dueDate && (
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                )}
                <span className={`task-badge priority-${task.priority}`}>
                  {task.priority}
                </span>
                <select
                  value={task.status}
                  onChange={(e) =>
                    handleStatusChange(task.id, e.target.value as Task["status"])
                  }
                  className="filter-select"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
