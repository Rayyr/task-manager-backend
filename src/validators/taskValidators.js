import { body, param } from 'express-validator';
import { TASK_STATUS, TASK_PRIORITY } from '../config/constants.js';

export const idRule = param('id').isMongoId().withMessage('Invalid task id');

// Rules shared by create and update (each field is optional)
const fieldRules = [
  body('description')
    .optional({ values: 'null' })
    .isString().withMessage('Description must be a string')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(TASK_STATUS).withMessage(`Status must be one of: ${TASK_STATUS.join(', ')}`),
  body('priority')
    .optional()
    .isIn(TASK_PRIORITY).withMessage(`Priority must be one of: ${TASK_PRIORITY.join(', ')}`),
  body('dueDate')
    .optional({ values: 'null' })
    .isISO8601().withMessage('dueDate must be a valid date, e.g. 2026-12-31')
    .toDate(),
  body('tags')
    .optional()
    .isArray({ max: 10 }).withMessage('tags must be an array of at most 10 items'),
  body('tags.*')
    .isString().withMessage('Each tag must be a string')
    .trim()
    .isLength({ min: 1, max: 30 }).withMessage('Each tag must be 1 to 30 characters'),
];

export const createTaskRules = [
  body('title')
    .isString().withMessage('Title must be a string')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),
  ...fieldRules,
];

export const updateTaskRules = [
  body('title')
    .optional()
    .isString().withMessage('Title must be a string')
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),
  ...fieldRules,
];

export const statusRules = [
  body('status')
    .isIn(TASK_STATUS).withMessage(`Status must be one of: ${TASK_STATUS.join(', ')}`),
];