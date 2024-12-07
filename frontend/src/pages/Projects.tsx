import React from 'react';
import './styles/projects.css';

const Projects: React.FC = () => {
  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <button className="create-project-btn">Create New Project</button>
      </div>
      <div className="projects-content">
        <p>Projects feature coming soon! Stay tuned for updates.</p>
      </div>
    </div>
  );
};

export default Projects;
