// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const { usersModel } = require('./models/index');
// const dbConnect = require('./config/mongo');

// const seedAdmin = async () => {
// 	try {
// 		await dbConnect();
// 		const existingAdmin = await usersModel.findOne({
// 			email: 'admin@example.com'
// 		});
// 		if (existingAdmin) {
// 			console.log('Admin already exists');
// 			return;
// 		}
// 		const hashedPassword = await bcrypt.hash(
// 			'your_secure_password',
// 			10
// 		);
// 		await usersModel.create({
// 			name: 'Admin User',
// 			email: 'admin@example.com',
// 			password: hashedPassword,
// 			role: 'admin'
// 		});
// 		console.log('Admin created successfully');
// 	} catch (err) {
// 		console.error('Error seeding admin:', err);
// 	} finally {
// 		mongoose.connection.close();
// 	}
// };

// seedAdmin();
