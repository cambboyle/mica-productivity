import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface Note {
  id?: number;
  title: string;
  content: string;
  projectId?: number;
  taskId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const notesService = {
  async getNotes() {
    const response = await axios.get(`${API_URL}/api/notes`, {
      withCredentials: true
    });
    return response.data;
  },

  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await axios.post(`${API_URL}/api/notes`, note, {
      withCredentials: true
    });
    return response.data;
  },

  async updateNote(id: number, note: Partial<Note>) {
    const response = await axios.put(`${API_URL}/api/notes/${id}`, note, {
      withCredentials: true
    });
    return response.data;
  },

  async deleteNote(id: number) {
    await axios.delete(`${API_URL}/api/notes/${id}`, {
      withCredentials: true
    });
  },

  async getNotesByProject(projectId: number) {
    const response = await axios.get(`${API_URL}/api/notes/project/${projectId}`, {
      withCredentials: true
    });
    return response.data;
  },

  async getNotesByTask(taskId: number) {
    const response = await axios.get(`${API_URL}/api/notes/task/${taskId}`, {
      withCredentials: true
    });
    return response.data;
  }
};
