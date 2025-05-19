const mongoose = require('mongoose');
const dbConnect = require('../config/mongo');
const { s } = require('../app');

beforeAll(async () => {
	// Connect to the database before running tests
	try {
		await dbConnect();
	} catch (error) {
		console.error('Failed to connect to MongoDB:', error);
		throw error;
	}
});

afterAll(async () => {
	await mongoose.connection.dropDatabase(); // Limpia toda la base de datos
	// Close the connection to the database
	await mongoose.connection.close();
	await s.close(); // Cierra el servidor
});
