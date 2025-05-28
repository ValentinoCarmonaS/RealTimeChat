const request = require('supertest');
const { app } = require('../app');
const { messagesModel, usersModel, roomsModel } = require('../models/index');
const jwt = require('jsonwebtoken');
const message = require('../models/nosql/message');

describe('Message Endpoints', () => {
	let token;
	let userId;
	let roomId;
	const messageContent = 'Hello, this is a test message';

	beforeAll(async () => {
		await messagesModel.deleteMany({});
		await usersModel.deleteMany({});
		await roomsModel.deleteMany({});
		const user = await usersModel.create({
			name: 'TestUser',
			email: 'testuser@email.com',
			password: 'password123'
		});
		userId = user._id;
		token = jwt.sign(
			{
				id: user._id,
				name: user.name
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);
		const room = await roomsModel.create({
			name: 'TestRoom',
			createdBy: userId
		});
		roomId = room._id;
	});

	afterEach(async () => {
		await messagesModel.deleteMany({});
		await usersModel.deleteMany({});
		await roomsModel.deleteMany({});
	});

	afterAll(async () => {
		await messagesModel.deleteMany({});
		await usersModel.deleteMany({});
		await roomsModel.deleteMany({});
	});

	it('should create a new message', async () => {
		const res = await request(app)
			.post('/api/message')
			.set('Authorization', `Bearer ${token}`)
			.send({
				room: roomId,
				user: userId,
				message: messageContent
			});

		expect(res.statusCode).toBe(201);
		expect(res.body.success).toBe(true);
		expect(res.body.message).toBe('Message created successfully');
		expect(res.body.data.message).toBe(messageContent);
		expect(res.body.data.room).toBe(roomId.toString());
		expect(res.body.data.user).toBe(userId.toString());
	});

	it('should fetch messages from a room', async () => {
		await messagesModel.create({
			room: roomId,
			user: userId,
			message: messageContent
		});

		const res = await request(app)
			.get(`/api/message?room=${roomId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.message).toBe('Messages fetched successfully');
		expect(res.body.data.length).toBe(1);
		expect(res.body.data[0].message).toBe(messageContent);
		expect(res.body.data[0].room).toBe(roomId.toString());
		expect(res.body.data[0].user).toBe(userId.toString());
	});

	it('should return 400 if roomId is not provided', async () => {
		const res = await request(app)
			.get('/api/message')
			.set('Authorization', `Bearer ${token}`)
			.query({});

		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation error');
		expect(res.body.errors[0].msg).toBe('roomId is required');
	});

	it('should return 401 if token is not provided on GET', async () => {
		const res = await request(app)
			.get('/api/message')
			.query({ room: roomId });

		expect(res.statusCode).toBe(401);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Authentication token required');
	});

	it('should return 400 if userId is not provided', async () => {
		const res = await request(app)
			.post('/api/message')
			.set('Authorization', `Bearer ${token}`)
			.send({
				room: roomId,
				message: messageContent
			});

		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation error');
		expect(res.body.errors[0].msg).toBe('userId is required');
	});

	it('should return 400 if message is not provided', async () => {
		const res = await request(app)
			.post('/api/message')
			.set('Authorization', `Bearer ${token}`)
			.send({
				room: roomId,
				user: userId
			});

		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Validation error');
		expect(res.body.errors[0].msg).toBe('message is required');
	});

	it('should return 401 if token is not provided on POST', async () => {
		const res = await request(app).post('/api/message').send({
			room: roomId,
			user: userId,
			message: messageContent
		});

		expect(res.statusCode).toBe(401);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe('Authentication token required');
	});
});
