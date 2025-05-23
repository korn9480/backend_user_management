import { body } from "express-validator";

export const userValidator = [
   body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isString().withMessage('Role must be a string'),
]