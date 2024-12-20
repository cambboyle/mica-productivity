const express = require('express');
const router = express.Router();
const { Note } = require('../models');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateNote = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('icon').optional().isString().withMessage('Icon must be a string'),
  body('isFavorite').optional().isBoolean().withMessage('isFavorite must be a boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Get all notes for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { userId: req.user.id },
      order: [['updatedAt', 'DESC']]
    });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Get a specific note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ message: 'Error fetching note' });
  }
});

// Create a new note
router.post('/', [auth, validateNote], async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Error creating note' });
  }
});

// Update a note
router.put('/:id', [auth, validateNote], async (req, res) => {
  try {
    const note = await Note.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.update(req.body);
    res.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Error updating note' });
  }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Error deleting note' });
  }
});

module.exports = router;
