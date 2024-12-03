const express = require('express');
const router = express.Router();
const UserPreferences = require('../models/UserPreferences');
const auth = require('../middleware/auth');

// Get user preferences
router.get('/', auth, async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({
      where: { userId: req.user.id }
    });

    if (!preferences) {
      // Create default preferences for the user
      const defaultPreferences = await UserPreferences.create({
        userId: req.user.id,
        accentColor: '#6366f1' // Default indigo color
      });
      return res.json(defaultPreferences);
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

    const [preferences, created] = await UserPreferences.findOrCreate({
      where: { userId: req.user.id },
      defaults: {
        userId: req.user.id,
        accentColor,
      }
    });

    if (!created) {
      // Update existing preferences
      await preferences.update({ accentColor });
    }

    res.json(preferences);
  } catch (err) {
    console.error('Error updating preferences:', err);
    res.status(500).json({ error: 'Server error while updating preferences' });
  }
});

module.exports = router;
