import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Task, TaskFormData, initialTaskState } from '../types/Task';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import axios from 'axios';

interface PlusIconProps {
  className?: string;
}

const PlusIcon: React.FC<PlusIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ProjectTasks: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}/tasks`);
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks');
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: TaskFormData) => {
    try {
      const response = await axios.post(`/api/projects/${projectId}/tasks`, {
        ...taskData,
        projectId
      });
      setTasks(prev => [...prev, response.data]);
      setShowForm(false);
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData: TaskFormData) => {
    if (!editingTask) return;

    try {
      const response = await axios.put(`/api/tasks/${editingTask.id}`, {
        ...taskData,
        projectId
      });
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? response.data : task
      ));
      setShowForm(false);
      setEditingTask(null);
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, { status });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status } : task
      ));
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="project-tasks-container">
      <div className="project-tasks-header">
        <h2>Project Tasks</h2>
        <button className="add-task-button" onClick={() => setShowForm(true)}>
          <PlusIcon />
          Add Task
        </button>
      </div>
      
      {showForm && (
        <TaskForm
          initialData={editingTask || { ...initialTaskState, projectId: projectId || '' }}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
      
      <TaskList
        tasks={tasks}
        onEdit={handleEditTask}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default ProjectTasks;
