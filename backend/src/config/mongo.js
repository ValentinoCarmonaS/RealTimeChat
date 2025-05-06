// Description: This file contains the MongoDB connection logic.
const mongoose = require('mongoose');

const dbConnect = async () => {
	// A different DB_URI for testing than for development and production
	// For the moment, we are using the same DB_URI for development and production
	const DB_URI =
		process.env.NODE_ENV === 'test'
			? process.env.DB_URI_TEST
			: process.env.DB_URI;

	try {
		await mongoose.connect(DB_URI);
		console.log('\n**** MongoDB Connected ****\n');
	} catch (error) {
		console.log('\n**** MongoDB Connection ERROR ****\n');
	}
};

module.exports = dbConnect;
