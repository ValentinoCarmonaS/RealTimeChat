const request = require('supertest');
const { app } = require('../app');
const { roomsModel, usersModel } = require('../models/index');
const jwt = require('jsonwebtoken');
const { create } = require('../models/nosql/user');

describe('Room Endpoints', () => {
	let token;
	let userId;
	const roomName = 'Test Room';

	beforeAll(async () => {
		await roomsModel.deleteMany({});
		await usersModel.deleteMany({});
		const user = await usersModel.create({
			name: 'TestUser',
			email: 'testUser@email.com',
			password: 'password123'
		});
		userId = user._id;
		token = jwt.sign(
			{
				id: userId,
				name: user.name
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);
	});
	afterEach(async () => {
		await roomsModel.deleteMany({});
		await usersModel.deleteMany({});
	});
	afterAll(async () => {
		await roomsModel.deleteMany({});
		await usersModel.deleteMany({});
	});

	it('should create a new room', async () => {
		const res = await request(app)
			.post('/api/room')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: roomName,
				createdBy: userId
			});

		expect(res.statusCode).toBe(201);
		expect(res.body.success).toBe(true);
		expect(res.body.message).toBe('Room created successfully');
		expect(res.body.data.name).toBe(roomName);
		expect(res.body.data.createdBy).toBe(userId.toString());
	});

	it('should fetch all rooms', async () => {
		const res = await request(app)
			.get('/api/room')
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.message).toBe('Rooms fetched successfully');
		expect(res.body.data).toBeInstanceOf(Array);
	});

	it('should delete a room', async () => {
		const createRes = await request(app)
			.post('/api/room')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: roomName,
				createdBy: userId
			});

		const res = await request(app)
			.delete(`/api/room/${createRes.body.data._id}`)
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.message).toBe('Room deleted successfully');
	});

	it('should return 404 for non-existing room', async () => {
		const res = await request(app)
			.delete('/api/room/123456789012345678901234')
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toBe(404);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Room not found');
	});

	it('should return 400 for invalid room ID', async () => {
		const res = await request(app)
			.delete('/api/room/invalidRoomId')
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation failed');
		expect(res.body.errors[0].msg).toBe('Invalid Room ID format');
	});

	it('should return 400 for a non-string name', async () => {
		const res = await request(app)
			.post('/api/room')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 12345,
				createdBy: userId
			});

		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation failed');
		expect(res.body.errors[0].msg).toBe(
			'Room name must be a string'
		);
	});

	it('should return 400 for a room name that is too short', async () => {
		const res = await request(app)
			.post('/api/room')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'A',
				createdBy: userId
			});

		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation failed');
		expect(res.body.errors[0].msg).toBe(
			'Room name must be between 2 and 50 characters'
		);
	});

	it('should return 400 for a room name that is too long', async () => {
		const res = await request(app)
			.post('/api/room')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'A'.repeat(51),
				createdBy: userId
			});

		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation failed');
		expect(res.body.errors[0].msg).toBe(
			'Room name must be between 2 and 50 characters'
		);
	});

	it('should return 400 for invalid user ID', async () => {
		const res = await request(app)
			.post('/api/room')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: roomName,
				createdBy: 'invalidUserId'
			});

		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation failed');
		expect(res.body.errors[0].msg).toBe('Invalid User ID format');
	});

	it('should return 404 for missing roomId', async () => {
		const res = await request(app)
			.delete('/api/room/')
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toBe(404);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Route not found');
	});

	it('should return 400 for missing room name', async () => {
		const res = await request(app)
			.post('/api/room')
			.set('Authorization', `Bearer ${token}`)
			.send({
				createdBy: userId
			});

		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation failed');
		expect(res.body.errors[0].msg).toBe('Room name is required');
	});

	it('should return 400 for missing createdBy ', async () => {
		const res = await request(app)
			.post('/api/room')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: roomName
			});

		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation failed');
		expect(res.body.errors[0].msg).toBe('User ID is required');
	});

	it('should return 400 for already existing room name', async () => {
		await request(app)
			.post('/api/room')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: roomName,
				createdBy: userId
			});

		const res = await request(app)
			.post('/api/room')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: roomName,
				createdBy: userId
			});

		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation failed');
		expect(res.body.errors[0].msg).toBe('Room already exists');
	});

	it('should return 401 for unauthorized user', async () => {
		const res = await request(app).get('/api/room');

		expect(res.statusCode).toBe(401);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Authentication token required');
	});

	it('should return 401 for invalid token', async () => {
		const res = await request(app)
			.get('/api/room')
			.set('Authorization', `Bearer invalidToken`);

		expect(res.statusCode).toBe(401);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Invalid or expired token');
	});
});
