import React from 'react';
import { Editor } from '@tiptap/react';
import {
  BoldIcon,
  ItalicIcon,
  Heading1Icon,
  Heading2Icon,
  TableIcon,
} from './EditorIcons';

interface EditorToolbarProps {
  editor: Editor | null;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="border-b border-gray-200 p-2 flex gap-2 flex-wrap">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('bold') ? 'bg-gray-200' : ''
        }`}
        title="Bold"
      >
        <BoldIcon />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('italic') ? 'bg-gray-200' : ''
        }`}
        title="Italic"
      >
        <ItalicIcon />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-2 self-center" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
        }`}
        title="Heading 1"
      >
        <Heading1Icon />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
        }`}
        title="Heading 2"
      >
        <Heading2Icon />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-2 self-center" />

      <button
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('table') ? 'bg-gray-200' : ''
        }`}
        title="Insert Table"
      >
        <TableIcon />
      </button>
    </div>
  );
};

export default EditorToolbar;
