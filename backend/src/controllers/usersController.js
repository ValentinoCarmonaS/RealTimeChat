const { usersModel } = require('../models/index');

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *         description: User created successfully
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
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
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
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *       401:
 *         description: Unauthorized
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
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *         example: 60c7b2f9e4b0c12345678908
 *     responses:
 *       200:
 *         description: User fetched successfully
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
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
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
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update
 *         example: 60c7b2f9e4b0c12345678908
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
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
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete
 *         example: 60c7b2f9e4b0c12345678908
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
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
