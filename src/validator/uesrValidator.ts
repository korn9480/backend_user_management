import { body } from "express-validator";

export const userValidator = [
   body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  body('role_id')
    .notEmpty().withMessage('Role ID is required')
    .isInt({ min: 1 }).withMessage('Role ID must be a positive integer')
];

// Validator for updating user (password and role_id are optional)
export const userUpdateValidator = [
   body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),

  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  body('role_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Role ID must be a positive integer')
];
