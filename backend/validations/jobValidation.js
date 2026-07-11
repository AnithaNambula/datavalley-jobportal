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

const jobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('type').optional().isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']).withMessage('Invalid job type'),
  body('experience').optional().isIn(['Entry Level', '1-2 years', '3-5 years', '5+ years']).withMessage('Invalid experience range'),
  body('category').optional().isIn([
    'Technology',
    'Marketing',
    'Finance',
    'Healthcare',
    'Education',
    'Design',
    'Sales',
    'Engineering',
    'Other',
  ]).withMessage('Invalid category choice'),
  body('salary.min').optional().isNumeric().withMessage('Minimum salary must be a number'),
  body('salary.max').optional().isNumeric().withMessage('Maximum salary must be a number'),
  body('requirements').optional().isArray().withMessage('Requirements must be an array of strings'),
  body('skills').optional().isArray().withMessage('Skills must be an array of strings'),
  validate,
];

module.exports = { jobValidation };
