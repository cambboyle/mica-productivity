import React from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import { Project } from '../types/project';
import { getTagColor } from '../utils/tagColors';

interface ProjectCardProps {
  project: Project;
  index: number;
  onUpdate: () => void;
  onClick?: () => void;
  viewMode?: 'grid' | 'list';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onUpdate, onClick, viewMode = 'grid' }) => {
  return (
    <Draggable draggableId={project.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`project-card ${snapshot.isDragging ? 'dragging' : ''}`}
          onClick={onClick}
          style={{
            ...provided.draggableProps.style,
            backgroundColor: project.color || 'var(--background-color)',
          }}
        >
          <div className="project-card-content">
            <h3 className="project-card-title">{project.title}</h3>
            {viewMode === 'grid' && (
              <p className="project-card-description">{project.description}</p>
            )}
            <div className="project-card-tags">
              {project.tags.map((tag, i) => {
                const tagColor = getTagColor(tag);
                return (
                  <span
                    key={i}
                    className="project-card-tag"
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
        </div>
      )}
    </Draggable>
  );
};

export default ProjectCard;
