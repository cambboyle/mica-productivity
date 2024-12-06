import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { Task } from "../types/Task";
import api from "../services/api";
import "./styles/tasks.css";

type TaskFormData = Omit<Task, "id" | "userId">;

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<TaskFormData>({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "todo",
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ priority: "", status: "", timeframe: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const getTasksByTimeframe = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return {
      overdue: tasks.filter(
        (task) => new Date(task.dueDate) < today && task.status !== "done"
      ),
      today: tasks.filter(
        (task) =>
          new Date(task.dueDate).toDateString() === today.toDateString() &&
          task.status !== "done"
      ),
      tomorrow: tasks.filter(
        (task) =>
          new Date(task.dueDate).toDateString() === tomorrow.toDateString() &&
          task.status !== "done"
      ),
      thisWeek: tasks.filter(
        (task) => {
          const dueDate = new Date(task.dueDate);
          return dueDate > tomorrow && dueDate <= nextWeek && task.status !== "done";
        }
      ),
    };
  };

  const getTaskStats = () => {
    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.status === "done").length,
      pending: tasks.filter((task) => task.status === "todo").length,
      inProgress: tasks.filter((task) => task.status === "in_progress").length,
      high: tasks.filter((task) => task.priority === "high" && task.status !== "done").length,
      medium: tasks.filter((task) => task.priority === "medium" && task.status !== "done").length,
      low: tasks.filter((task) => task.priority === "low" && task.status !== "done").length,
    };
  };

  useEffect(() => {
    const filtered = tasks.filter((task) => {
      if (filter.priority && task.priority !== filter.priority) return false;
      if (filter.status && task.status !== filter.status) return false;
      if (filter.timeframe) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const taskDate = new Date(task.dueDate);
        
        switch (filter.timeframe) {
          case "overdue":
            if (!(taskDate < today && task.status !== "done")) return false;
            break;
          case "today":
            if (taskDate.toDateString() !== today.toDateString()) return false;
            break;
          case "tomorrow":
            if (taskDate.toDateString() !== tomorrow.toDateString()) return false;
            break;
          case "week":
            if (!(taskDate > today && taskDate <= nextWeek)) return false;
            break;
        }
      }
      return true;
    });
    setFilteredTasks(filtered);
  }, [tasks, filter]);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
      setLoading(false);
    }
  };

  const handleSubmit = async (task: TaskFormData) => {
    try {
      if (editingTask) {
        const response = await api.put(`/tasks/${editingTask.id}`, task);
        setTasks(tasks.map((t) => (t.id === editingTask.id ? response.data : t)));
        setEditingTask(null);
        toast.success(`Task "${task.title}" has been updated`);
      } else {
        const response = await api.post("/tasks", task);
        setTasks([...tasks, response.data]);
        toast.success(`New task "${task.title}" has been created`);
      }
      setShowForm(false);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "todo",
      });
    } catch (error) {
      const action = editingTask ? "update" : "create";
      toast.error(`Failed to ${action} task "${task.title}". Please try again.`);
      console.error(`Error ${action}ing task:`, error);
    }
  };

  const handleDelete = async (taskId: string) => {
    const taskToDelete = tasks.find((task) => task.id === taskId);
    if (!taskToDelete) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
      setShowForm(false);
      setEditingTask(null);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "todo",
      });
      toast.success(`Task "${taskToDelete.title}" has been deleted`);
    } catch (error) {
      toast.error(`Failed to delete task "${taskToDelete.title}". Please try again.`);
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task: Task) => {
    // Format the date to YYYY-MM-DD for the date input
    const formattedDate = new Date(task.dueDate).toISOString().split('T')[0];
    
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || "",
      dueDate: formattedDate,
      priority: task.priority,
      status: task.status,
    });
    setShowForm(true);
  };

  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map((t) => (t.id === taskId ? response.data : t)));
      const statusDisplay = newStatus.replace("_", " ");
      toast.success(`Task "${task.title}" moved to ${statusDisplay}`);
    } catch (error) {
      toast.error(`Failed to update status for task "${task.title}". Please try again.`);
      console.error("Error updating task status:", error);
      throw error; // Propagate error to handle UI feedback
    }
  };

  const tasksByTime = getTasksByTimeframe();
  const stats = getTaskStats();

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Tasks</h1>
        <button className="add-task-button" onClick={() => setShowForm(true)}>
          Add Task
        </button>
      </div>

      <div className="task-stats-grid">
        <div className="stat-card">
          <h3>Status Overview</h3>
          <div className="stat-content">
            <div className="stat-item">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{stats.completed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">In Progress</span>
              <span className="stat-value">{stats.inProgress}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{stats.pending}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3>Priority Distribution</h3>
          <div className="stat-content">
            <div className="stat-item priority-high">
              <span className="stat-label">High Priority</span>
              <span className="stat-value">{stats.high}</span>
            </div>
            <div className="stat-item priority-medium">
              <span className="stat-label">Medium Priority</span>
              <span className="stat-value">{stats.medium}</span>
            </div>
            <div className="stat-item priority-low">
              <span className="stat-label">Low Priority</span>
              <span className="stat-value">{stats.low}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3>Timeline Overview</h3>
          <div className="stat-content">
            <div className="stat-item overdue">
              <span className="stat-label">Overdue</span>
              <span className="stat-value">{tasksByTime.overdue.length}</span>
            </div>
            <div className="stat-item today">
              <span className="stat-label">Due Today</span>
              <span className="stat-value">{tasksByTime.today.length}</span>
            </div>
            <div className="stat-item tomorrow">
              <span className="stat-label">Due Tomorrow</span>
              <span className="stat-value">{tasksByTime.tomorrow.length}</span>
            </div>
            <div className="stat-item this-week">
              <span className="stat-label">Due This Week</span>
              <span className="stat-value">{tasksByTime.thisWeek.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="filters-container">
        <select
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={filter.timeframe}
          onChange={(e) => setFilter({ ...filter, timeframe: e.target.value })}
        >
          <option value="">All Timeframes</option>
          <option value="overdue">Overdue</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="week">This Week</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <div className="tasks-content">
          <TaskList
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <TaskForm
              task={editingTask || newTask}
              onSubmit={handleSubmit}
              onCancel={() => {
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
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
