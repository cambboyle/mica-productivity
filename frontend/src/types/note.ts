export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  icon: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  tags: string[];
  icon: string;
  isFavorite: boolean;
}

export const initialNoteState: NoteFormData = {
  title: '',
  content: '',
  tags: [],
  icon: '📝',
  isFavorite: false
};
