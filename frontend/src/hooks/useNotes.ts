import { useState, useEffect } from 'react';
import { Note, NoteFormData } from '../types/note';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useNotes = (projectId?: string, taskId?: string) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      let url = '/api/notes';
      const params: Record<string, string> = {};
      
      if (projectId) params.project_id = projectId;
      if (taskId) params.task_id = taskId;
      
      const response = await api.get(url, { params });
      setNotes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async (noteData: NoteFormData) => {
    try {
      setIsLoading(true);
      // Add userId to the note data
      const noteWithUser = {
        ...noteData,
        userId: user?.id
      };
      const response = await api.post('/api/notes', noteWithUser);
      setNotes(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to add note');
      console.error('Error adding note:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateNote = async (id: string, noteData: Partial<NoteFormData>) => {
    try {
      setIsLoading(true);
      const response = await api.put(`/api/notes/${id}`, noteData);
      setNotes(prev => prev.map(n => n.id === id ? response.data : n));
      return response.data;
    } catch (err) {
      setError('Failed to update note');
      console.error('Error updating note:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      setIsLoading(true);
      await api.delete(`/api/notes/${id}`);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const linkToProject = async (noteId: string, projectId: string) => {
    try {
      setIsLoading(true);
      const response = await api.post(`/api/notes/${noteId}/projects/${projectId}`);
      setNotes(prev => prev.map(n => n.id === noteId ? response.data : n));
      return response.data;
    } catch (err) {
      setError('Failed to link project');
      console.error('Error linking project:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const unlinkFromProject = async (noteId: string, projectId: string) => {
    try {
      setIsLoading(true);
      const response = await api.delete(`/api/notes/${noteId}/projects/${projectId}`);
      setNotes(prev => prev.map(n => n.id === noteId ? response.data : n));
      return response.data;
    } catch (err) {
      setError('Failed to unlink project');
      console.error('Error unlinking project:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const linkToTask = async (noteId: string, taskId: string) => {
    try {
      setIsLoading(true);
      const response = await api.post(`/api/notes/${noteId}/tasks/${taskId}`);
      setNotes(prev => prev.map(n => n.id === noteId ? response.data : n));
      return response.data;
    } catch (err) {
      setError('Failed to link task');
      console.error('Error linking task:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const unlinkFromTask = async (noteId: string, taskId: string) => {
    try {
      setIsLoading(true);
      const response = await api.delete(`/api/notes/${noteId}/tasks/${taskId}`);
      setNotes(prev => prev.map(n => n.id === noteId ? response.data : n));
      return response.data;
    } catch (err) {
      setError('Failed to unlink task');
      console.error('Error unlinking task:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [projectId, taskId, user]); // Refetch when projectId, taskId, or user changes

  return {
    notes,
    isLoading,
    error,
    addNote,
    updateNote,
    deleteNote,
    linkToProject,
    unlinkFromProject,
    linkToTask,
    unlinkFromTask,
    refreshNotes: fetchNotes
  };
};
