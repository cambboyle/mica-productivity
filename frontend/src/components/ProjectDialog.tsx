import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';
import { Project } from '../types/project';

interface ProjectDialogProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (project: Partial<Project>) => void;
}

interface ProjectFormData {
  title: string;
  description: string;
  color: string;
}

const initialFormState: ProjectFormData = {
  title: '',
  description: '',
  color: '#2196F3' // Default blue color
};

const predefinedColors = [
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#F44336', // Red
  '#FFC107', // Amber
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#FF9800', // Orange
  '#795548', // Brown
  '#607D8B', // Blue Grey
  '#E91E63', // Pink
];

const ProjectDialog: React.FC<ProjectDialogProps> = ({ open, project, onClose, onSave }) => {
  const [formData, setFormData] = useState<ProjectFormData>(initialFormState);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description || '',
        color: project.color || '#2196F3'
      });
    } else {
      setFormData(initialFormState);
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {project ? 'Edit Project' : 'New Project'}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
              autoFocus
            />

            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Color
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {predefinedColors.map((color) => (
                  <Box
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: color,
                      cursor: 'pointer',
                      border: formData.color === color ? '2px solid #000' : '2px solid transparent',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectDialog;
