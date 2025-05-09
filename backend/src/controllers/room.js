const Room = require('../models/room');

/**
 * Create a new room
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const createRoom = async (req, res, next) => {
	try {
		const name = req.body;
		const userId = req.user._id;

		// Chech if the room already exists
		const existingRoom = await Room.findOne({ name: name });
		if (existingRoom) {
			return res.status(400).json({
				success: false,
				message: 'Room already exists',
				error: new Error('Room already exists')
			});
		}

		const newRoom = new Room({
			name: name,
			createdBy: userId
		});

		await newRoom.save();

		res.status(201).json({
			success: true,
			message: 'Room created successfully',
			room: newRoom
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Get all rooms
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getRooms = async (req, res, next) => {
	try {
		const rooms = await Room.find();
		res.status(200).json({
			success: true,
			message: 'Rooms fetched successfully',
			rooms: rooms
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Delete a room
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const deleteRoom = async (req, res, next) => {
	try {
		const { id } = req.params;
		const room = await Room.findByIdAndDelete(id);

		if (!room) {
			return res.status(404).json({
				success: false,
				message: 'Room not found',
				error: new Error('Room not found')
			});
		}

		res.status(200).json({
			success: true,
			message: 'Room deleted successfully',
			room: room
		});
	} catch (error) {
		next(error);
	}
};
