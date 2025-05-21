const { query, body, validationResult } = require('express-validator');
const { messagesModel } = require('../models/index');

const validateGetMessage = [
	query('room')
		.exists()
		.withMessage('roomId is required')
		.isMongoId()
		.withMessage('roomId must be a valid MongoDB ObjectId'),

	query('limit')
		.optional()
		.isInt({ min: 1 })
		.withMessage('limit must be a positive integer'),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: 'Validation error',
				errors: errors.array()
			});
		}
		next();
	}
];

const validateCreateMessage = [
	body('user')
		.exists()
		.withMessage('userId is required')
		.isMongoId()
		.withMessage('userId must be a valid MongoDB ObjectId'),

	body('message')
		.exists()
		.withMessage('message is required')
		.isString()
		.withMessage('message must be a string')
		.isLength({ min: 1 })
		.withMessage('message must be at least 1 character long'),

	body('room')
		.exists()
		.withMessage('roomId is required')
		.isMongoId()
		.withMessage('roomId must be a valid MongoDB ObjectId'),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: 'Validation error',
				errors: errors.array()
			});
		}
		next();
	}
];

module.exports = {
	validateGetMessage,
	validateCreateMessage
};
