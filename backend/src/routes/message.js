const express = require('express');
const router = express.Router();
const {
	getMessages,
	createMessage
} = require('../controllers/messageController');
const {
	validateCreateMessage,
	validateGetMessage
} = require('../middlewares/validateMessage');
const { authenticate } = require('../middlewares/auth');

// All http://localhost:3000/api/message GET, POST

router.get('/', authenticate, validateGetMessage, getMessages);
router.post(
	'/',
	authenticate,
	validateCreateMessage,
	createMessage
);

module.exports = router;
