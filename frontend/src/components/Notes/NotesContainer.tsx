import React, { useState } from 'react';
import NoteCard from './NoteCard';
import NoteEditor from './NoteEditor';
import { Note, NoteFormData } from '../../types/note';
import { useNotes } from '../../hooks/useNotes';

const NotesContainer: React.FC = () => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { notes, isLoading, error, addNote, updateNote, deleteNote } = useNotes();

  const handleAddNote = () => {
    setSelectedNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setSelectedNote(null);
    setIsEditorOpen(false);
  };

  const handleSaveNote = async (noteData: NoteFormData) => {
    try {
      if (selectedNote) {
        await updateNote(selectedNote.id, noteData);
      } else {
        await addNote(noteData);
      }
      handleCloseEditor();
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      if (selectedNote?.id === noteId) {
        handleCloseEditor();
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg">
        Error loading notes: {error}
      </div>
    );
  }

  return (
    <div className="notes-container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddNote}
            className="btn-primary flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            New Note
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No notes yet. Create your first note!</p>
          <button
            onClick={handleAddNote}
            className="btn-secondary"
          >
            Create Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={() => handleEditNote(note)}
              onDelete={() => handleDeleteNote(note.id)}
            />
          ))}
        </div>
      )}

      <NoteEditor
        isOpen={isEditorOpen}
        note={selectedNote}
        onClose={handleCloseEditor}
        onSave={handleSaveNote}
      />
    </div>
  );
};

export default NotesContainer;
