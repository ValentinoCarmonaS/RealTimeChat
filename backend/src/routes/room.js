// backend/src/routes/room.js
const express = require('express');
const router = express.Router();
const {
	createRoom,
	getRooms,
	deleteRoom
} = require('../controllers/roomController');
const { authenticate } = require('../middlewares/auth');
const {
	validateRoomInfo,
	validateRoomCreation,
	validateRoomId
} = require('../middlewares/validateRoom');

// All http://localhost:3000/api/room GET, POST, DELETE
router.get('/', authenticate, getRooms);
router.post(
	'/',
	authenticate,
	validateRoomInfo,
	validateRoomCreation,
	createRoom
);
router.delete('/:id', authenticate, validateRoomId, deleteRoom);

module.exports = router;
