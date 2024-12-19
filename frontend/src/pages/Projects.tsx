import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, DropResult, DroppableProvided } from '@hello-pangea/dnd';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './styles/projects.css';
import { Project } from '../types/project';
import ProjectForm from '../components/ProjectForm';
import ProjectCard from '../components/ProjectCard';
import ProjectTasks from './ProjectTasks';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to fetch projects. Please try again.');
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProjects(items);

    try {
      await api.put(`/projects/${reorderedItem.id}`, {
        ...reorderedItem,
        order: result.destination.index,
      });
    } catch (error) {
      console.error('Error updating project order:', error);
      fetchProjects();
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => project.tags.includes(tag));
    return (project.status !== 'archived') && matchesSearch && matchesTags;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div className="header-content">
          <h1>Projects</h1>
          <div className="controls-row">
            <div className="view-controls">
              <button
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </button>
              <button
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
            </div>
            <button
              className="create-button"
              onClick={() => setShowForm(true)}
            >
              Create Project
            </button>
          </div>
          <div className="filters">
            <div className="filters-section">
              <label className="filter-label">Search</label>
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="filters-section">
              <label className="filter-label">Filter by tags</label>
              <div className="tags-filter">
                <div className="multi-select-dropdown">
                  <div 
                    className="multi-select-header"
                    onClick={() => setIsTagsOpen(!isTagsOpen)}
                  >
                    {selectedTags.length > 0 ? (
                      <div className="selected-tags">
                        {selectedTags.map(tag => (
                          <span key={tag} className="selected-tag">
                            {tag}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTags(selectedTags.filter(t => t !== tag));
                              }}
                              className="remove-tag"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="placeholder">Select tags...</span>
                    )}
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  {isTagsOpen && (
                    <div className="tags-dropdown">
                      {Array.from(new Set(projects.flatMap(project => project.tags)))
                        .sort((a, b) => a.localeCompare(b))
                        .map(tag => (
                          <div
                            key={tag}
                            className={`tag-option ${selectedTags.includes(tag) ? 'selected' : ''}`}
                            onClick={() => {
                              if (selectedTags.includes(tag)) {
                                setSelectedTags(selectedTags.filter(t => t !== tag));
                              } else {
                                setSelectedTags([...selectedTags, tag]);
                              }
                            }}
                          >
                            {tag}
                            {selectedTags.includes(tag) && <span className="check">✓</span>}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                {selectedTags.length > 0 && (
                  <button 
                    onClick={() => setSelectedTags([])} 
                    className="clear-tags-button"
                    title="Clear selected tags"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`projects-grid ${viewMode}`}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="projects" direction={viewMode === 'grid' ? 'horizontal' : 'vertical'}>
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`projects-list ${viewMode}`}
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={{
                      ...project,
                      userId: project.userId || user?.id || '',
                      createdAt: project.createdAt || new Date().toISOString(),
                      updatedAt: project.updatedAt || new Date().toISOString()
                    }}
                    index={index}
                    onClick={() => handleProjectClick(project.id)}
                    onUpdate={fetchProjects}
                    viewMode={viewMode}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {showForm && (
        <ProjectForm
          onSubmit={async (data: Partial<Project>) => {
            try {
              await api.post('/projects', {
                ...data,
                userId: user?.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
              fetchProjects();
              setShowForm(false);
              toast.success('Project created successfully!');
            } catch (error) {
              console.error('Error creating project:', error);
              toast.error('Failed to create project. Please try again.');
            }
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Projects;
