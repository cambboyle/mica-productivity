const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateNote = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 255 })
    .withMessage('Title must be less than 255 characters'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((value) => {
      if (!value.every((tag) => typeof tag === 'string')) {
        throw new Error('All tags must be strings');
      }
      return true;
    }),
  
  body('icon')
    .optional()
    .isString()
    .withMessage('Icon must be a string')
    .isLength({ max: 10 })
    .withMessage('Icon must be less than 10 characters'),
  
  body('isFavorite')
    .optional()
    .isBoolean()
    .withMessage('isFavorite must be a boolean'),

  handleValidationErrors,
];

module.exports = {
  validateNote,
};
