const { usersModel } = require('../models/index');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *       401:
 *         description: Invalid email or password
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
				message: 'Invalid email or password'
			});
		}

		// Compare the password with the hashed password
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password'
			});
		}

		// Generate a token
		const token = jwt.sign(
			{
				id: user._id,
				name: user.name
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
					email: user.email
				}
			}
		});
	} catch (err) {
		next(err); // Pass the error to the next middleware
	}
};

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *       400:
 *         description: Validation error or user already exists
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
			{
				id: user._id,
				name: user.name
			},
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
					email
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
