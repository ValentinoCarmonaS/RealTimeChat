const { messagesModel } = require('../models/index');

/**
 * @swagger
 * /api/message:
 *   get:
 *     summary: Get messages for a room
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the room
 *         example: 60c7b2f9e4b0c12345678909
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Maximum number of messages to return
 *         example: 50
 *     responses:
 *       200:
 *         description: Messages fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       user:
 *                         type: string
 *                       message:
 *                         type: string
 *                       room:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
const getMessages = async (req, res, next) => {
	try {
		const { room, limit } = req.query;

		const messages = await messagesModel
			.find({ room })
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
 * @swagger
 * /api/message:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - message
 *               - room
 *             properties:
 *               user:
 *                 type: string
 *                 example: 60c7b2f9e4b0c12345678908
 *               message:
 *                 type: string
 *                 example: Hello, world!
 *               room:
 *                 type: string
 *                 example: 60c7b2f9e4b0c12345678909
 *     responses:
 *       201:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     message:
 *                       type: string
 *                     room:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
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
