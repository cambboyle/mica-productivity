const UserPreferences = require('../models/UserPreferences');

exports.getPreferences = async (req, res) => {
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
    res.status(500).json({ 
      error: 'Server error while fetching preferences',
      details: error.message 
    });
  }
};

exports.updatePreferences = async (req, res) => {
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
      console.log('Created new preferences:', preferences.toJSON());
    } else {
      console.log('Found existing preferences:', preferences.toJSON());
      console.log('Updating with:', { accentColor, presets });
      await preferences.update({
        accentColor: accentColor || preferences.accentColor,
        colorPresets: presets || preferences.colorPresets
      });
      console.log('Updated preferences:', preferences.toJSON());
    }

    res.json({
      accentColor: preferences.accentColor,
      presets: preferences.colorPresets
    });
  } catch (error) {
    console.error('Error in updatePreferences:', error);
    console.error('Request body:', req.body);
    res.status(500).json({ 
      error: 'Server error while updating preferences',
      details: error.message 
    });
  }
};
