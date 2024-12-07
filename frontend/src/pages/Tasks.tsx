import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { Task } from "../types/Task";
import api from "../services/api";
import "./styles/tasks.css";

type TaskFormData = Omit<Task, "id" | "userId">;

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const initialTaskState = useMemo<TaskFormData>(() => ({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "todo",
  }), []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch tasks. Please try again.");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = useCallback(async (taskData: TaskFormData) => {
    try {
      const response = await api.post("/tasks", taskData);
      setTasks((prev) => [...prev, response.data]);
      setShowForm(false);
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error("Failed to create task. Please try again.");
      console.error("Error creating task:", error);
    }
  }, []);

  const handleUpdateTask = useCallback(async (taskId: string, status: "todo" | "in_progress" | "done") => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { status });
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? response.data : task))
      );
      setEditingTask(null);
      toast.success("Task updated successfully!");
    } catch (error) {
      toast.error("Failed to update task. Please try again.");
      console.error("Error updating task:", error);
    }
  }, []);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task. Please try again.");
      console.error("Error deleting task:", error);
    }
  }, []);

  const handleSubmitTask = useCallback(async (taskData: TaskFormData) => {
    if (editingTask) {
      try {
        const response = await api.put(`/tasks/${editingTask.id}`, taskData);
        setTasks((prev) =>
          prev.map((task) => (task.id === editingTask.id ? response.data : task))
        );
        setEditingTask(null);
        setShowForm(false);
        toast.success("Task updated successfully!");
      } catch (error) {
        toast.error("Failed to update task. Please try again.");
        console.error("Error updating task:", error);
      }
    } else {
      await handleCreateTask(taskData);
    }
  }, [editingTask, handleCreateTask]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div className="header-content">
          <h1>Tasks</h1>
          <button
            className="create-task-btn"
            onClick={() => {
              setShowForm(true);
              setEditingTask(null);
            }}
          >
            Create New Task
          </button>
        </div>
      </div>

      {showForm && (
        <TaskForm
          task={editingTask || initialTaskState}
          onSubmit={handleSubmitTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      <TaskList
        tasks={tasks}
        onEdit={(task) => {
          setEditingTask(task);
          setShowForm(true);
        }}
        onDelete={handleDeleteTask}
        onStatusChange={handleUpdateTask}
      />
    </div>
  );
};

export default Tasks;
