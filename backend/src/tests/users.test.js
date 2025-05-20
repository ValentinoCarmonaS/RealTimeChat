const request = require('supertest');
const { app } = require('../app');
const { usersModel } = require('../models/index');
const jwt = require('jsonwebtoken');

describe('Users Endpoints', () => {
	let token;
	let userId;

	beforeAll(async () => {
		// Crear un usuario y generar un token para las pruebas
		const user = await usersModel.create({
			name: 'Admin User',
			email: 'admin@example.com',
			password: 'password123'
		});
		userId = user._id;
		token = jwt.sign(
			{ id: user._id, name: user.name },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);
	}, 30000); // 30 segundos

	afterEach(async () => {
		// Elimina usuarios adicionales, pero preserva el de beforeAll
		await usersModel.deleteMany({
			email: { $ne: 'admin@example.com' }
		});
	}, 30000); // 30 segundos

	afterAll(async () => {
		await usersModel.deleteMany({});
	}, 30000); // 30 segundos

	it('should create a new user', async () => {
		const res = await request(app)
			.post('/api/users')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Test User',
				email: 'testemail@example.com',
				password: 'password123'
			});
		expect(res.statusCode).toBe(201);
		expect(res.body.success).toBe(true);
		expect(res.body.message).toBe('User created successfully');
		expect(res.body.data.email).toBe('testemail@example.com');
		expect(res.body.data.name).toBe('Test User');
		expect(res.body.data._id).toBeDefined();
		expect(res.body.data.password).toBeUndefined(); // La contraseña no debe ser devuelta
	});

	it('should fetch all users', async () => {
		const res = await request(app)
			.get('/api/users')
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data).toBeInstanceOf(Array);
	});

	it('should fetch a user by ID', async () => {
		const res = await request(app)
			.get(`/api/users/${userId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data._id).toBe(userId.toString());
	});

	it('should update a user by ID', async () => {
		const res = await request(app)
			.put(`/api/users/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ name: 'Updated User' });
		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data.name).toBe('Updated User');
		expect(res.body.data._id).toBe(userId.toString());
	});

	it('should delete a user by ID', async () => {
		const res = await request(app)
			.delete(`/api/users/${userId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data._id).toBe(userId.toString());
	});

	it('should return 404 for non-existent user ID (read)', async () => {
		const res = await request(app)
			.get('/api/users/507f1f77bcf86cd799439011')
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(404);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('User not found');
	});

	it('should return 404 for non-existent user ID (update)', async () => {
		const res = await request(app)
			.put('/api/users/507f1f77bcf86cd799439011')
			.set('Authorization', `Bearer ${token}`)
			.send({ name: 'Updated User' });
		expect(res.statusCode).toBe(404);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('User not found');
	});

	it('should return 404 for non-existent user ID (delete)', async () => {
		const res = await request(app)
			.delete('/api/users/507f1f77bcf86cd799439011')
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(404);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('User not found');
	});

	it('should return 400 for invalid user ID (read)', async () => {
		const res = await request(app)
			.get('/api/users/invalid-id')
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation failed');
	});

	it('should return 400 for invalid user ID (update)', async () => {
		const res = await request(app)
			.put('/api/users/invalid-id')
			.set('Authorization', `Bearer ${token}`)
			.send({ name: 'Updated User' });
		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation failed');
	});

	it('should return 400 for invalid user ID (delete)', async () => {
		const res = await request(app)
			.delete('/api/users/invalid-id')
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation failed');
	});

	it('should handle validation error during user creation', async () => {
		const res = await request(app)
			.post('/api/users')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Test User',
				email: 'invalid-email', // Email inválido para forzar error de validación
				password: '' // Contraseña vacía para forzar error
			});
		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation failed');
		expect(res.body.errors[0].msg).toBe('Invalid email format');
		expect(res.body.errors[1].msg).toBe(
			'Password must be at least 6 characters long'
		);
		expect(res.body.errors[2].msg).toBe(
			'Password must contain at least one number'
		);
	});

	it('should handle internal server error during user creation', async () => {
		jest.spyOn(usersModel, 'create').mockImplementationOnce(() => {
			throw new Error('Database connection failed');
		});
		const res = await request(app)
			.post('/api/users')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Test User',
				email: 'test@example.com',
				password: 'password123'
			});
		expect(res.statusCode).toBe(500);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Internal Server Error');
	});

	it('should handle internal server error during user read', async () => {
		jest.spyOn(usersModel, 'find').mockImplementationOnce(() => {
			throw new Error('Database connection failed');
		});
		const res = await request(app)
			.get('/api/users')
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(500);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Internal Server Error');
	});

	it('should handle database failure in user read', async () => {
		jest.spyOn(usersModel, 'findById').mockImplementationOnce(
			() => {
				throw new Error('Database connection failed');
			}
		);
		const res = await request(app)
			.get('/api/users/507f1f77bcf86cd799439011')
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(500);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Internal Server Error');
	});

	it('should handle database failure in user update', async () => {
		jest.spyOn(
			usersModel,
			'findByIdAndUpdate'
		).mockImplementationOnce(() => {
			throw new Error('Database connection failed');
		});
		const res = await request(app)
			.put('/api/users/507f1f77bcf86cd799439011')
			.set('Authorization', `Bearer ${token}`)
			.send({ name: 'Updated User' });
		expect(res.statusCode).toBe(500);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Internal Server Error');
	});

	it('should handle database failure in user delete', async () => {
		jest.spyOn(
			usersModel,
			'findByIdAndDelete'
		).mockImplementationOnce(() => {
			throw new Error('Database connection failed');
		});
		const res = await request(app)
			.delete('/api/users/507f1f77bcf86cd799439011')
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(500);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Internal Server Error');
	});
});
