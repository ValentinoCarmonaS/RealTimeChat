const { messagesModel, roomsModel } = require('../models/index');

/**
 * Create a new room
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
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
 * Get all rooms
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
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
 * Delete a room
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
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
