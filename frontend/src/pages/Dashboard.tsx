import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import "./styles/dashboard.css";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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
          return (
            dueDate > tomorrow &&
            dueDate <= nextWeek &&
            task.status !== "done"
          );
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
    };
  };

  const tasksByTime = getTasksByTimeframe();
  const stats = getTaskStats();

  if (loading) {
    return <div className="loading-state">Loading dashboard...</div>;
  }

  const TaskGroup = ({ title, tasks }: { title: string; tasks: Task[] }) => (
    <div className="task-group">
      <h3 className="task-group-header">{title}</h3>
      {tasks.length === 0 ? (
        <p className="empty-state">No tasks</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="task-item"
            onClick={() => navigate("/tasks")}
          >
            <div className="task-item-header">
              <h4 className="task-item-title">{task.title}</h4>
              <span className={`task-item-priority priority-${task.priority}`}>
                {task.priority}
              </span>
            </div>
            <span className="task-item-date">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back{user?.email ? `, ${user.email}` : ""}!</h1>
        <p className="dashboard-subtitle">Here's an overview of your tasks</p>
      </div>

      <div className="dashboard-grid">
        <div className="task-section">
          <div className="section-header">
            <h2 className="section-title">Your Tasks</h2>
            <Link to="/tasks" className="view-all-link">
              View All Tasks →
            </Link>
          </div>

          {tasksByTime.overdue.length > 0 && (
            <TaskGroup title="Overdue" tasks={tasksByTime.overdue} />
          )}
          <TaskGroup title="Today" tasks={tasksByTime.today} />
          <TaskGroup title="Tomorrow" tasks={tasksByTime.tomorrow} />
          <TaskGroup title="This Week" tasks={tasksByTime.thisWeek} />
        </div>

        <div className="stats-section">
          <h2 className="section-title">Task Statistics</h2>
          <div className="stat-card">
            <div className="stat-title">Total Tasks</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Completed</div>
            <div className="stat-value">{stats.completed}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">In Progress</div>
            <div className="stat-value">{stats.inProgress}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Pending</div>
            <div className="stat-value">{stats.pending}</div>
          </div>

          <div className="quick-actions">
            <button
              className="action-button"
              onClick={() => navigate("/tasks")}
            >
              Create New Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
