import { body } from 'express-validator';

export const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginRules = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isString().withMessage('Password must be a string')
    .notEmpty().withMessage('Password is required'),
];

export const changePasswordRules = [
  body('currentPassword').isString().notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isString().withMessage('New password must be a string')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];