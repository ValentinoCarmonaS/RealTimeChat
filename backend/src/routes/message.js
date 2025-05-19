const express = require('express');
const router = express.Router();
const {
	getMessages,
	createMessage
} = require('../controllers/messageController');
const {
	validateRoomId,
	validateUserId,
	validateMessage
} = require('../middlewares/validateMessage');
const { authenticate } = require('../middlewares/auth');

// All http://localhost:3000/api/message GET, POST

router.get('/', authenticate, validateRoomId, getMessages);
router.post(
	'/',
	authenticate,
	validateRoomId,
	validateUserId,
	validateMessage,
	createMessage
);

module.exports = router;