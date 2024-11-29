import React, { useEffect, useState } from "react";
import api from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import TaskList from "../components/TaskList";

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
  });
  const [filter, setFilter] = useState({ priority: "", status: "" });
  const [editingTask, setEditingTask] = useState<any | null>(null);

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

  const handleChange = (e: React.ChangeEvent<any>) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        status: "pending",
      });
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (filter.priority ? task.priority === filter.priority : true) &&
      (filter.status ? task.status === filter.status : true)
  );

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      status: "pending",
    });
  };

  const handleDeleteTask = async () => {
    if (editingTask) {
      try {
        await api.delete(`/tasks/${editingTask.id}`);
        setTasks(tasks.filter((task) => task.id !== editingTask.id));
        handleCancelEdit();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="">
      <h1 className="">Tasks</h1>
      <TaskForm
        newTask={newTask}
        setNewTask={setNewTask}
        handleSubmit={handleSubmit}
        editingTask={editingTask}
        handleCancelEdit={handleCancelEdit}
        handleDeleteTask={handleDeleteTask}
      />
      <TaskFilters filter={filter} handleFilterChange={handleFilterChange} />
      <TaskList filteredTasks={filteredTasks} handleEdit={handleEdit} />
    </div>
  );
};

export default Tasks;
