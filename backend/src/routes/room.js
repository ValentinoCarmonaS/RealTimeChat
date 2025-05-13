// backend/src/routes/room.js
const express = require('express');
const router = express.Router();
const { createRoom, getRooms, deleteRoom } = require('../controllers/room');
const { authenticate } = require('../middlewares/auth');

// All http://localhost:3000/api/room GET, POST, DELETE
router.get('/', authenticate, getRooms);
router.post('/', authenticate, createRoom);
router.delete('/:id', authenticate, deleteRoom);

module.exports = router;
