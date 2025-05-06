const { usersModel } = require('../models/index');
const jwt = require('jsonwebtoken');

/**
 * Function to handle user login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const loginUser = async (req, res, next) => {
	try {
		// Get the request body
		const { email, password } = req.body;

		// Find the user by email
		const user = await usersModel.findOne({ email });
		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password',
				error: new Error('Invalid email or password')
					.message
			});
		}

		// Compare the password with the hashed password
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password',
				error: new Error('Invalid email or password')
					.message
			});
		}

		// Generate a token
		const token = jwt.sign(
			{
				id: user._id,
				role: user.role
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		res.status(200).json({
			success: true,
			message: 'Login successful',
			data: {
				token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role
				}
			}
		});
	} catch (err) {
		next(err); // Pass the error to the next middleware
	}
};

/**
 * Function to handle user registration
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const registerUser = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;
		const existingUser = await usersModel.findOne({ email });
		// Check if the user already exists, is in the validation middleware

		const user = await usersModel.create({
			name,
			email,
			password
		});
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);
		res.status(201).json({
			success: true,
			message: 'User registered successfully',
			data: {
				token,
				user: {
					id: user._id,
					name,
					email,
					role: user.role
				}
			}
		});
	} catch (err) {
		next(err); // Pass the error to the next middleware
	}
};

module.exports = {
	loginUser,
	registerUser
};
