export interface TagColor {
  id: string;
  name: string;
  background: string;
  text: string;
}

export const TAG_COLORS: TagColor[] = [
  {
    id: 'blue',
    name: 'Blue',
    background: '#E3F2FD',
    text: '#1976D2'
  },
  {
    id: 'green',
    name: 'Green',
    background: '#E8F5E9',
    text: '#2E7D32'
  },
  {
    id: 'purple',
    name: 'Purple',
    background: '#F3E5F5',
    text: '#7B1FA2'
  },
  {
    id: 'orange',
    name: 'Orange',
    background: '#FFF3E0',
    text: '#E65100'
  },
  {
    id: 'red',
    name: 'Red',
    background: '#FFEBEE',
    text: '#C62828'
  },
  {
    id: 'teal',
    name: 'Teal',
    background: '#E0F2F1',
    text: '#00796B'
  },
  {
    id: 'pink',
    name: 'Pink',
    background: '#FCE4EC',
    text: '#C2185B'
  },
  {
    id: 'brown',
    name: 'Brown',
    background: '#EFEBE9',
    text: '#4E342E'
  },
  {
    id: 'gray',
    name: 'Gray',
    background: '#F5F5F5',
    text: '#424242'
  },
  {
    id: 'indigo',
    name: 'Indigo',
    background: '#E8EAF6',
    text: '#283593'
  }
];

// Get a consistent color for a tag based on its name
export const getTagColor = (tagName: string): TagColor => {
  // Create a simple hash of the tag name
  const hash = tagName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Use the hash to pick a color from the array
  const index = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[index];
};
