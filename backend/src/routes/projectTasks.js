const express = require('express');
const router = express.Router();
const { Task } = require('../models');
const auth = require('../middleware/auth');
const { validate } = require('uuid');

// Validate UUID parameters
const validateParams = (req, res, next) => {
  const { projectId, taskId } = req.params;
  
  if (!validate(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID format' });
  }
  
  if (taskId && !validate(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID format' });
  }
  
  next();
};

// Get all tasks for a project
router.get('/projects/:projectId/tasks', [auth, validateParams], async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: {
        projectId: req.params.projectId,
        userId: req.user.id
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    res.status(500).json({ error: 'Failed to fetch project tasks' });
  }
});

// Create a task for a project
router.post('/projects/:projectId/tasks', [auth, validateParams], async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      projectId: req.params.projectId,
      userId: req.user.id
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/projects/:projectId/tasks/:taskId', [auth, validateParams], async (req, res) => {
  try {
    const [updated] = await Task.update(req.body, {
      where: {
        id: req.params.taskId,
        projectId: req.params.projectId,
        userId: req.user.id
      }
    });
    if (updated) {
      const updatedTask = await Task.findOne({
        where: {
          id: req.params.taskId,
          projectId: req.params.projectId,
          userId: req.user.id
        }
      });
      res.json(updatedTask);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/projects/:projectId/tasks/:taskId', [auth, validateParams], async (req, res) => {
  try {
    const deleted = await Task.destroy({
      where: {
        id: req.params.taskId,
        projectId: req.params.projectId,
        userId: req.user.id
      }
    });
    if (deleted) {
      res.json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
