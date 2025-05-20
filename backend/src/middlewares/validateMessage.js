const { param, body, validationResult } = require('express-validator');
const { messagesModel } = require('../models/index');

const validateRoom = [
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

const validateUser = [
	body('user')
		.exists()
		.withMessage('userId is required')
		.isMongoId()
		.withMessage('userId must be a valid MongoDB ObjectId'),

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

const validateMessage = [
	body('message')
		.exists()
		.withMessage('message is required')
		.isString()
		.withMessage('message must be a string')
		.isLength({ min: 1 })
		.withMessage('message must be at least 1 character long'),

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
	validateRoom,
	validateUser,
	validateMessage
};
