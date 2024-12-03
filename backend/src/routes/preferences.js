const express = require('express');
const router = express.Router();
const UserPreferences = require('../models/UserPreferences');
const auth = require('../middleware/auth');

// Get user preferences
router.get('/', auth, async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({
      attributes: ['id', 'userId', 'accentColor', 'createdAt', 'updatedAt'],
      where: { userId: req.user.id },
      raw: true
    });

    if (!preferences) {
      // Create default preferences for the user
      const defaultPreferences = await UserPreferences.create(
        {
          userId: req.user.id,
          accentColor: '#6366f1' // Default indigo color
        },
        {
          returning: ['id', 'userId', 'accentColor', 'createdAt', 'updatedAt']
        }
      );
      return res.json(defaultPreferences.get({ plain: true }));
    }

    res.json(preferences);
  } catch (err) {
    console.error('Error fetching preferences:', err);
    res.status(500).json({ error: 'Server error while fetching preferences' });
  }
});

// Update user preferences
router.put('/', auth, async (req, res) => {
  try {
    const { accentColor } = req.body;

    if (!accentColor) {
      return res.status(400).json({ error: 'Accent color is required' });
    }

    // Validate color format
    if (!/^#[0-9A-F]{6}$/i.test(accentColor)) {
      return res.status(400).json({ error: 'Invalid color format. Must be a valid hex color (e.g., #FF0000)' });
    }

    let preferences = await UserPreferences.findOne({
      attributes: ['id', 'userId', 'accentColor', 'createdAt', 'updatedAt'],
      where: { userId: req.user.id },
      raw: true
    });

    if (!preferences) {
      preferences = await UserPreferences.create(
        {
          userId: req.user.id,
          accentColor
        },
        {
          returning: ['id', 'userId', 'accentColor', 'createdAt', 'updatedAt']
        }
      );
      return res.json(preferences.get({ plain: true }));
    }

    await UserPreferences.update(
      { accentColor },
      {
        where: { userId: req.user.id },
        returning: ['id', 'userId', 'accentColor', 'createdAt', 'updatedAt']
      }
    );

    // Fetch the updated preferences
    preferences = await UserPreferences.findOne({
      attributes: ['id', 'userId', 'accentColor', 'createdAt', 'updatedAt'],
      where: { userId: req.user.id },
      raw: true
    });

    res.json(preferences);
  } catch (err) {
    console.error('Error updating preferences:', err);
    res.status(500).json({ error: 'Server error while updating preferences' });
  }
});

module.exports = router;
