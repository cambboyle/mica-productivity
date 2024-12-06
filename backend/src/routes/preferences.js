const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const preferencesController = require('../controllers/preferencesController');

// Get user preferences
router.get('/', auth, preferencesController.getPreferences);

// Update user preferences
router.put('/', auth, preferencesController.updatePreferences);

module.exports = router;
