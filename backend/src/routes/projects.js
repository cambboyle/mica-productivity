const express = require('express');
const router = express.Router();
const { Project } = require('../models');
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { validate } = require('uuid');

// Validate UUID parameters
const validateParams = (req, res, next) => {
  const { id } = req.params;
  
  if (id && !validate(id)) {
    return res.status(400).json({ error: 'Invalid project ID format' });
  }
  
  next();
};

// All routes require authentication
router.use(auth);

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await projectController.getProjects(req.user.id);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get a single project
router.get('/projects/:id', validateParams, async (req, res) => {
  try {
    const project = await projectController.getProject(req.params.id, req.user.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create a new project
router.post('/projects', async (req, res) => {
  try {
    const project = await projectController.createProject({ ...req.body, userId: req.user.id });
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update a project
router.put('/projects/:id', validateParams, async (req, res) => {
  try {
    const updated = await projectController.updateProject(req.params.id, req.user.id, req.body);
    if (updated) {
      const updatedProject = await projectController.getProject(req.params.id, req.user.id);
      res.json(updatedProject);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete a project
router.delete('/projects/:id', validateParams, async (req, res) => {
  try {
    const deleted = await projectController.deleteProject(req.params.id, req.user.id);
    if (deleted) {
      res.json({ message: 'Project deleted successfully' });
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Reorder a project
router.put('/projects/:id/reorder', validateParams, async (req, res) => {
  try {
    const reordered = await projectController.reorderProject(req.params.id, req.user.id, req.body);
    if (reordered) {
      res.json({ message: 'Project reordered successfully' });
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    console.error('Error reordering project:', error);
    res.status(500).json({ error: 'Failed to reorder project' });
  }
});

module.exports = router;
