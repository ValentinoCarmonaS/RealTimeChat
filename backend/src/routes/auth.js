const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/auth');
const {
	validateUserCreation,
	validateUserInfo
} = require('../middlewares/validateUser');

router.use(express.json());

// All http://localhost:3000/api/auth/login
// All http://localhost:3000/api/auth/register

router.post('/login', loginUser);
router.post('/register', validateUserInfo, validateUserCreation, registerUser);

module.exports = router;
