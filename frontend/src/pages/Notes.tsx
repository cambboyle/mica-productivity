import React from 'react';
import NotesContainer from '../components/Notes/NotesContainer';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Notes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Notes</h1>
        <p className="page-description">
          Create, organize, and manage your notes with a powerful rich text editor.
        </p>
      </div>
      <div className="page-content">
        <NotesContainer />
      </div>
    </div>
  );
};

export default Notes;
