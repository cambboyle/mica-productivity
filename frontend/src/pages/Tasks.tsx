import React, { useState, useEffect } from 'react';
import { Task, TaskFormData, initialTaskState } from '../types/Task';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import api from '../services/api';
import { toast } from 'react-toastify';
import './styles/tasks.css';

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
  const [error, setError] = useState<string | null>(null);
  
  // Filtering and sorting states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [projectFilter, setProjectFilter] = useState<'all' | 'connected' | 'unconnected'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'priority' | 'dueDate' | 'status'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks');
      setLoading(false);
      toast.error('Failed to fetch tasks');
    }
  };

  const filterTasks = (tasks: Task[]) => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.every(tag => task.tags.includes(tag));
      const matchesProject = projectFilter === 'all' ? true :
                           projectFilter === 'connected' ? task.projectId != null :
                           task.projectId == null;
      
      return matchesSearch && matchesTags && matchesProject;
    });
  };

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      switch (sortBy) {
        case 'name':
          return direction * a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return direction * (priorityOrder[b.priority] - priorityOrder[a.priority]);
        case 'dueDate':
          if (!a.dueDate) return direction;
          if (!b.dueDate) return -direction;
          return direction * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        case 'status':
          const statusOrder = { todo: 1, in_progress: 2, done: 3 };
          return direction * (statusOrder[b.status] - statusOrder[a.status]);
        default:
          return 0;
      }
    });
  };

  const filteredAndSortedTasks = sortTasks(filterTasks(tasks));

  const handleSubmitTask = async (taskData: TaskFormData) => {
    try {
      if (editingTask) {
        const response = await api.put(`/tasks/${editingTask.id}`, taskData);
        setTasks(prev => prev.map(task => 
          task.id === editingTask.id ? response.data : task
        ));
        toast.success('Task updated successfully');
      } else {
        const response = await api.post('/tasks', taskData);
        setTasks(prev => [...prev, response.data]);
        toast.success('Task created successfully');
      }
      setShowForm(false);
      setEditingTask(null);
    } catch (err) {
      const action = editingTask ? 'update' : 'create';
      setError(`Failed to ${action} task`);
      toast.error(`Failed to ${action} task`);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      setError('Failed to delete task');
      toast.error('Failed to delete task');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { status });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status } : task
      ));
      toast.success('Task status updated');
    } catch (err) {
      setError('Failed to update task status');
      toast.error('Failed to update task status');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div className="header-content">
          <h1>Tasks</h1>
          <div className="controls-row">
            <div className="search-filter-section">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value as 'all' | 'connected' | 'unconnected')}
                className="filter-select"
              >
                <option value="all">All Tasks</option>
                <option value="connected">Connected to Project</option>
                <option value="unconnected">Not Connected</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'priority' | 'dueDate' | 'status')}
                className="sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="priority">Sort by Priority</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="status">Sort by Status</option>
              </select>
              <button
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="sort-direction-button"
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
            <button onClick={() => setShowForm(true)} className="button-primary">
              Add Task
            </button>
          </div>
        </div>
      </div>

      {showForm && !editingTask && (
        <TaskForm
          onSubmit={async (taskData) => {
            await handleSubmitTask(taskData);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
          initialData={initialTaskState}
        />
      )}

      {editingTask && (
        <TaskForm
          onSubmit={async (taskData) => {
            await handleSubmitTask(taskData);
            setEditingTask(null);
          }}
          onCancel={() => setEditingTask(null)}
          initialData={editingTask}
        />
      )}

      <TaskList
        tasks={filteredAndSortedTasks}
        onEdit={handleEditTask}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default Tasks;
