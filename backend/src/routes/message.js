const express = require('express');
const router = express.Router();
const { getMessages, createMessage } = require('../controllers/messageController');

// All http://localhost:3000/api/message GET, POST

router.get('/', getMessages);
router.post('/', createMessage);