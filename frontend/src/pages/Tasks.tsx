import { useEffect, useState } from "react";
import api from "../services/api";

interface Task {
  id: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: string;
  status: string; // Added status field
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state for creating a new task
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

  useEffect(() => {
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

    fetchTasks();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/tasks", newTask);
      setTasks([...tasks, response.data]); // Add the new task to the list
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
      }); // Reset form
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Handle updating task status
  const handleUpdateStatus = async (taskId: number, newStatus: string) => {
    try {
      const updatedTask = await api.put(`/tasks/${taskId}`, {
        status: newStatus,
      });
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: updatedTask.data.status } : task
      );
      setTasks(updatedTasks); // Update the task list with the new status
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId: number) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId)); // Remove the deleted task from the list
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div>
      <h1>Tasks</h1>

      {/* Add Task Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={newTask.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={newTask.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="date"
          name="dueDate"
          value={newTask.dueDate}
          onChange={handleChange}
        />
        <select
          name="priority"
          value={newTask.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {/* Display Tasks */}
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description || "No description provided"}</p>
              <p>Priority: {task.priority}</p>
              <p>Due Date: {task.dueDate || "No due date"}</p>
              <p>Status: {task.status}</p>
              <button onClick={() => handleUpdateStatus(task.id, "completed")}>
                Mark as Completed
              </button>
              <button
                onClick={() => handleUpdateStatus(task.id, "in-progress")}
              >
                Mark as In Progress
              </button>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
};

export default Tasks;
