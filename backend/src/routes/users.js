const express = require('express');
const router = express.Router();
const {
	validateUserId,
	validateUserInfo,
	validateUserCreation
} = require('../middlewares/validateUser');
const { authenticate } = require('../middlewares/auth');
const {
	createUser,
	readUsers,
	readUser,
	updateUser,
	deleteUser
} = require('../controllers/usersController');

// ALL http://localhost:3000/api/users GET, POST, PUT, DELETE

router.put('/:id', authenticate, validateUserId, validateUserInfo, updateUser); // Update a user by ID
router.delete('/:id', authenticate, validateUserId, deleteUser); // Delete a user by ID
router.post(
	'/',
	authenticate,
	validateUserInfo,
	validateUserCreation,
	createUser
); // Create a new user
router.get('/:id', authenticate, validateUserId, readUser); // Read a user by ID
router.get('/', authenticate, readUsers); // Read all users

module.exports = router;
