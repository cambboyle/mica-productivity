import React from 'react';
import { Note } from '../../types/note';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete();
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-4"
      onClick={onEdit}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{note.icon}</span>
          <h3 className="text-lg font-semibold truncate">{note.title}</h3>
        </div>
        {note.isFavorite && (
          <span className="text-yellow-500">★</span>
        )}
      </div>

      <div 
        className="text-gray-600 line-clamp-3 mb-3"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />

      <div className="flex flex-wrap gap-2">
        {note.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
