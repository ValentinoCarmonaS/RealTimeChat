const bcrypt = require('bcrypt');

/**
 * Function to compare a password with a hashed password
 * @param {*} candidatePassword
 * @param {*} hashedPassword
 */
const comparePassword = async (candidatePassword, hashedPassword) => {
	return await bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = {
	comparePassword
};
