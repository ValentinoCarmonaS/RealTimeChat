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

		if (!name || typeof name !== 'string' || name.trim() === '') {
			return res.status(400).json({
				success: false,
				message: 'El nombre de la sala es requerido y debe ser un string'
			});
		}

		const existingRoom = await roomsModel.findOne({ name });
		if (existingRoom) {
			return res.status(400).json({
				success: false,
				message: 'La sala ya existe'
			});
		}

		const newRoom = new roomsModel({
			name,
			createdBy: userId
		});

		await newRoom.save();

		res.status(201).json({
			success: true,
			message: 'Sala creada exitosamente',
			room: newRoom
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
			message: 'Salas obtenidas exitosamente',
			rooms
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
				message: 'Sala no encontrada'
			});
		}

		if (room.createdBy.toString() !== userId.toString()) {
			return res.status(403).json({
				success: false,
				message: 'No tienes permiso para eliminar esta sala'
			});
		}

		await roomsModel.findByIdAndDelete(id);
		await messagesModel.deleteMany({ room: id });

		res.status(200).json({
			success: true,
			message: 'Sala eliminada exitosamente'
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
