import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  lastModified?: string;
}

interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: number) => void;
}

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

const getFirstLine = (text: string) => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  return {
    firstLine: lines[0] || '',
    hasMoreContent: lines.length > 1
  };
};

const truncateText = (text: string, maxLength: number = 100) => {
  const { firstLine, hasMoreContent } = getFirstLine(text);
  
  if (firstLine.length <= maxLength) {
    return { 
      displayText: firstLine,
      isTruncated: false,
      hasMoreContent
    };
  }

  // Find the last space before maxLength
  const lastSpace = firstLine.lastIndexOf(' ', maxLength);
  
  // If no space found, just cut at maxLength
  if (lastSpace === -1) {
    return {
      displayText: `${firstLine.slice(0, maxLength)}...`,
      isTruncated: true,
      hasMoreContent
    };
  }
  
  // Cut at the last space
  return {
    displayText: `${firstLine.slice(0, lastSpace)}...`,
    isTruncated: true,
    hasMoreContent
  };
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatTimeInfo = (note: Note) => {
  if (!note.lastModified) {
    return `Created ${formatDate(note.createdAt)}`;
  }
  
  return (
    `Created ${formatDate(note.createdAt)} • ` +
    `Modified ${formatDate(note.lastModified)}`
  );
};

const NotesList: React.FC<NotesListProps> = ({ notes, onEdit, onDelete }) => {
  return (
    <Paper elevation={3} sx={{ mt: 2 }}>
      <List>
        {notes.length === 0 ? (
          <ListItem>
            <ListItemText 
              primary={
                <Typography variant="body1" color="text.secondary">
                  No notes yet. Click "Add Note" to create one.
                </Typography>
              }
            />
          </ListItem>
        ) : (
          notes.map((note) => (
            <ListItem
              key={note.id}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': {
                  borderBottom: 'none'
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                py: 2
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                <Typography variant="h6" component="div" sx={{ flex: 1 }}>
                  {note.title}
                </Typography>
                <Box>
                  <IconButton onClick={() => onEdit(note)} size="small" sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(note.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              {(() => {
                const cleanContent = stripHtml(note.content);
                const { displayText, isTruncated, hasMoreContent } = truncateText(cleanContent);
                const showTooltip = isTruncated || hasMoreContent;
                const tooltipText = getFirstLine(cleanContent).firstLine;
                
                return (
                  <Tooltip 
                    title={showTooltip ? tooltipText : ''}
                    placement="bottom-start"
                    enterDelay={500}
                    arrow
                  >
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: showTooltip ? 'default' : 'auto',
                        '&::after': hasMoreContent ? {
                          content: '" [...]"',
                          color: 'text.disabled'
                        } : undefined
                      }}
                    >
                      {displayText}
                    </Typography>
                  </Tooltip>
                );
              })()}
              <Typography variant="caption" color="text.secondary" sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                {formatTimeInfo(note)}
              </Typography>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default NotesList;
