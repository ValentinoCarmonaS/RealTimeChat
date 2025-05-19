const request = require('supertest');
const { app } = require('../app');
const { usersModel } = require('../models/index');
const jwt = require('jsonwebtoken');

describe('App Endpoints', () => {
	let token;

	beforeAll(async () => {
		// Crear un usuario y generar un token para pruebas autenticadas
		await usersModel.deleteMany({});
		const user = await usersModel.create({
			name: 'Admin User',
			email: 'admin@example.com',
			password: 'password123',
			role: 'admin'
		});
		token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(async () => {
		await usersModel.deleteMany({});
	});

	it('should handle route not found', async () => {
		const res = await request(app)
			.get('/api/nonexistent')
			.set('Authorization', `Bearer ${token}`);
		expect(res.statusCode).toBe(404);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Route not found');
	});

	it('should reject request without authorization header', async () => {
		const res = await request(app).get('/api/users');
		expect(res.statusCode).toBe(401);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Authentication token required');
	});

	it('should reject request with invalid authorization header', async () => {
		const res = await request(app)
			.get('/api/users')
			.set('Authorization', 'Invalid token');
		expect(res.statusCode).toBe(401);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Authentication token required');
	});

	it('should reject request with invalid JWT token', async () => {
		const res = await request(app)
			.get('/api/users')
			.set('Authorization', 'Bearer invalid-token');
		expect(res.statusCode).toBe(401);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Invalid or expired token');
	});

	it('should reject request with expired JWT token', async () => {
		// Generar un token que expire inmediatamente
		const expiredToken = jwt.sign(
			{ id: 'test', role: 'admin' },
			process.env.JWT_SECRET,
			{ expiresIn: '0s' }
		);
		const res = await request(app)
			.get('/api/users')
			.set('Authorization', `Bearer ${expiredToken}`);
		expect(res.statusCode).toBe(401);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Invalid or expired token');
	});
});
