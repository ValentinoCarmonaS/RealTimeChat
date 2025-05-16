const { body, param, validationResult } = require('express-validator');
const { roomsModel } = require('../models/index');

const validateRoomInfo = [
	body('name')
		.exists()
		.withMessage('Room name is required')
		.isString()
		.withMessage('Room name must be a string')
		.trim()
		.isLength({ min: 2, max: 50 })
		.withMessage('Room name must be between 2 and 50 characters'),

	body('createdBy')
		.exists()
		.withMessage('User ID is required')
		.isMongoId()
		.withMessage('Invalid User ID format'),

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

const validateRoomCreation = [
	body('name')
		.trim()
		.custom(async value => {
			const room = await roomsModel.findOne({ name: value });
			if (room) {
				throw new Error('Room already exists');
			}
			return true;
		}),

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

const validateRoomId = [
	param('id')
		.exists()
		.withMessage('Room ID is required')
		.isMongoId()
		.withMessage('Invalid Room ID format'),

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
	validateRoomInfo,
	validateRoomCreation,
	validateRoomId
};
