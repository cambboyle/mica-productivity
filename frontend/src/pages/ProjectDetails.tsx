import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task, TaskFormData, initialTaskState } from '../types/Task';
import { Project } from '../types/project';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import ProjectForm from '../components/ProjectForm';
import { getTagColor } from '../utils/tagColors';
import { format } from 'date-fns';
import api from '../services/api';
import { toast } from 'react-toastify';
import './styles/project_details.css';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch project details');
      setLoading(false);
      toast.error('Failed to fetch project details');
    }
  };

  const handleTaskSubmit = async (taskData: TaskFormData) => {
    try {
      if (editingTask) {
        const response = await api.put(`/tasks/${editingTask.id}`, {
          ...taskData,
          projectId: id
        });
        setTasks(prev => prev.map(task => 
          task.id === editingTask.id ? response.data : task
        ));
        toast.success('Task updated successfully');
      } else {
        const response = await api.post(`/projects/${id}/tasks`, {
          ...taskData,
          projectId: id
        });
        setTasks(prev => [...prev, response.data]);
        toast.success('Task created successfully');
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (err) {
      const action = editingTask ? 'update' : 'create';
      toast.error(`Failed to ${action} task`);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { status });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status } : task
      ));
      toast.success('Task status updated');
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const handleProjectUpdate = async (updatedProject: Partial<Project>) => {
    try {
      const response = await api.put(`/projects/${id}`, updatedProject);
      setProject(response.data);
      setShowProjectForm(false);
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error('Failed to update project');
    }
  };

  const handleProjectDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const handleEditClick = () => {
    setShowProjectForm(true);
  };

  const handleDeleteClick = handleProjectDelete;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!project) return <div>Project not found</div>;

  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="project-details-container">
      <div className="project-header">
        <div className="header-content">
          <h1>{project.title}</h1>
          <p>{project.description}</p>
        </div>
        <div className="controls-row">
          <div className="actions">
            <button onClick={() => setShowTaskForm(true)} className="button-primary">
              Add Task
            </button>
            <button onClick={handleEditClick} className="button-secondary">
              Edit Project
            </button>
            <button onClick={handleDeleteClick} className="button-danger">
              Delete Project
            </button>
          </div>
        </div>
      </div>

      <div className="project-content">
        <div className="project-info">
          <div className="metadata">
            <div className="status">
              Status: <span className={`status-badge ${project.status}`}>{project.status}</span>
            </div>
            <div className="dates">
              <div>Created: {format(new Date(project.createdAt), 'MMM d, yyyy')}</div>
              <div>Updated: {format(new Date(project.updatedAt), 'MMM d, yyyy')}</div>
            </div>
            <div className="tags">
              {project.tags.map(tag => {
                const tagColor = getTagColor(tag);
                return (
                  <span
                    key={tag}
                    className="tag"
                    style={{
                      backgroundColor: tagColor.background,
                      color: tagColor.text
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="progress-section">
            <div className="progress-header">
              <h3>Progress</h3>
              <span>{completedTasks} of {tasks.length} tasks completed</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {showProjectForm && (
          <ProjectForm
            project={project}
            onSubmit={handleProjectUpdate}
            onCancel={() => setShowProjectForm(false)}
          />
        )}

        <div className="tasks-section">
          <div className="tasks-header">
            <h2>Tasks</h2>
          </div>

          {showTaskForm && (
            <TaskForm
              initialData={editingTask || { ...initialTaskState, projectId: id! }}
              onSubmit={handleTaskSubmit}
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTask(null);
              }}
            />
          )}

          <TaskList
            tasks={tasks}
            onEdit={handleTaskEdit}
            onDelete={handleTaskDelete}
            onStatusChange={handleTaskStatusChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
