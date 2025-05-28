const { messagesModel, roomsModel } = require('../models/index');

/**
 * @swagger
 * /api/room:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: General Chat
 *     responses:
 *       201:
 *         description: Room created successfully
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
 *                     name:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
const createRoom = async (req, res, next) => {
	try {
		const { name } = req.body;
		const userId = req.user.id;

		const newRoom = await roomsModel.create({
			name,
			createdBy: userId
		});

		res.status(201).json({
			success: true,
			message: 'Room created successfully',
			data: newRoom
		});
	} catch (error) {
		next(error);
	}
};

/**
 * @swagger
 * /api/room:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rooms fetched successfully
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
 *                       name:
 *                         type: string
 *                       createdBy:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
const getRooms = async (req, res, next) => {
	try {
		const rooms = await roomsModel.find();
		res.status(200).json({
			success: true,
			message: 'Rooms fetched successfully',
			data: rooms
		});
	} catch (error) {
		next(error);
	}
};

/**
 * @swagger
 * /api/room/{id}:
 *   delete:
 *     summary: Delete a room by ID
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the room to delete
 *         example: 60c7b2f9e4b0c12345678909
 *     responses:
 *       200:
 *         description: Room deleted successfully
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
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Room not found
 */
const deleteRoom = async (req, res, next) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		const room = await roomsModel.findById(id);
		if (!room) {
			return res.status(404).json({
				success: false,
				message: 'Room not found'
			});
		}

		await roomsModel.findByIdAndDelete(id);
		await messagesModel.deleteMany({ room: id });

		res.status(200).json({
			success: true,
			message: 'Room deleted successfully',
			data: null
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createRoom,
	getRooms,
	deleteRoom
};
