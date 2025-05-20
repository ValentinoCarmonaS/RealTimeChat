const { messagesModel } = require('../models/index');

/**
 * Function to get all messages
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getMessages = async (req, res, next) => {
	try {
		const { roomId, limit } = req.query;

		const messages = await messagesModel
			.find({ roomId })
			.sort({ timestamp: -1 })
			.limit(limit ? parseInt(limit) : 50);

		res.status(200).json({
			success: true,
			message: 'Messages fetched successfully',
			data: messages
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Function to create a new message
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const createMessage = async (req, res, next) => {
	try {
		const { user, message, room } = req.body;

		const newMessage = await messagesModel.create({
			user,
			message,
			room
		});

		res.status(201).json({
			success: true,
			message: 'Message created successfully',
			data: newMessage
		});
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getMessages,
	createMessage
};
