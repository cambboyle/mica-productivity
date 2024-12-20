const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { UserPreferences } = require('../models');

// Get user preferences
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching preferences for user:', userId);
    
    let preferences = await UserPreferences.findOne({
      where: { userId }
    });

    if (!preferences) {
      console.log('No preferences found, creating defaults for user:', userId);
      // Create default preferences if none exist
      preferences = await UserPreferences.create({
        userId,
        accentColor: '#6366f1',
        colorPresets: []
      });
    }

    console.log('Sending preferences:', preferences.toJSON());
    res.json({
      accentColor: preferences.accentColor,
      presets: preferences.colorPresets
    });
  } catch (error) {
    console.error('Error in getPreferences:', error);
    // Check if the error is due to missing table
    if (error.name === 'SequelizeDatabaseError' && error.message.includes('relation "user_preferences" does not exist')) {
      // Return default preferences if table doesn't exist
      res.json({
        accentColor: '#6366f1',
        presets: []
      });
    } else {
      res.status(500).json({ 
        error: 'Server error while fetching preferences',
        details: error.message 
      });
    }
  }
});

// Update user preferences
router.put('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { accentColor, presets } = req.body;
    console.log('Updating preferences for user:', userId);
    console.log('Request body:', req.body);

    let preferences = await UserPreferences.findOne({
      where: { userId }
    });

    if (!preferences) {
      console.log('No preferences found, creating new preferences');
      preferences = await UserPreferences.create({
        userId,
        accentColor: accentColor || '#6366f1',
        colorPresets: presets || []
      });
    } else {
      console.log('Updating existing preferences');
      await preferences.update({
        accentColor: accentColor || preferences.accentColor,
        colorPresets: presets || preferences.colorPresets
      });
    }

    console.log('Updated preferences:', preferences.toJSON());
    res.json({
      accentColor: preferences.accentColor,
      presets: preferences.colorPresets
    });
  } catch (error) {
    console.error('Error in updatePreferences:', error);
    // Check if the error is due to missing table
    if (error.name === 'SequelizeDatabaseError' && error.message.includes('relation "user_preferences" does not exist')) {
      // Create the preferences with provided values
      try {
        const preferences = await UserPreferences.create({
          userId: req.user.id,
          accentColor: req.body.accentColor || '#6366f1',
          colorPresets: req.body.presets || []
        });
        res.json({
          accentColor: preferences.accentColor,
          presets: preferences.colorPresets
        });
      } catch (createError) {
        res.status(500).json({
          error: 'Server error while creating preferences',
          details: createError.message
        });
      }
    } else {
      res.status(500).json({
        error: 'Server error while updating preferences',
        details: error.message
      });
    }
  }
});

module.exports = router;
