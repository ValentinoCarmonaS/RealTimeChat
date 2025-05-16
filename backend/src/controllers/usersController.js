const { usersModel } = require('../models/index');

/**
 * Create a new user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const createUser = async (req, res, next) => {
	try {
		const body = req.body; // Get the request body
		const data = await usersModel.create(body); // Create a new user in the database
		res.status(201).json({
			success: true,
			message: 'User created successfully',
			// Return the created user data, excluding the password
			data: {
				_id: data._id,
				name: data.name,
				email: data.email
			}
		});
	} catch (error) {
		next(error); // Pass the error to the next middleware
	}
};

/**
 * Read all users
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const readUsers = async (req, res, next) => {
	try {
		const users = await usersModel.find(); // Find all users in the database
		res.status(200).json({
			success: true,
			message: 'Users fetched successfully',
			data: users
		}); // Return the list of users
	} catch (error) {
		next(error); // Pass the error to the next middleware
	}
};

/**
 * Read a user by ID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const readUser = async (req, res, next) => {
	try {
		// Get the user ID from the request parameters
		const { id } = req.params;
		const user = await usersModel.findById(id); // Find the user by ID

		// Check if user exists
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}

		res.status(200).json({
			success: true,
			message: 'User fetched successfully',
			data: user
		}); // Return the user data
	} catch (error) {
		next(error); // Pass the error to the next middleware
	}
};

/**
 * Update a user by ID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const updateUser = async (req, res, next) => {
	try {
		// Get the user ID from the request parameters
		const { id } = req.params;
		const body = req.body; // Get the request body
		const user = await usersModel.findByIdAndUpdate(id, body, {
			new: true,
			runValidators: true
		}); // Find and update the user by ID

		// Check if user exists
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}

		res.status(200).json({
			success: true,
			message: 'User updated successfully',
			data: user
		}); // Return the updated user data
	} catch (error) {
		next(error); // Pass the error to the next middleware
	}
};

/**
 * Delete a user by ID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const deleteUser = async (req, res, next) => {
	try {
		// Get the user ID from the request parameters
		const { id } = req.params;
		const user = await usersModel.findByIdAndDelete(id); // Find and delete the user by ID

		// Check if user exists
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}

		// Return a success response and the deleted user data
		res.status(200).json({
			success: true,
			message: 'User deleted successfully',
			data: user
		});
	} catch (error) {
		next(error); // Pass the error to the next middleware
	}
};

module.exports = {
	createUser,
	readUsers,
	readUser,
	updateUser,
	deleteUser
};
