const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array().map((err) => err.msg).join(', '),
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['jobseeker', 'employer']).withMessage('Invalid role choice'),
  validate,
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const profileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().trim(),
  body('location').optional().trim(),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('experience').optional().trim(),
  body('company').optional().trim(),
  body('companyDescription').optional().trim(),
  body('website').optional().trim(),
  validate,
];

const passwordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
  profileValidation,
  passwordValidation,
};
