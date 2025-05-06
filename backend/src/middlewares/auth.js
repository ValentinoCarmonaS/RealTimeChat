const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT
 * Checks for a valid JWT in the Authorization header
 * Attaches decoded user data to req.user if valid
 * Returns 401 for invalid or missing tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const authenticate = async (req, res, next) => {
	try {
		// Extract token from Authorization header (Bearer <token>)
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({
				success: false,
				message: 'Authentication token required',
				error: new Error(
					'Authentication token required'
				).message
			});
		}

		const token = authHeader.split(' ')[1];
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// Attach user data to request
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: 'Invalid or expired token',
			error: error.message
		});
	}
};

module.exports = {
	authenticate
};
