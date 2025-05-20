const express = require('express');
const router = express.Router();
const {
	getMessages,
	createMessage
} = require('../controllers/messageController');
const {
	validateRoom,
	validateUser,
	validateMessage
} = require('../middlewares/validateMessage');
const { authenticate } = require('../middlewares/auth');

// All http://localhost:3000/api/message GET, POST

router.get('/', authenticate, validateRoom, getMessages);
router.post(
	'/',
	authenticate,
	validateRoom,
	validateUser,
	validateMessage,
	createMessage
);

module.exports = router;
