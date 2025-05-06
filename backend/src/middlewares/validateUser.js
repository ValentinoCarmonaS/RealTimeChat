// middlewares/validateUserUpdate.js
const { body, param, validationResult } = require('express-validator');
const { usersModel } = require('../models/index');

/**
 * Middleware to validate user update input
 * Ensures name, email, password, and role fields are valid if provided
 * Uses express-validator for validation
 * Returns 400 with error messages if validation fails
 * Calls next middleware if validation passes
 */
const validateUserInfo = [
	// Validation rules
	body('name')
		.optional()
		.trim()
		.isLength({ min: 2, max: 50 })
		.withMessage('Name must be between 2 and 50 characters'),
	body('email')
		.optional()
		.isEmail()
		.withMessage('Invalid email format')
		.normalizeEmail()
		.custom(async (value, { req }) => {
			const user = await usersModel.findOne({ email: value });
			if (user && user._id.toString() !== req.params.id) {
				throw new Error('Email already exists');
			}
			return true;
		}),
	body('password')
		.optional()
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long')
		.matches(/[0-9]/)
		.withMessage('Password must contain at least one number'),
	body('role')
		.optional()
		.isIn(['user', 'admin'])
		.withMessage('Role must be either user or admin'),

	// Handle validation results
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: 'Validation failed',
				errors: errors.array()
			});
		}
		next();
	}
];

/**
 * Middleware to validate user ID parameter
 * Ensures the ID is a valid MongoDB ObjectID
 * Returns 400 with error messages if validation fails
 * Calls next middleware if validation passes
 */

const validateUserId = [
	// Check if the user ID is provided
	param('id')
		.exists()
		.withMessage('User ID is required')
		.trim()
		.isLength({ min: 24, max: 24 })
		.withMessage('Error invalid user ID length'),
	// Validation rule
	param('id').isMongoId().withMessage('Invalid user ID'),

	// Handle validation results
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: 'Validation failed',
				errors: errors.array()
			});
		}
		next();
	}
];

/**
 * Middleware to validate user creation input
 * Ensures name, email, password, and role fields are valid
 * Uses express-validator for validation
 * Returns 400 with error messages if validation fails
 * Calls next middleware if validation passes
 */

const validateUserCreation = [
	// Validation rules
	body('name').notEmpty().withMessage('Name is required'),
	body('email').notEmpty().withMessage('Email is required'),
	body('password').notEmpty().withMessage('Password is required'),

	// Handle validation results
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: 'Validation failed',
				errors: errors.array()
			});
		}
		next();
	}
];

module.exports = {
	validateUserInfo,
	validateUserId,
	validateUserCreation
};
