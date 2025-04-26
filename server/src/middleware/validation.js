import { body, validationResult } from 'express-validator';

export const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateUser = [
    body('name')
        .isLength({ min: 3, max: 60 })
        .withMessage('Name must be between 20 and 60 characters'),

    body('email')
        .isEmail()
        .withMessage('Must provide a valid email address'),

    body('password')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character'),

    body('address')
        .isLength({ max: 400 })
        .withMessage('Address must be at most 400 characters'),

    handleValidation
];

export const validateStore = [
    body('name')
        .isLength({ min: 3, max: 60 })
        .withMessage('Name must be between 20 and 60 characters'),

    body('email')
        .isEmail()
        .withMessage('Must provide a valid email address'),

    body('address')
        .isLength({ max: 400 })
        .withMessage('Address must be at most 400 characters'),

    handleValidation
];

export const validateRating = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be a number between 1 and 5'),

    handleValidation
];

export const validatePasswordUpdate = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),

    body('newPassword')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character'),

    handleValidation
];