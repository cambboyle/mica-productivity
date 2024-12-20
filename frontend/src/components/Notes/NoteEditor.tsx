import React, { useEffect, useState } from 'react';
import { Note, NoteFormData, initialNoteState } from '../../types/note';
import RichTextEditor from '../RichTextEditor/RichTextEditor';

interface NoteEditorProps {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
  onSave: (note: NoteFormData) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ isOpen, note, onClose, onSave }) => {
  const [formData, setFormData] = useState<NoteFormData>(initialNoteState);

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        tags: note.tags,
        icon: note.icon,
        isFavorite: note.isFavorite
      });
    } else {
      setFormData(initialNoteState);
    }
  }, [note]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (newContent: string) => {
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  const handleTagsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      const newTag = e.currentTarget.value.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
        e.currentTarget.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {note ? 'Edit Note' : 'New Note'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="📝"
                className="w-16 text-2xl text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-color"
              />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Note Title"
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-color"
                required
              />
            </div>

            <div className="min-h-[400px] border rounded-lg">
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
              />
            </div>

            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tags (press Enter)"
                onKeyDown={handleTagsChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-color"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFavorite}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
                  className="w-4 h-4 text-accent-color"
                />
                <span>Favorite</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-accent-color text-white rounded-lg hover:bg-accent-hover transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
